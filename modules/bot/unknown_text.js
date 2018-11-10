const preMessages = require('./premade_messages')
const knex = require('../knex')
const config = require('../../config/config')
const messages = require('../messages')

async function registerPhrase (message) {
  try {
    if (!config.features.registerUnknownPhrases) return
    await knex('unknown_phrases').insert({
      phrase: message.text
    })
  } catch (e) {
    throw e
  }
}

module.exports = async function (message, user) {
  try {
    const patterns = await preMessages.loadRegexMessages()
    let success = false

    for (const pattern of patterns) {
      const regex = new RegExp(pattern.regex_body, pattern.regex_flags)
      if (regex.test(message.text)) {
        success = true
        await message.reply.raw(await messages.get(pattern.message_id, user))
        break
      }
    }

    if (success) return

    await registerPhrase(message)
    await message.reply.raw(await messages.get('default', user))
  } catch (e) {
    throw e
  }
}
