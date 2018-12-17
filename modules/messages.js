const format = require('string-template')
const knex = require('./knex')
const redis = require('./redis')
const logger = require('./logger')
const incredbot = require('./incredbot')
const config = require('../config/config')
const utilities = require('./utilities')

async function getFromDbOrCache (name, getById) {
  try {
    let message = await redis.getAsync(`message:${name}`)
    if (message) {
      message = JSON.parse(message)
      logger.debug(`Loaded message '${name}' (${message.id}) from cache memory.`)
      return message
    }

    if (!getById) message = await knex('messages').where('name', name).first()
    else message = await knex('messages').where('id', name).first()
    logger.debug(`Loaded message '${name}' (${message.id}) from database.`)
    redis.set(`message:${name}`, JSON.stringify(message), 'EX', config.redis.timeouts.messages)
    logger.debug(`Saved message '${name}' (${message.id}) to cache memory.`)
    return message
  } catch (e) {
    throw e
  }
}

async function getDefaultLanguage () {
  try {
    let lang = await redis.getAsync(`default-lang`)
    if (lang) {
      lang = JSON.parse(lang)
      logger.debug('Loaded default language from cache memory')
      return lang
    }

    lang = await knex('languages').where('default', true).first()
    logger.debug('Loaded default language from database')
    redis.set('default-lang', JSON.stringify(lang), 'EX', config.redis.timeouts.defaultLanguage)
    logger.debug('Saved default language to cache memory')
    return lang
  } catch (e) {
    throw e
  }
}

function getRandom (array) {
  return array[Math.floor(Math.random() * (array.length))]
}

async function getCoreMessage (name, user) {
  try {
    const getByIdMode = !isNaN(parseInt(name))
    const messages = await getFromDbOrCache(name, getByIdMode)
    const defaultLanguage = await getDefaultLanguage()

    let message = null
    if (user && messages.json[user.locale]) message = messages.json[user.locale]
    else message = messages.json[defaultLanguage.locale]

    if (message.texts) {
      const defaultGender = config.settings.defaultGender || 'male'
      user.gender = user.gender || defaultGender
      const genderInt = (user.gender === 'male') ? 0 : 1
      message.text = format(getRandom(message.texts), user)
      const genderMatches = utilities.matchAll(/\(\(\(([^\x00-\x7F]+|\w+|\s+)+\|([^\x00-\x7F]+|\w+|\s+)+\)\)\)/gi, message.text)

      for(const toReplace of genderMatches){
        const targetWord = toReplace.replace(/\(|\)/g, '').split('|')[genderInt]
        message.text = message.text.replace(toReplace, targetWord)
      }

      delete message.texts
    }

    switch (messages.type) {
      case 'text':
        message = new incredbot.Message.Text(message.text, {
          recipient_id: user.messenger_id
        })
        break

      case 'quick_replies':
        message = new incredbot.Message.QuickReplies(message.text, message.quick_replies, {
          recipient_id: user.messenger_id
        })
        break

      case 'buttons':
        message = new incredbot.Message.Buttons(message.text, message.buttons, {
          recipient_id: user.messenger_id
        })
        break

      case 'raw':
        message = JSON.parse(message.raw)
        break
    }
    return message
  } catch (e) {
    throw e
  }
}

async function get (name, user) {
  try {
    user = user || {}

    const message = await getCoreMessage(name, user)
    return new incredbot.Frame(message, user.messenger_id)
  } catch (e) {
    throw e
  }
}

module.exports = {
  getCoreMessage,
  get
}
