const knex = require('../knex')
const apiLogger = require('../api_logger')

async function list (req, res) {
  try {
    const postbacks = await knex('custom_postbacks as cp').select('cp.*', 'm.friendly_name as message_name').join('messages as m', 'cp.message_id', 'm.id')
    res.json(postbacks)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function create (req, res) {
  try {
    const insert = {
      postback: req.body.postback,
      friendly_name: req.body.friendly_name,
      message_id: req.body.message_id
    }

    const [inserted] = await knex('custom_postbacks').insert(insert).returning('*')
    const [row] = await knex('custom_postbacks as cp').select('cp.*', 'm.friendly_name as message_name').join('messages as m', 'cp.message_id', 'm.id').where('cp.id', inserted.id)
    apiLogger.info(`Created new postback reaction - ${req.body.postback} => ${row.message_name}.`, req)
    res.json(row)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function remove (req, res) {
  try {
    const removed = await knex('custom_postbacks').where('id', req.body.id).del()
    if (removed) {
      res.sendStatus(200)
      apiLogger.info(`Removed postback reaction with id '${req.body.id}'.`, req)
    } else res.sendStatus(400)
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
