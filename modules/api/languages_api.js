const knex = require('../knex.js')
const logger = require('../logger.js')

async function list (req, res) {
  try {
    let languages = await knex('languages').orderBy('id', 'asc')
    res.json(languages)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  list
}
