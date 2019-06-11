const axios = require('axios')
const { ConcurrencyManager } = require('axios-concurrency')
const knex = require('../knex')
const apiLogger = require('../api_logger')
const incredbot = require('../incredbot')
const messages = require('../messages')
const utils = require('../utilities')

async function listLabels (req, res) {
  try {
    const labels = await knex('channels')
    res.json(labels)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function create (req, res) {
  try {
    const body = req.body
    let messageData = await knex('messages').where('id', body.message_id).first()
    let message = await messages.get(messageData.name)

    delete message.recipient
    delete message.messaging_type
    message = message.message

    let insert = {}

    if (body.mode === 'broadcast_api') {
      const creativeId = await incredbot.broadcast.createMessage(message)
      let scheduleTime = null

      if (body.schedule) scheduleTime = new Date(`${body.scheduleData.date}T${body.scheduleData.time}:00.000Z`)

      insert = {
        creative_id: creativeId,
        channel_id: body.label_id,
        message_id: body.message_id,
        status: 'CREATED_MESSAGE',
        schedule_time: scheduleTime,
        mode: body.mode
      }
    } else if (body.mode === 'loop') {
      insert = {
        creative_id: 0,
        channel_id: body.label_id,
        message_id: body.message_id,
        status: 'READY_TO_START',
        mode: body.mode,
        tag: body.tag
      }
    }

    const [created] = await knex('broadcasts').insert(insert).returning('*')
    const label = await knex('channels').where('id', body.label_id).first()
    created.message_name = messageData.friendly_name
    created.label_name = label.friendly_name
    apiLogger.info(`Created broadcast (${body.mode}) for label '${label.friendly_name}' based on message '${messageData.friendly_name}'.`, req)
    res.json(created)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function listBroadcasts (req, res) {
  try {
    const broadcasts = await knex('broadcasts as b').select('b.*', 'm.friendly_name as message_name', 'c.friendly_name as label_name').join('channels as c', 'c.id', 'b.channel_id').join('messages as m', 'b.message_id', 'm.id').orderBy('id', 'desc')
    res.json(broadcasts)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function push (req, res) {
  try {
    const broadcast = await knex('broadcasts as b').where('b.id', req.body.id).join('channels as c', 'c.id', 'b.channel_id').first()
    if (broadcast.mode === 'loop') return res.json({ useLoopEndpoint: true })

    let options = {
      messaging_type: 'MESSAGE_TAG',
      tag: 'NON_PROMOTIONAL_SUBSCRIPTION'
    }
    if (broadcast.schedule_time) options.schedule_time = new Date(broadcast.schedule_time)
    const broadcastId = await incredbot.broadcast.send(broadcast.creative_id, broadcast.label_id, options)
    const pushed = await incredbot.broadcast.getBroadcast(broadcastId)

    await knex('broadcasts').update({
      status: pushed.status,
      broadcast_id: pushed.id
    }).where('id', req.body.id)

    pushed.db_id = req.body.id
    apiLogger.info(`Started broadcast with id '${broadcast.id}'.`, req)
    res.json(pushed)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function updateStatus (req, res) {
  try {
    const id = req.query.id
    const broadcast = await knex('broadcasts').where('id', id).first()
    let data = await incredbot.broadcast.getBroadcast(broadcast.broadcast_id)
    if (data.status !== 'IN_PROGRESS') {
      let rangeData = await incredbot.broadcast.getMetrics(broadcast.broadcast_id)
      const range = rangeData.data[0].values[0].value
      data.range = range
      await knex('broadcasts').update({
        status: data.status,
        range: range
      }).where('id', id)
    }

    res.json(data)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}
async function cancel (req, res) {
  try {
    const id = req.body.id
    const broadcast = await knex('broadcasts').where('id', id).first()
    await incredbot.broadcast.cancel(broadcast.broadcast_id)
    let data = await incredbot.broadcast.getBroadcast(broadcast.broadcast_id)
    await knex('broadcasts').update('status', data.status).where('id', id)
    if (data.status !== 'CANCELED') {
      await knex('broadcasts').update('status', 'IN_PROGRESS').where('id', id)
      return res.json({
        id: broadcast.broadcast_id,
        status: 'IN_PROGRESS'
      })
    }

    apiLogger.info(`Canceled broadcast with id '${broadcast.id}'.`, req)
    res.json(data)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function remove (req, res) {
  try {
    const id = req.body.id
    await knex('broadcasts').where('id', id).del()
    apiLogger.info(`Removed broadcast with id '${id}'.`, req)
    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function loopMessage (broadcast, user) {
  try {
    let message = await messages.get(broadcast.message_id, user)
    message.messaging_type = 'MESSAGE_TAG'
    message.tag = broadcast.tag || 'NON_PROMOTIONAL_SUBSCRIPTION'
    return message
  } catch (e) {
    throw e
  }
}

async function loop (req, res) {
  try {
    const MAX_CONCURRENT_REQUESTS = 15
    const broadcast = await knex('broadcasts as b').where('b.id', req.body.id).join('channels as c', 'c.id', 'b.channel_id').first()
    if (!broadcast) return apiLogger.error(`No broadcast with provided id.`, req)
    const users = await knex('users as u').join('users_channels as uc', 'uc.user_id', 'u.id').where('uc.channel_id', broadcast.channel_id)
    apiLogger.info(`Started loop mode broadcast of message ${broadcast.message_id} in channel ${broadcast.channel_id}`, req)
    let messages = []
    for (let user of users) messages.push(await loopMessage(broadcast, user))
    let api = axios.create({
      baseURL: incredbot.send.api_url
    })
    const manager = ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS)
    const results = await Promise.all(messages.map(m => {
      return utils.reflect(api.post('', m))
    }))
    manager.detach()

    let errorsArr = []
    let successes = 0

    for (let r of results) {
      if (r.data && r.status && r.status.toString()[0] === '2') successes++
      else {
        if (r.response.data && r.response.data.error) errorsArr.push(r.response.data.error)
      }
    }

    apiLogger.info(`Loop mode broadcast finished with ${successes} successes and ${errorsArr.length} errors.`, req)
    if (errorsArr.length) apiLogger.info('Emission errors below:')
    errorsArr.map(e => apiLogger.error(`[${e.type}][${e.fbtrace_id}] ${e.message} (${e.code})`))
    let o = { range: successes, status: 'FINISHED' }
    await knex('broadcasts').update(o).where('id', req.body.id)
    o.db_id = req.body.id
    res.json(o)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  listLabels,
  create,
  listBroadcasts,
  push,
  updateStatus,
  cancel,
  remove,
  loop
}
