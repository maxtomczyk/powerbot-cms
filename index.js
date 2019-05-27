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
const PostbackSimulator = require('./modules/bot/models/PostbackSimulator')

const stats = new Stats()

process.env.POWERBOT_CMS_VERSION = JSON.parse(fs.readFileSync('./node_modules/powerbot-cms/package.json', 'utf8')).version

function convertBoolToReadable (s) {
  if (s) return 'enabled'
  else return 'disabled'
}

function logSummary () {
  let mode = (process.env.NODE_ENV === 'production') ? 'production' : 'non-production'
  logger.info(`Running in ${mode} mode.`)
  logger.info(`Cron jobs timezone: ${config.settings.statsCollectorTimezone || 'Europe/London'}`)
  if (config.s3.autoDbDump) logger.info(`Database auto-dump is enabled. Cron expression for dump: ${config.settings.dbDumpCron}`)
  if (config.s3.streamLogs) logger.info(`Logs straming is enabled. Logs from CMS system will be stored on S3 instance in ${config.s3.logsCatalog}.`)
  if (config.dialogflow.enable) logger.info(`Dialogflow integration is enabled. Session timeout: ${config.dialogflow.sessionTimeout} seconds`)
  logger.info(`Moderator hours message usage is ${convertBoolToReadable(config.settings.useModeratorHours)}`)
  logger.info(`Moderator chat in progress message usage is ${convertBoolToReadable(config.settings.useChatInProgressMessage)}`)
  logger.info(`Gender fallback is ${config.settings.defaultGender}`)
  if (config.settings.usersAdditionalData.length) logger.info(`Using following additional user data: ${config.settings.usersAdditionalData.replace(' ', ', ')}`)
  console.log()
}

function logWarnings () {
  console.log()
  if (!config.facebook.access_token) logger.warn('No facebook access token defined.')
  if (process.env.NODE_ENV === 'production') {
    if (config.jwt.secret.length < 32) logger.warn('Configured JWT Secret String can be insecure (shorter than 32 chars).')
    if (!config.s3.autoDbDump) logger.warn('Database auto-dump is disabled.')
    if (!config.s3.streamLogs) logger.warn('Logs streaming is disabled. Logs from CMS will not be stored on S3')
    if (!config.email.host || !config.email.port || !config.email.login || !config.email.password) logger.warn('No email account configured.')
  }
  console.log()
}

logger.info(`Welcome to Powerbot CMS ${process.env.POWERBOT_CMS_VERSION}. Loading amazing stuff...`)

if (config.settings.extendedSummary) {
  logSummary()
  setTimeout(logWarnings, 2000)
}
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
    if (user.waiting_for_reason) {
      await knex('users').update({
        waiting_for_reason: false,
        chat_reason: message.text
      }).where('id', user.id)
      user.chat_reason = message.text
      emails.broadcastChatRequestMail(user)
      return
    }

    if (user.bot_lock) return
    if (config.settings.useChatInProgressMessage && user.moderator_chat) await message.reply.raw(await messages.get('chat_in_progress', user))

    emitter.emit('text', message, user, raw)
  } catch (e) {
    logger.error(e)
  }
})

const allowedPostbacks = ['CONTACT_UNLOCK_BOT', 'CONTACT_END']
bot.on('payload', async (message, raw) => {
  try {
    let user = await new User(message.sender_id).loadOrCreate()
    if (user.bot_lock && allowedPostbacks.indexOf(message.payload) === -1) return

    stats.incomingPayload(message, user)
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
    let user = await new User(message.sender_id).loadOrCreate()
    emitter.emit('message', message, raw)
    stats.incomingMessage(message, user)
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
  attachments: attachments,
  PostbackSimulator
}
