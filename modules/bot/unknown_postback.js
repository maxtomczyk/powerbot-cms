const knex = require('../knex')
const redisHandler = require('../redis_handler')
const logger = require('../logger')
const messages = require('../messages')
const config = require('../../config/config')

async function loadCustomPostbacks () {
  try {
    let payloads = await redisHandler.get('custom-postbacks')
    if (payloads) {
      logger.silly('Loaded custom postbacks list from cache memory')
      return JSON.parse(payloads)
    }

    payloads = await knex('custom_postbacks as cp').join('messages as m', 'cp.message_id', 'm.id')
    redisHandler.set('custom-postbacks', JSON.stringify(payloads), config.redis.timeouts.postbacksTable)
    logger.silly('Loaded custom postbacks from database and saved in cache memory')

    return payloads
  } catch (e) {
    throw e
  }
}

module.exports = async function (message, user) {
  try {
    const patterns = await loadCustomPostbacks()
    const payload = message.payload

    for (const pattern of patterns) {
      if (pattern.postback === payload) {
        await message.reply.raw(await messages.get(pattern.message_id, user))
        break
      }
    }
  } catch (e) {
    throw e
  }
}
