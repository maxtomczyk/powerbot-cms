const lodash = require('lodash')
const knex = require('../knex.js')
const redis = require('../redis.js')
const logger = require('../logger.js')
const config = require('../../config/config.js')

class BotText {
    constructor() {
        this.defaultLocale = null
        this.locales = {}
    }

    choose(texts) {
        if (texts.length === 1) {
            return texts[0].text
        } else if (texts.length > 1) {
            let i = Math.floor(Math.random() * (texts.length - 1 + 1) + 1) - 1
            return texts[i].text
        } else {
            return null
        }
    }

    async setDefaults(locale) {
        try {
            if (lodash.isEmpty(this.locales)) {
                logger.debug('Loading locales list to server memory')

                let dbLocales = await knex('languages')
                dbLocales.map(loc => {
                    this.locales[loc.locale] = loc.id
                })
            }

            if (!this.defaultLocale) {
                logger.debug('Loading default locale to memory')
                let [def] = await knex('languages').where('default', true)
                this.defaultLocale = def.locale
            }
        } catch (e) {
            logger.error(e)
        }
    }

    async get(id, locale) {
        let texts = []
        try {
            await this.setDefaults(locale)
            texts = await redis.getAsync(`bot-texts:${id}-${locale}`)
            if (texts) {
                logger.silly(`Loaded text '${id}' from cache.`)
                return this.choose(JSON.parse(texts))
            }

            let loc = this.locales[locale] || this.locales[this.defaultLocale]

            logger.silly(`Didn't found text with name '${id}' in cache. Getting from database.`)
            texts = await knex('texts_plugs as tp').join('texts as t', 'tp.id', 't.plug_id').where('tp.name', id).andWhere('t.language_id', loc)
            redis.set(`bot-texts:${id}-${locale}`, JSON.stringify(texts), 'EX', config.redis.timeouts.botTexts)

            return this.choose(texts)
        } catch (e) {
            logger.error(e)
        }
    }

    async getButton(id, locale) {
        let buttons = []
        try {
            await this.setDefaults(locale)
            buttons = await redis.getAsync(`bot-buttons:${id}-${locale}`)
            if (buttons) {
                logger.silly(`Loaded button '${id}' in ${locale} from cache.`)
                return this.choose(JSON.parse(buttons))
            }

            let loc = this.locales[locale] || this.locales[this.defaultLocale]

            logger.silly(`Didn't found button with name '${id}' in locale ${locale} in cache. Getting from database.`)
            buttons = await knex('buttons_plugs as bp').join('buttons as b', 'bp.id', 'b.plug_id').where('bp.name', id).andWhere('b.language_id', loc)
            redis.set(`bot-buttons:${id}-${locale}`, JSON.stringify(buttons), 'EX', config.redis.timeouts.botTexts)

            return this.choose(buttons)
        } catch (e) {
            logger.error(e)
        }
    }
}

module.exports = BotText;
