const AWS = require('aws-sdk')
const util = require('util')
const fs = require('fs')
const crypto = require('crypto')
const knex = require('../knex')
const redis = require('../redis')
const redisHandler = require('../redis_handler')
const apiLogger = require('../api_logger')
const utils = require('../utilities')
const config = require('../../config/config')

const readFile = util.promisify(fs.readFile)
const randomBytes = util.promisify(crypto.randomBytes)

const S3 = new AWS.S3({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  Bucket: config.s3.bucketName
})

async function listPlugs (req, res) {
  try {
    let messages = null
    if (req.query.id) messages = await knex('messages as m').select('m.id', 'm.name', 'm.friendly_name', 'm.description', 'm.json', 'm.group_id', 'm.type').join('messages_groups as mg', 'mg.id', 'm.group_id').where('mg.id', req.query.id).orderBy('m.friendly_name', 'asc')
    else messages = await knex('messages').orderBy('friendly_name', 'asc')
    res.json(messages)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function listGroups (req, res) {
  try {
    const groups = await knex('messages_groups').orderBy('sort_index', 'asc')
    res.json(groups)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

function isUpdateValid (json) {
  for (const lang in json) {
    const message = json[lang]
    if (message === {}) return false
    if (message.texts && (message.texts.length === 0 || message.texts[0].length === 0)) return false
    if (message.quick_replies) {
      if (message.quick_replies.length > 10 || message.quick_replies.length < 0) return false
      message.quick_replies.map(qr => {
        if (qr.title.length > 20 || qr.title.length < 1) return false
      })
    }
    if (message.buttons) {
      if (message.buttons.length > 3 || message.buttons.length < 0) return false
      message.buttons.map(btn => {
        if (btn.title.length < 1 || btn.title.length > 20) return false
        if (btn.type === 'postback' && (btn.payload.length > 1000 || btn.payload.length < 1)) return false
        if (btn.type === 'web_url' && btn.url.length < 1) return false
      })
    }

    if (message.raw || message.raw === '') {
      if (message.raw.length < 1) return false
      try {
        JSON.parse(message.raw)
      } catch (e) {
        return false
      }
    }

    if (message.cards && message.cards.length) {
      let valid = true
      for (let card of message.cards) {
        if (!card.title || card.title.length > 80 || card.title.length < 0) {
          valid = false
          break
        }

        if (card.subtitle && card.subtitle.length > 80) {
          valid = false
          break
        }

        if (card.buttons && card.buttons.length) {
          if (card.buttons.length > 3 || card.buttons.length < 0) {
            valid = false
            break
          }

          for (let btn of card.buttons) {
            if (btn.title.length < 1 || btn.title.length > 20) {
              valid = false
              break
            }
            if (btn.type === 'postback' && (btn.payload.length > 1000 || btn.payload.length < 1)) {
              valid = false
              break
            }
            if (btn.type === 'web_url' && btn.url.length < 1) {
              valid = false
              break
            }
          }

          if (!valid) break
        }
      }
      if (!valid) return false
    }
  }
  return true
}

function clearTempValues (json, type) {
  for (const lang in json) {
    const message = json[lang]
    if (type === 'carousel' && message.cards && message.cards.length) {
      for (let card of message.cards) {
        delete card.image_type
        delete card.fetch_image
        delete card.resize_image
        delete card.image_changed
        delete card.prev_image_url
        if (card.subtitle && card.subtitle.length === 0) delete card.subtitle
        if (card.image_url && card.image_url.length === 0) delete card.image_url
        if (card.buttons && card.buttons.length === 0) delete card.buttons
      }
    }
  }
  return json
}

async function update (req, res) {
  try {
    const id = req.body.id
    let update = {
      json: req.body.json,
      type: req.body.type
    }
    const valid = isUpdateValid(update.json)
    update.json = clearTempValues(update.json, update.type)
    if (!valid) return res.sendStatus(403)

    const [updated] = await knex('messages').update(update).where('id', id).returning('*')
    apiLogger.info(`Updated message with id '${id}'.`, req)
    res.json(updated)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function remove (req, res) {
  try {
    const removed = await knex('messages').where('id', req.body.id).del()
    if (removed) {
      apiLogger.info(`Removed message with id '${req.body.id}'.`, req)
      res.sendStatus(200)
    } else res.sendStatus(400)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function listUnknownPhrases (req, res) {
  try {
    const phrases = await knex('unknown_phrases').limit(250)
    res.json(phrases)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function createPlug (req, res) {
  try {
    const languages = await knex('languages')
    req.body.json = {}
    req.body.type = 'text'
    languages.forEach(language => {
      req.body.json[language.locale] = {
        texts: [`${req.body.friendly_name || req.body.name} default text in ${language.name} (${language.locale}) language.`]
      }
    })
    const [created] = await knex('messages').insert(req.body).returning('*')
    apiLogger.info(`Created new message plug named '${req.body.name}'.`, req)
    res.json(created)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function flushCache (req, res) {
  try {
    const keys = await redisHandler.scan(`message:*`)
    await redis.delAsync('pattern-messages')
    await redis.delAsync('default-lang')
    await redis.delAsync('custom-postbacks')
    for (let key of keys) {
      await redis.delAsync(key.replace(config.redis.prefix, ''))
    }
    apiLogger.info(`Flushed cached messages.`, req)
    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function uploadImage (req, res) {
  try {
    let filePath = req.file.path
    let file = await readFile(filePath)
    let mimeType = req.file.mimetype

    if (!mimeType) return res.sendStatus(403)

    S3.upload({
      ACL: 'public-read',
      Body: file,
      Key: `uploads/images/generic_templates/${filePath.replace('uploads/', '')}`,
      Bucket: config.s3.bucketName,
      ContentType: mimeType
    }, (err, uploaded) => {
      if (err) {
        apiLogger.error(err)
        res.sendStatus(500)
        return
      }
      apiLogger.info(`Uploaded to S3: uploads/images/generic_templates/${filePath.replace('uploads/', '')}`, req)
      res.json({
        url: uploaded.Location
      })
    })
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function downloadBuffer (req, res) {
  try {
    const data = await utils.downloadFileToBuffer(req.query.url)
    apiLogger.info(`Downloaded to buffer ${req.query.url}, declared content type: ${data.mimeType}.`, req)
    if (data.mimeType !== 'image/jpeg' && data.mimeType !== 'image/png') return res.sendStatus(406)
    res.set('Content-Type', data.mimeType)
    res.end(new Buffer(data.buffer, 'binary'), 'binary')
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  listPlugs,
  listGroups,
  update,
  remove,
  listUnknownPhrases,
  createPlug,
  flushCache,
  uploadImage,
  downloadBuffer
}
