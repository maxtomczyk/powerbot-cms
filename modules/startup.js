const incredbot = require('./incredbot.js')
const logger = require('./logger.js')
const knex = require('./knex.js')

const User = require('./bot/models/User.js')

async function checkAttachments() {
  try {
    let attachments = await knex('attachments').where('force_update', true).orWhere('attachment_id', null)
    if (!attachments.length > 0) return logger.info(`All attachment's up to date`)
    logger.info(`${attachments.length} attachment(s) to update. Starting update process...`)

    let errors = 0
    for (let attachment of attachments) {
      try {
        let attachment_id = null
        let ext = /.\w*$/gmi.exec(attachment.url)[0]

        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') attachment_id = await incredbot.upload.fromUrl('image', attachment.url)
        else attachment_id = await incredbot.upload.fromUrl('video', attachment.url)

        await knex('attachments').update({
          attachment_id: attachment_id,
          force_update: false
        }).where('id', attachment.id)

        logger.info(`${attachment.name} : Uploaded`)
      } catch (e) {
        logger.error(`${attachment.name} : ${e.response.data.error.message}`)
        errors++
      }
    }

    if (errors === 0) logger.info('All attachments updates finished')
    else logger.warn(`Finished attachments updates with ${errors} error(s). Details are logged above`)
  } catch (e) {
    throw e
  }
}

async function checkChannels() {
  try {
    let start = await knex('settings').where('name', 'channels_check').first()
    if (!JSON.parse(start.value)) return
    const localChannels = await knex('channels')
    const remoteChannels = await incredbot.broadcast.listLabels()
    const localNames = localChannels.map(chan => chan.name)

    for (local of localChannels) {
      if (!local.label_id) {
        let remoteFound = false
        for (remote of remoteChannels.data) {
          if (remote.name === local.name) {
            remoteFound = true
            await knex('channels').update('label_id', remote.id).where('id', local.id)
            break
          }
        }
        if (!remoteFound) {
          logger.info(`Didn't found label with name ${local.name} on remote. Creating new one.`)
          const labelId = await incredbot.broadcast.createLabel(local.name)
          await knex('channels').update('label_id', labelId).where('id', local.id)
        }

        logger.info(`Setted label_id for channel ${local.name}`)
      } else {
        for (remote of remoteChannels.data) {
          if (remote.id === local.label_id && remote.name === local.name) continue;
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

async function checkChannelsSync() {
  try {
    let start = await knex('settings').where('name', 'channels_sync_check').first()
    if (!JSON.parse(start.value)) return
    logger.info('Checking channels sync for all users. It can take a lot of time, logging for each user start.')

    let errors = 0

    const users = await knex('users').orderBy('id', 'asc')

    for (const userData of users) {
      const user = await new User(userData.messenger_id).loadOrCreate()
      logger.info(`Starting channel sync procedure for user ${user.id}`)
      try {
        await user.syncChannelsWithRemote()
      } catch (e) {
        logger.error(e)
        errors++;
      }
    }
    await knex('settings').update('value', 'false').where('name', 'channels_sync_check')
    logger.info(`Channels sync procedure finished with ${errors} error(s)!`)
  } catch (e) {
    throw e
  }
}

async function checkFirstStart() {
  try {
    const exists = await knex('bot_data').where('name', 'first_start').first()
    if (exists) return
    logger.info('Saving first start date.')
    await knex('bot_data').insert({
      name: 'first_start',
      editable: false,
      data: {
        timestamp: +new Date()
      }
    })
  } catch (e) {
    throw e
  }
}

async function start() {
  try {
    await checkChannels()
    await checkChannelsSync()
    await checkFirstStart()
  } catch (e) {
    logger.error(e)
    console.error(e);
  }
}

module.exports = start
