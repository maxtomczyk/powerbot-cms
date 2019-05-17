const fs = require('fs')
const incredbot = require('./incredbot.js')
const logger = require('./logger.js')
const knex = require('./knex.js')
const redis = require('./redis.js')
const config = require('../config/config.js')

const User = require('./bot/models/User.js')

async function createGoogleAuthFile () {
  try {
    if (!config.dialogflow.enable) return
    const jsonPath = (config.hosting.provider !== 'nanobox') ? './gapi_key.json' : './storage/gapi_key.json'
    if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath)
    fs.writeFileSync(jsonPath, JSON.stringify(config.googleAuth))
    logger.info('Created Google Auth JSON file.')
  } catch (e) {
    logger.error('An error occured during Google Auth JSON file creation. Auth JSON is required when Dialogflow service is enabled.')
    throw e
  }
}

async function checkChannels () {
  try {
    let start = await knex('settings').where('name', 'channels_check').first()
    if (!JSON.parse(start.value)) return
    const localChannels = await knex('channels')
    const remoteChannels = await incredbot.broadcast.listLabels()
    const localNames = localChannels.map(chan => chan.name)

    for (let local of localChannels) {
      if (!local.label_id) {
        let remoteFound = false
        for (let remote of remoteChannels.data) {
          if (remote.name === local.name) {
            remoteFound = true
            await knex('channels').update('label_id', remote.id).where('id', local.id)
            break
          }
        }
        if (!remoteFound) {
          logger.info(`Didn't found label with name ${local.name} on remote. Creating a new one.`)
          const labelId = await incredbot.broadcast.createLabel(local.name)
          await knex('channels').update('label_id', labelId).where('id', local.id)
        }

        logger.info(`Setted label_id for channel ${local.name}`)
      } else {
        for (let remote of remoteChannels.data) {
          if (remote.id === local.label_id && remote.name === local.name) continue
          if (remote.name === local.name) {
            await knex('channels').update('label_id', remote.id).where('id', local.id)
            logger.info(`Changed label_id for ${local.name} due to label_id missmatch`)
          } else if (localNames.indexOf(remote.name) !== -1) {
            const newOne = await incredbot.broadcast.createLabel(local.name)
            await knex('channels').update('label_id', newOne).where('id', local.id)
            logger.info(`Created new remote label for local channel ${local.name}`)
          }
        }
      }
    }
    await knex('settings').update('value', 'false').where('name', 'channels_check')
    logger.info('Every local channel is connected to remote labels. Everything OK!')
  } catch (e) {
    throw e
  }
}

async function checkChannelsSync () {
  try {
    let start = await knex('settings').where('name', 'channels_sync_check').first()
    if (!JSON.parse(start.value)) return
    logger.info('Checking channels sync for all users. It can take a while. Logging for every user available on silly logging level.')

    let errors = 0

    const users = await knex('users').orderBy('id', 'asc')

    for (const userData of users) {
      const user = await new User(userData.messenger_id).loadOrCreate()
      logger.silly(`Starting channel sync procedure for user with ID ${user.id}`)
      try {
        await user.syncChannelsWithRemote()
      } catch (e) {
        logger.error(e)
        errors++
      }
    }
    await knex('settings').update('value', 'false').where('name', 'channels_sync_check')
    logger.info(`Channels sync procedure finished with ${errors} error(s)!`)
  } catch (e) {
    throw e
  }
}

async function checkChacheFlush () {
  try {
    let start = await knex('settings').where('name', 'flush_cache').first()
    if (!JSON.parse(start.value)) return

    logger.info('Flushing cache memory.')
    await knex('settings').update('value', 'false').where('name', 'flush_cache')
    redis.flushdb()
  } catch (e) {
    throw e
  }
}

async function checkFirstStart () {
  try {
    const exists = await knex('bot_data').where('name', 'first_start').first()
    if (!exists) {
      logger.info('Saving first start date.')
      await knex('bot_data').insert({
        name: 'first_start',
        editable: false,
        data: {
          timestamp: +new Date()
        }
      })
      return
    }
    const val = await knex('bot_data').where('name', 'first_start').first()
    if (!val.data.timestamp) {
      logger.info('Saving first start date.')
      await knex('bot_data').update('data', { timestamp: +new Date() }).where('name', 'first_start')
    }
  } catch (e) {
    throw e
  }
}

async function start () {
  try {
    await createGoogleAuthFile()
    await checkChannels()
    await checkChannelsSync()
    await checkChacheFlush()
    await checkFirstStart()
  } catch (e) {
    logger.error(e)
  }
}

module.exports = start
