const express = require('express')
const EventEmitter = require('events')
const path = require('path')
const fs = require('fs')

const config = require('./config/config')
const routes = require('./modules/routes')
const customRoutes = require('./modules/custom_routes')
const auth = require('./modules/auth')()
const User = require('./modules/bot/models/User')
const Stats = require('./modules/models/Stats')
const echo = require('./modules/bot/echo')
const postback = require('./modules/bot/postbacks')
const startup = require('./modules/startup')
const logger = require('./modules/logger')
const unknownText = require('./modules/bot/unknown_text')
const unknownPostback = require('./modules/bot/unknown_postback')
const incredbot = require('./modules/incredbot')
const knex = require('./modules/knex')
const redis = require('./modules/redis')
const messages = require('./modules/messages')
const attachments = require('./modules/attachments')
const jobs = require('./modules/jobs')
const emails = require('./modules/emails')

const stats = new Stats()

const version  = JSON.parse(fs.readFileSync('./node_modules/powerbot-cms/package.json', 'utf8')).version

logger.info(`Welcome to Powerbot CMS ${version}. Loading amazing stuff...`)

startup()
jobs.start()

class Emitter extends EventEmitter { }
const emitter = new Emitter()

const webhook = incredbot.Server.setup()
const app = webhook.server
const bot = webhook.bot

app.use('/', express.static(path.join(__dirname, 'dist')))
app.use('/static', express.static(path.join(__dirname, 'dist/static')))
app.use('/custom_api', customRoutes)
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
      user.chat_reason = message.text
      await message.reply.raw(await messages.get('contact_message_saved', user))
      emails.broadcastChatRequestMail(user)
      return
    }

    if (config.settings.useChatInProgressMessage && user.moderator_chat) await message.reply.raw(await messages.get('chat_in_progress', user))

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

bot.on('comment', async (message, raw) => {
  try {
    emitter.emit('comment', message, raw)
  } catch (e) {
    logger.error(e)
  }
})

bot.on('entry', async (entry) => {
  try {
    emitter.emit('entry', entry)
  } catch (e) {
    logger.error(e)
  }
})

bot.on('message', async (message, raw) => {
  try {
    emitter.emit('message', message, raw)
    stats.incomingMessage(message)
  } catch (e) {
    logger.error(e)
  }
})

bot.on('location', async (message, raw) => {
  try {
    let user = await new User(message.sender_id).loadOrCreate()
    if (user.bot_lock) return

    emitter.emit('location', message, user, raw)
  } catch (e) {
    logger.error(e)
  }
})

bot.on('image', async (message, raw) => {
  try {
    let user = await new User(message.sender_id).loadOrCreate()
    if (user.bot_lock) return

    emitter.emit('image', message, user, raw)
  } catch (e) {
    logger.error(e)
  }
})

bot.on('message_sent', async (message, raw) => {
  try {
    stats.outgoingMessage(message)
  } catch (e) {
    logger.error(e)
  }
})

bot.on('log', log => {
  logger.log(log.level, log.message)
})

module.exports = {
  server: app,
  utils: {
    handleText: unknownText,
    handlePostback: unknownPostback
  },
  bot: emitter,
  incredbot: incredbot,
  knex: knex,
  redis: redis,
  logger: logger,
  User: User,
  messages: messages,
  attachments: attachments
}
