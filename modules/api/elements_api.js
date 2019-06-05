const knex = require('../knex.js')
const apiLogger = require('../api_logger.js')
const incredbot = require('../incredbot.js')

async function list (req, res) {
  try {
    let elements = await knex('static_elements')
    res.json(elements)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function save (req, res) {
  try {
    const menu = req.body.menu.json
    const getStartedPayload = req.body.getStartedPayload.value
    const greeting = req.body.greeting.value

    if (!menu || !getStartedPayload || !greeting) return res.sendStatus(400)

    const statics = await knex('static_elements')
    let dbOperations = []

    for (const element of statics) {
      if (element.name === 'menu') {
        if (JSON.stringify(element.json, null, 4) !== menu) {
          dbOperations.push(knex('static_elements').update({
            json: JSON.parse(menu),
            force_update: true
          }).where('id', element.id))
        }
      } else if (element.name === 'get_started_payload') {
        if (element.value !== getStartedPayload) {
          dbOperations.push(knex('static_elements').update({
            value: getStartedPayload,
            force_update: true
          }).where('id', element.id))
        }
      } else if (element.name === 'hello') {
        if (element.value !== greeting) {
          dbOperations.push(knex('static_elements').update({
            value: greeting,
            force_update: true
          }).where('id', element.id))
        }
      }
    }

    await Promise.all(dbOperations)
    const updated = await knex('static_elements')
    apiLogger.info(`Saved changes to static elements.`, req)
    res.json(updated)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function sync (req, res) {
  try {
    const elementsData = await knex('static_elements').where('force_update', true)
    let elements = {}

    elementsData.map(element => {
      elements[element.name] = element
    })

    let getStarted = null
    let greeting = null

    if (elements.get_started_payload) getStarted = new incredbot.Helpers.GetStartedButton(elements.get_started_payload.value)
    if (elements.hello) greeting = new incredbot.Helpers.Greeting(elements.hello.value)

    if (getStarted) await incredbot.send.setting(getStarted)
    if (greeting) await incredbot.send.setting(greeting)
    if (elements.menu) await incredbot.send.setting(elements.menu.json)

    await knex('static_elements').update('force_update', false)
    apiLogger.info(`Synced static elements with server.`, req)

    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  list,
  save,
  sync
}
