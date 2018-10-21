const Incredbot = require('incredbot')

const knex = require('../knex.js')
const config = require('../../config/config.js')
const logger = require('../logger.js')

const incredbot = require('../incredbot.js')

module.exports = async function set(bot) {
    try {
        let shouldUpdateStatics = await knex('settings').where('name', 'force_update_statics').andWhere('value', 'true').first()
        if (shouldUpdateStatics) {
            logger.info('Static elements force update started...')

            const elementsData = await knex('static_elements')
            let elements = {}

            elementsData.map(element => {
                elements[element.name] = element
            })


            let get_started = new incredbot.Helpers.GetStartedButton(elements.get_started_payload.value)
            let greeting = new incredbot.Helpers.Greeting(elements.hello.value)

            await incredbot.send.setting(get_started)
            await incredbot.send.setting(greeting)
            await incredbot.send.setting(elements.menu.json)

            await knex('settings').update('value', 'false').where('name', 'force_update_statics')
            logger.info('Updated Get Started button, Greeting message and Persistent Menu.')
        }

    } catch (e) {
        logger.error(e)
    }
}
