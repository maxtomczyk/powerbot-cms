const knex = require('../knex')
const logger = require('../logger')

async function list (req, res) {
  try {
    const q = req.query
    let messages = await knex('messages')
    if (q.id) {
      messages = messages.filter(m => {
        return parseInt(m.group_id) === parseInt(q.id)
      })
    }
    res.json(messages)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function create (req, res) {
  try {
    const insert = {
      friendly_name: req.body.name,
      description: req.body.description,
      json: req.body.message,
      group_id: req.body.group_id,
      name: req.body.name.replace(' ', '_').toLowerCase()
    }

    if (!insert.friendly_name || !insert.name || !insert.group_id) return res.sendStatus(400)

    const [inserted] = await knex('messages').insert(insert).returning('*')
    res.json(inserted)
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

module.exports = {
  list,
  create,
  remove,
  listUnknownPhrases
}
