const User = require('./models/User')
const BotData = require('./models/BotData')

const messages = require('../messages')
const knex = require('../knex')
const incredbot = require('../incredbot')
const config = require('../../config/config.js')
const botData = new BotData()

module.exports = async function (message, user) {
  try {
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

      case /^NOTIFICATIONS_CHANNELS_[0-9]*$/.test(payload) && payload:
        {
          const page = parseInt(payload.replace('NOTIFICATIONS_CHANNELS_', ''))
          const channels = await knex('channels').orderBy('friendly_name', 'asc').whereNot('hidden', true).limit(11).offset(page * 10)
          let userChannels = await knex('users_channels').where('user_id', user.id)
          userChannels = userChannels.map(ch => ch.channel_id)
          const cardMsg = await knex('messages').where('name', 'subscriptions_menu').first()
          const defLang = await messages.getDefaultLanguage()
          let qrs = null
          const cards = channels.map(ch => {
            const status = (userChannels.indexOf(ch.id) !== -1)
            ch.statusEmoji = (status) ? '✅' : '🚫'
            let rendered = messages.render(JSON.parse(JSON.stringify(cardMsg)), user, ch, defLang)
            if (!qrs) qrs = rendered.quick_replies
            if (rendered.attachment.payload.elements[0].buttons[0].payload === '<TEMP_PAYLOAD_SUBSCRIBE>') {
              if (status) rendered.attachment.payload.elements[0].buttons.splice(0, 1)
              else rendered.attachment.payload.elements[0].buttons.splice(1, 1)
            } else {
              if (status) rendered.attachment.payload.elements[0].buttons.splice(1, 1)
              else rendered.attachment.payload.elements[0].buttons.splice(0, 1)
            }
            if (status) rendered.attachment.payload.elements[0].buttons[0].payload = `UNSUBSCRIBE_CHANNEL_${ch.id}_FROM_${page}`
            else rendered.attachment.payload.elements[0].buttons[0].payload = `SUBSCRIBE_CHANNEL_${ch.id}_FROM_${page}`
            return rendered.attachment.payload.elements[0]
          })

          let toRemove = []
          qrs.map((qr, i) => {
            if (qr.payload === '<TEMP_PAYLOAD_NEXT_PAGE>') {
              if (channels.length > 10) qr.payload = `NOTIFICATIONS_CHANNELS_${page + 1}`
              else toRemove.push(i)
            }
            if (qr.payload === '<TEMP_PAYLOAD_PREV_PAGE>') {
              if (page > 0) qr.payload = `NOTIFICATIONS_CHANNELS_${page - 1}`
              else toRemove.push(i)
            }
          })

          for (let i = qrs.length; i >= 0; i--) {
            if (toRemove.indexOf(i) !== -1) qrs.splice(i, 1)
          }

          let m = {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: cards
              }
            },
            quick_replies: qrs
          }
          if (m.attachment.payload.elements.length === 11) m.attachment.payload.elements.pop()
          await message.reply.raw(new incredbot.Frame(m, user.messenger_id))
        }
        break
      case /^SUBSCRIBE_CHANNEL_[0-9]*_FROM_[0-9]*$/.test(payload) && payload:
        {
          const id = parseInt(payload.replace('SUBSCRIBE_CHANNEL_', '').replace(/_FROM_[0-9]*/gi, ''))
          const from = parseInt(payload.replace(/SUBSCRIBE_CHANNEL_[0-9]*_FROM_/gi, ''))
          const channel = await knex('channels').where('id', id).first()
          await user.addToChannel(channel.name)
          let m = await messages.get('subscription_enabled', user, { channel_name: channel.friendly_name })
          m.message.quick_replies.map(qr => {
            if (qr.payload === '<TEMP_PAYLOAD_CHANGES>') qr.payload = `NOTIFICATIONS_CHANNELS_${from}`
          })
          await message.reply.raw(m)
        }
        break

      case /^UNSUBSCRIBE_CHANNEL_[0-9]*_FROM_[0-9]*$/.test(payload) && payload:
        {
          const id = parseInt(payload.replace('UNSUBSCRIBE_CHANNEL_', '').replace(/_FROM_[0-9]*/gi, ''))
          const from = parseInt(payload.replace(/UNSUBSCRIBE_CHANNEL_[0-9]*_FROM_/gi, ''))
          const channel = await knex('channels').where('id', id).first()
          await user.removeFromChannel(channel.name)
          let m = await messages.get('subscription_disabled', user, { channel_name: channel.friendly_name })
          m.message.quick_replies.map(qr => {
            if (qr.payload === '<TEMP_PAYLOAD_CHANGES>') qr.payload = `NOTIFICATIONS_CHANNELS_${from}`
          })
          await message.reply.raw(m)
        }
        break

      default:
        break
    }
  } catch (e) {
    throw e
  }
}
