const knex = require('../knex')
const redis = require('../redis')
const logger = require('../logger')
const config = require('../../config/config')

async function loadRegexMessages () {
  try {
    let rMessages = await redis.getAsync('pattern-messages')
    if (rMessages) {
      logger.silly('Pattern messages loaded from cache memory')
      return JSON.parse(rMessages)
    }
    rMessages = await knex('regex_reactions as rr').join('messages as m', 'rr.message_id', 'm.id')

    redis.set('pattern-messages', JSON.stringify(rMessages), 'EX', config.redis.timeouts.regexTable)
    logger.silly('Pattern messages loaded from database and saved to cache memory')

    return rMessages
  } catch (e) {
    throw e
  }
}

module.exports = {
  loadRegexMessages
}
