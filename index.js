const express = require('express')
const format = require('string-template')
const EventEmitter = require('events')
const path = require('path')

const config = require('./config/config.js')
const routes = require('./modules/routes.js')
const auth = require('./modules/auth.js')();
const User = require('./modules/bot/models/User.js')
const BotText = require('./modules/models/BotText.js')
const echo = require('./modules/bot/echo.js')
const staticElements = require('./modules/bot/static_elements.js')
const postback = require('./modules/bot/postbacks.js')
const startup = require('./modules/startup.js')
const logger = require('./modules/logger')
const unknownText = require('./modules/bot/unknown_text')
const unknownPostback = require('./modules/bot/unknown_postback')
const incredbot = require('./modules/incredbot.js')
const knex = require('./modules/knex.js')
const redis = require('./modules/redis.js')

staticElements()
startup()

class Emitter extends EventEmitter {}
const emitter = new Emitter();

const texts = new BotText()

const webhook = incredbot.Server.setup()
const app = webhook.server
const bot = webhook.bot

app.use('/', express.static(path.join(__dirname, 'dist')))
app.use('/static', express.static(path.join(__dirname, 'dist/static')))
app.use('/', routes)
app.use(auth.initialize())


bot.on('text', async (message, raw) => {
    try {
        let user = await new User(message.sender_id).loadOrCreate()
        if (user.bot_lock) return
        if (user.waiting_for_reason) {
            await knex('users').update({
                waiting_for_reason: false,
                chat_reason: message.text
            }).where('id', user.id)

            await message.reply.quick_replies(await getText('chat_reason_added', user), [new incredbot.Helpers.QuickReply('text', await getButton('chat_reason_given', user), 'BOT_MENU')])
            return
        }

        emitter.emit('text', message, user, raw)
    } catch (e) {
        logger.error(e)
    }
})

bot.on('payload', async (message, raw) => {
    try {
        let user = await new User(message.sender_id).loadOrCreate()
        if (user.bot_lock) return

        await postback(message, user)
        emitter.emit('payload', message, user, raw)
    } catch (e) {
        logger.error(e)
    }
})

bot.on('echo', async (message, raw) => {
    try {
        let user = await new User(message.recipient_id)
        echo(message, user)

        emitter.emit('echo', message, user, raw)
    } catch (e) {
        logger.error(e)
    }
})

async function getText(text, user) {
    if (!user) user = {}
    return format(await texts.get(text, user.locale), user)
}

async function getButton(text, user) {
    if (!user) user = {}
    return await texts.getButton(text, user.locale)
}
module.exports = {
    server: app,
    utils: {
        handleText: unknownText,
        handlePostback: unknownPostback
    },
    bot: emitter,
    getText: getText,
    getButton: getButton,
    incredbot: incredbot,
    knex: knex,
    redis: redis,
    logger: logger,
    User: User
}