const knex = require('../knex.js')
const apiLogger = require('../api_logger.js')

async function list (req, res) {
  try {
    const keywords = await knex('regex_reactions as rr').select('rr.*', 'm.friendly_name as message_name').join('messages as m', 'rr.message_id', 'm.id').orderBy('rr.id', 'asc')
    res.json(keywords)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function create (req, res) {
  try {
    const body = req.body
    const insert = {
      message_id: body.message_id,
      regex_flags: body.regex_flags,
      regex_body: body.regex_body,
      friendly_name: body.friendly_name
    }

    const [created] = await knex('regex_reactions').insert(insert).returning('*')
    const message = await knex('messages').where('id', created.message_id).first()
    created.message_name = message.friendly_name
    apiLogger.info(`Created new keyword reaction - (/${body.regex_body}/${body.regex_flags}) => ${message.friendly_name}.`, req)
    res.json(created)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function remove (req, res) {
  try {
    await knex('regex_reactions').where('id', req.body.id).del()
    apiLogger.info(`Removed keyword reaction with id '${req.body.id}'.`, req)
    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  list,
  create,
  remove
}
