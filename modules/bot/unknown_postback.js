const knex = require('../knex')
const redis = require('../redis')
const logger = require('../logger')
const config = require('../../config/config')

function wrapMessage (sender, message) {
  let m = {}
  m.recipient = {}
  m.recipient.id = sender
  m.message = message

  return m
}

async function loadCustomPostbacks () {
  try {
    let payloads = await redis.getAsync('custom-postbacks')
    if (payloads) {
      logger.silly('Loaded custom postbacks list from cache memory')
      return JSON.parse(payloads)
    }

    payloads = await knex('custom_postbacks as cp').join('messages as m', 'cp.message_id', 'm.id')
    redis.set('custom-postbacks', JSON.stringify(payloads), 'EX', config.redis.timeouts.botPatterns)
    logger.silly('Loaded custom postbacks from database and saved in cache memory')

    return payloads
  } catch (e) {
    throw e
  }
}

module.exports = async function (message, payload) {
  try {
    const patterns = await loadCustomPostbacks()
    let success = false

    for (const pattern of patterns) {
      if (pattern.postback === payload) {
        success = true
        await message.reply.raw(wrapMessage(message.sender_id, pattern.json))
        break
      }
    }
  } catch (e) {
    throw e
  }
}
