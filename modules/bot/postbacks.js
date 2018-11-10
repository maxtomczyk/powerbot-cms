const User = require('./models/User.js')

const messages = require('../messages')

module.exports = async function (message, user) {
  const payload = message.payload

  switch (payload) {
    case 'CONTACT':
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
