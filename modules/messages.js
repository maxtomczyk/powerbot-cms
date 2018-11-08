const format = require('string-template')
const knex = require('./knex')
const redis = require('./redis')
const logger = require('./logger')
const config = require('../config/config')

async function getFromDbOrCache(name) {
  try {
    let message = await redis.getAsync(`message:${name}`)
    if (message) {
      message = JSON.parse(message)
      logger.debug(`Loaded message '${name}' (${message.id}) from cache memory.`)
      return message
    }

    message = await knex('messages').where('name', name).first()
    logger.debug(`Loaded message '${name}' (${message.id}) from database.`)
    redis.set(`message:${name}`, JSON.stringify(message), 'EX', config.redis.timeouts.messages)
    logger.debug(`Saved message '${name}' (${message.id}) to cache memory.`)
    return message
  } catch (e) {
    throw e
  }
}

function getRandom(array) {
  return array[Math.floor(Math.random() * (array.length - 1))]
}

async function get(name, user) {
  try {
    const messages = await getFromDbOrCache(name)
    const defaultLanguage = await knex('languages').where('default', true).first()
    let message = null
    if (user && messages.json[user.locale]) message = messages.json[user.locale]
    else message = messages.json[defaultLanguage.locale]

    if (message.texts) {
      message.text = format(getRandom(message.texts), user)
      delete message.texts
    }

    switch (messages.type) {
      case 'text':
        message = {
          text: message.text
        }
        break

      case 'quick_replies':
        message = {
          text: message.text,
          quick_replies: message.quick_replies
        }
        break

      case 'raw':
        message = JSON.parse(message.raw)
        break

      case 'buttons':
        message = {
          text: message.text,
          buttons: message.buttons
        }
        break
    }
    return message
  } catch (e) {
    throw e
  }
}

module.exports = {
  get
}
