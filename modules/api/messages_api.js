const knex = require('../knex')
const logger = require('../logger')

async function listPlugs (req, res) {
  try {
    let messages = await knex('messages')
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

async function create (req, res) {
  try {
    const id = req.body.id
    const update = {
      json: req.body.json,
      type: req.body.type
    }

    const [updated] = await knex('messages').update(update).where('id', id).returning('*')
    console.log(updated)
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
  create,
  remove,
  listUnknownPhrases,
  createPlug
}
