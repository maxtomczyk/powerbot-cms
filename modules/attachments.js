const knex = require('./knex.js')
const redis = require('./redis.js')
const logger = require('./logger.js')
const config = require('../config/config.js')

async function get (id) {
  try {
    let aId = await redis.getAsync(`attachment-id:${id}`)
    logger.debug(`Attachment '${id}' found in cache memory!`)

    if (aId) return aId

    let row = await knex('attachments').where('name', id).first()
    if (!row) return null
    logger.debug(`Attachment '${id}' fetched from database`)
    aId = row.attachment_id
    logger.debug(`Saving attachment '${id}' to cache memory`)
    redis.set(`attachment-id:${id}`, aId, 'EX', config.redis.timeouts.attachments)

    return aId
  } catch (e) {
      throw e
  }
}

module.exports = {
  get
}
