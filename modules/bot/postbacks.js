const User = require('./models/User')
const BotData = require('./models/BotData')

const messages = require('../messages')
const config = require('../../config/config.js')
const botData = new BotData()

module.exports = async function (message, user) {
  const payload = message.payload

  switch (payload) {
    case 'CONTACT':
      if (config.settings.useModeratorHours) {
        const moderatorHours = await botData.get('moderator_hours')
        const todayHours = moderatorHours[new Date().getDay()]

        if (!todayHours.from || !todayHours.to) {
          await message.reply.raw(await messages.get('contact_no_moderator_time', user))
          await message.reply.raw(await messages.get('contact_question', user))
          return
        }

        const startHours = parseInt(todayHours.from.substring(0, 2))
        const startMinutes = parseInt(todayHours.from.substring(3, 5))
        const endHours = parseInt(todayHours.to.substring(0, 2))
        const endMinutes = parseInt(todayHours.to.substring(3, 5))
        const now = new Date()
        let start = new Date()
        let end = new Date()

        start.setHours(startHours, startMinutes, 0, 0)
        end.setHours(endHours, endMinutes, 0, 0)

        if (start > now || now > end) await message.reply.raw(await messages.get('contact_no_moderator_time', user))
      }
      await message.reply.raw(await messages.get('contact_question', user))
      break

    case 'CONTACT_CONFIRM':
      {
        let u = new User(user.messenger_id)
        await u.enableModeratorChat()
        await message.reply.raw(await messages.get('contact_confirmed', user))
      }
      break

    case 'CONTACT_CANCEL':
      await message.reply.raw(await messages.get('contact_canceled', user))
      break

    case 'CONTACT_END':
      {
        let u = new User(user.messenger_id)
        await u.disableModeratorChat(true)
        await message.reply.raw(await messages.get('contact_ended_by_user', user))
      }
      break

    case 'CONTACT_UNLOCK_BOT':
      {
        console.log('xd')
        let u = new User(user.messenger_id)
        await u.disableChatLock()
        await message.reply.raw(await messages.get('contact_bot_unlocked', user))
      }
      break

    case 'CLEAR_USER_DATA':
      await message.reply.raw(await messages.get('user_data_remove', user))
      break

    case 'REMOVE_USER_DATA':
      {
        let u = new User(user.messenger_id)
        await u.removeFromDatabase()
        await message.reply.raw(await messages.get('user_data_removed', user))
      }
      break

    case 'CLEAR_USER_DATA_CANCEL':
      await message.reply.raw(await messages.get('user_data_remove_canceled', user))
      break

    default:
      break
  }
}
