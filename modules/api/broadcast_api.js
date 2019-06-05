const knex = require('../knex')
const apiLogger = require('../api_logger')
const incredbot = require('../incredbot')
const messages = require('../messages')

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

    let scheduleTime = null
    if (body.schedule) scheduleTime = new Date(`${body.scheduleData.date}T${body.scheduleData.time}:00.000Z`)

    delete message.recipient
    delete message.messaging_type
    message = message.message

    const creativeId = await incredbot.broadcast.createMessage(message)
    const insert = {
      creative_id: creativeId,
      channel_id: body.label_id,
      message_id: body.message_id,
      status: 'CREATED_MESSAGE',
      schedule_time: scheduleTime
    }

    const [created] = await knex('broadcasts').insert(insert).returning('*')
    const label = await knex('channels').where('id', body.label_id).first()
    created.message_name = messageData.friendly_name
    created.label_name = label.friendly_name
    apiLogger.info(`Created broadcast for label '${label.friendly_name}' based on message '${messageData.friendly_name}'.`, req)
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

module.exports = {
  listLabels,
  create,
  listBroadcasts,
  push,
  updateStatus,
  cancel,
  remove
}
