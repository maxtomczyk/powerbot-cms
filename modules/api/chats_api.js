const knex = require('../knex')
const User = require('../bot/models/User')
const apiLogger = require('../api_logger')

async function list (req, res) {
  try {
    let users = await knex('users').where('moderator_chat', true)
    res.json(users)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function unlock (req, res) {
  try {
    let u = new User()
    await u.disableModeratorChatWithId(req.body.id)
    apiLogger.info(`Disabled contact mode for user with id '${req.body.id}'`, req)
    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function lock (req, res) {
  try {
    await knex('users').update('bot_lock', true).where('id', req.body.id)
    apiLogger.info(`Enabled contact mode for user with id '${req.body.id}'`, req)
    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  list,
  unlock,
  lock
}
