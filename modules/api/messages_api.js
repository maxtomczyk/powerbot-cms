const knex = require('../knex')
const logger = require('../logger')

async function listPlugs (req, res) {
  try {
    let messages = null
    if (req.query.id) messages = await knex('messages as m').select('m.id', 'm.name', 'm.friendly_name', 'm.description', 'm.json', 'm.group_id', 'm.type').join('messages_groups as mg', 'mg.id', 'm.group_id').where('mg.id', req.query.id).orderBy('m.friendly_name', 'asc')
    else messages = await knex('messages').orderBy('friendly_name', 'asc')
    res.json(messages)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function listGroups (req, res) {
  try {
    const groups = await knex('messages_groups')
    res.json(groups)
  } catch (e) {
    logger.error(e)
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
  }
  return true
}

async function update (req, res) {
  try {
    const id = req.body.id
    const update = {
      json: req.body.json,
      type: req.body.type
    }
    const valid = isUpdateValid(update.json)
    if (!valid) return res.sendStatus(403)

    const [updated] = await knex('messages').update(update).where('id', id).returning('*')
    res.json(updated)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function remove (req, res) {
  try {
    const removed = await knex('messages').where('id', req.body.id).del()
    if (removed) res.sendStatus(200)
    else res.sendStatus(400)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function listUnknownPhrases (req, res) {
  try {
    const phrases = await knex('unknown_phrases').limit(250)
    res.json(phrases)
  } catch (e) {
    logger.error(e)
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
    res.json(created)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  listPlugs,
  listGroups,
  update,
  remove,
  listUnknownPhrases,
  createPlug
}
