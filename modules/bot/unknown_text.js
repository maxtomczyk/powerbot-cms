const preMessages = require('./premade_messages')
const knex = require('../knex')
const config = require('../../config/config')

function wrapMessage(sender, message) {
    let m = {}
    m.recipient = {}
    m.recipient.id = sender
    m.message = message

    return m
}

async function registerWords(message) {
    try {
        if (!config.features.registerUnknownWords) return

        let words = message.text.split(' ')
        words = words.map(word => word.toLowerCase())

        const recordsToUpdate = await knex('unknown_words').whereIn('word', words)
        const wordsToUpdate = recordsToUpdate.map(record => record.word)
        const wordsToCreate = words.map((word) => {
            if (wordsToUpdate.indexOf(word) === -1) return word
        }).filter(word => {
            return word
        })

        const updateOperations = recordsToUpdate.map(record => {
            return knex('unknown_words').increment('occurrences', 1).where('id', record.id)
        })

        const insertObject = wordsToCreate.map(word => {
            return {
                word
            }
        })

        await knex('unknown_words').insert(insertObject)
        await Promise.all(updateOperations)
    } catch (e) {
        throw e
    }
}

module.exports = async function(message, raw) {
    try {
        const patterns = await preMessages.loadRegexMessages()
        let success = false

        for (const pattern of patterns) {
            const regex = new RegExp(pattern.regex_body, pattern.regex_flags)
            if (regex.test(message.text)) {
                success = true
                await message.reply.raw(wrapMessage(message.sender_id, pattern.json))
                break
            }
        }

        if (success) return

        const defaultMessage = await preMessages.loadDefaultMessage()

        await message.reply.raw(wrapMessage(message.sender_id, defaultMessage.json))
        await registerWords(message)
    } catch (e) {
        throw e
    }
}
