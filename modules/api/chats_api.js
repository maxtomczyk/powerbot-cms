const knex = require('../knex.js')
const User = require('../bot/models/User.js')
const logger = require('../logger.js')

async function list(req, res) {
    try {
        let users = await knex('users').where('moderator_chat', true)
        res.json(users)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function unlock(req, res) {
    try {
        let u = new User()
        await u.disableModeratorChatWithId(req.body.id)
        res.sendStatus(200)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function lock(req, res){
    try {
        await knex('users').update('bot_lock', true).where('id', req.body.id)
        res.sendStatus(200)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

module.exports = {
    list,
    unlock,
    lock
}
