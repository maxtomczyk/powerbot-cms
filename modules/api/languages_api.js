const knex = require('../knex.js')
const apiLogger = require('../api_logger.js')

async function list (req, res) {
  try {
    let languages = await knex('languages').orderBy('id', 'asc')
    res.json(languages)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  list
}
