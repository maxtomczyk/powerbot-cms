const knex = require('./knex.js')
const redisHandler = require('./redis_handler.js')
const logger = require('./logger.js')
const config = require('../config/config.js')

async function get (id) {
  try {
    let aId = await redisHandler.get(`attachment-id:${id}`)
    logger.silly(`Attachment '${id}' found in cache memory!`)

    if (aId) return aId

    let row = await knex('attachments').where('name', id).first()
    if (!row) return null
    logger.silly(`Attachment '${id}' fetched from database`)
    aId = row.attachment_id
    logger.silly(`Saving attachment '${id}' to cache memory`)
    redisHandler.set(`attachment-id:${id}`, aId, config.redis.timeouts.attachments)

    return aId
  } catch (e) {
    throw e
  }
}

module.exports = {
  get
}
