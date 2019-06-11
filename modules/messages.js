const format = require('string-template')
const knex = require('./knex')
const redisHandler = require('./redis_handler')
const logger = require('./logger')
const incredbot = require('./incredbot')
const config = require('../config/config')
const utilities = require('./utilities')

async function getFromDbOrCache (name, getById) {
  try {
    let message = await redisHandler.get(`message:${name}`)
    if (message) {
      message = JSON.parse(message)
      logger.silly(`Loaded message '${name}' (${message.id}) from cache memory.`)
      return message
    }

    if (!getById) message = await knex('messages').where('name', name).first()
    else message = await knex('messages').where('id', name).first()
    logger.silly(`Loaded message '${name}' (${message.id}) from database.`)
    redisHandler.set(`message:${name}`, JSON.stringify(message), config.redis.timeouts.messages)
    logger.silly(`Saved message '${name}' (${message.id}) to cache memory.`)
    return message
  } catch (e) {
    throw e
  }
}

async function getDefaultLanguage () {
  try {
    let lang = await redisHandler.get(`default-lang`)
    if (lang) {
      lang = JSON.parse(lang)
      logger.silly('Loaded default language from cache memory')
      return lang
    }

    lang = await knex('languages').where('default', true).first()
    logger.silly('Loaded default language from database')
    redisHandler.set('default-lang', JSON.stringify(lang), config.redis.timeouts.defaultLanguage)
    logger.silly('Saved default language to cache memory')
    return lang
  } catch (e) {
    throw e
  }
}

function getRandom (array) {
  return array[Math.floor(Math.random() * (array.length))]
}

function render (messages, user, renderData, defaultLanguage) {
  let message = null
  if (user && messages.json[user.locale]) message = messages.json[user.locale]
  else message = messages.json[defaultLanguage.locale]

  if (message.texts) {
    const defaultGender = config.settings.defaultGender || 'male'
    user.gender = user.gender || defaultGender
    const genderInt = (user.gender === 'male') ? 0 : 1
    message.text = format(getRandom(message.texts), renderData)
    // eslint-disable-next-line
    const genderMatches = utilities.matchAll(/\(\(\(([^\x00-\x7F]+|\w+|\s+)+\|([^\x00-\x7F]+|\w+|\s+)+\)\)\)/gi, message.text)

    for (const toReplace of genderMatches) {
      const targetWord = toReplace.replace(/\(|\)/g, '').split('|')[genderInt]
      message.text = message.text.replace(toReplace, targetWord)
    }

    delete message.texts
  }

  switch (messages.type) {
    case 'text':
      {
        const qrEnabled = message.settings && message.settings.quick_replies
        const qrs = message.quick_replies
        message = new incredbot.Message.Text(message.text, {
          recipient_id: user.messenger_id
        })
        if (qrEnabled) message.quick_replies = qrs
      }
      break

    case 'buttons':
      {
        const qrEnabled = message.settings && message.settings.quick_replies
        const qrs = message.quick_replies
        message = new incredbot.Message.Buttons(message.text, message.buttons, {
          recipient_id: user.messenger_id
        })
        if (qrEnabled) message.quick_replies = qrs
      }
      break

    case 'carousel':
      {
        const qrEnabled = message.settings && message.settings.quick_replies
        const qrs = message.quick_replies
        const aspectRatio = message.settings.aspect_ratio || null
        for (let card of message.cards) {
          card.title = format(card.title, renderData)
          card.subtitle = format(card.subtitle, renderData)
        }
        message = new incredbot.Message.Generic(message.cards)
        if (aspectRatio) message.attachment.payload.image_aspect_ratio = aspectRatio
        if (qrEnabled) message.quick_replies = qrs
      }
      break

    case 'raw':
      message = JSON.parse(message.raw)
      break
  }
  return message
}

async function getCoreMessage (name, user, renderData) {
  try {
    const getByIdMode = !isNaN(parseInt(name))
    const messages = await getFromDbOrCache(name, getByIdMode)
    const defaultLanguage = await getDefaultLanguage()

    return render(messages, user, renderData, defaultLanguage)
  } catch (e) {
    throw e
  }
}

async function get (name, user, renderData) {
  try {
    user = user || {}
    renderData = renderData || {}
    renderData.first_name = user.first_name
    renderData.last_name = user.last_name
    const message = await getCoreMessage(name, user, renderData)
    return new incredbot.Frame(message, user.messenger_id)
  } catch (e) {
    throw e
  }
}

module.exports = {
  getCoreMessage,
  get,
  getDefaultLanguage,
  render
}
