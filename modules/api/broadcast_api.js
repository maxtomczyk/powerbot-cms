const knex = require('../knex')
const logger = require('../logger')
const incredbot = require('../incredbot')

async function listLabels(req, res) {
    try {
        const labels = await knex('channels')
        res.json(labels)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function create(req, res) {
    try {
        const body = req.body
        const message = await knex('messages').where('id', body.message_id).first()
        let schedule_time = null
        if (body.schedule) schedule_time = new Date(`${body.scheduleData.date}T${body.scheduleData.time}:00.000Z`)

        const creativeId = await incredbot.broadcast.createMessage(message.json)
        const insert = {
            creative_id: creativeId,
            channel_id: body.label_id,
            message_id: body.message_id,
            status: 'CREATED_MESSAGE',
            schedule_time
        }

        const [created] = await knex('broadcasts').insert(insert).returning('*')
        const label = await knex('channels').where('id', body.label_id).first()
        created.message_name = message.friendly_name
        created.label_name = label.friendly_name

        res.json(created)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function listBroadcasts(req, res) {
    try {
        const broadcasts = await knex('broadcasts as b').select('b.*', 'm.friendly_name as message_name', 'c.friendly_name as label_name').join('channels as c', 'c.id', 'b.channel_id').join('messages as m', 'b.message_id', 'm.id').orderBy('id', 'desc')
        res.json(broadcasts)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function push(req, res) {
    try {
        const broadcast = await knex('broadcasts as b').where('b.id', req.body.id).join('channels as c', 'c.id', 'b.channel_id').first()
        let options = {}
        if (broadcast.schedule_time) options.schedule_time = new Date(broadcast.schedule_time)
        const broadcastId = await incredbot.broadcast.send(broadcast.creative_id, broadcast.label_id, options)
        const pushed = await incredbot.broadcast.getBroadcast(broadcastId)

        await knex('broadcasts').update({
            status: pushed.status,
            broadcast_id: pushed.id
        }).where('id', req.body.id)

        pushed.db_id = req.body.id
        res.json(pushed)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function updateStatus(req, res) {
    try {
        const id = req.query.id
        const broadcast = await knex('broadcasts').where('id', id).first()
        let data = await incredbot.broadcast.getBroadcast(broadcast.broadcast_id)
        if (data.status !== 'IN_PROGRESS') {
            let rangeData = await incredbot.broadcast.getMetrics(broadcast.broadcast_id)
            const range = rangeData.data[0].values[0].value
            data.range = range
            const updated = await knex('broadcasts').update({
                status: data.status,
                range: range
            }).where('id', id)
        }

        res.json(data)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}
async function cancel(req, res) {
    try {
        const id = req.body.id
        const broadcast = await knex('broadcasts').where('id', id).first()
        let cancel = await incredbot.broadcast.cancel(broadcast.broadcast_id)
        let data = await incredbot.broadcast.getBroadcast(broadcast.broadcast_id)
        const updated = await knex('broadcasts').update('status', data.status).where('id', id)
        if (data.status !== 'CANCELED') {
            await knex('broadcasts').update('status', 'IN_PROGRESS').where('id', id)
            return res.json({
                id: broadcast.broadcast_id,
                status: 'IN_PROGRESS'
            })
        }

        res.json(data)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function remove(req, res) {
    try {
        const id = req.body.id
        await knex('broadcasts').where('id', id).del()

        res.sendStatus(200)
    } catch (e) {
        logger.error(e)
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
