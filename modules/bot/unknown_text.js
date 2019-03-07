const dialogflow = require('dialogflow')
const uuid = require('uuid')
const logger = require('../logger')
const preMessages = require('./premade_messages')
const knex = require('../knex')
const redis = require('../redis')
const config = require('../../config/config')
const messages = require('../messages')
const userNLP = require('../../../../nlp.js')

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

function logDialogflowDebug (nlpData, message) {
  if (config.app.logLevel !== 'silly' && config.app.logLevel !== 'debug') return
  console.log()
  logger.debug(`<| DIALOGFLOW DEBUG DATA |>`)
  logger.debug(`query: ${message.text}`)
  logger.debug(`intent: ${nlpData.intent.displayName}`)
  logger.debug(`confidence: ${nlpData.intentDetectionConfidence}`)
  logger.debug(`completed: ${nlpData.allRequiredParamsPresent}`)
  logger.debug(`suggested response: ${nlpData.fulfillmentText}`)
  if (nlpData.parameters.fields && Object.keys(nlpData.parameters.fields).length) logger.debug(`parameters:`)
  for (const paramName in nlpData.parameters.fields) {
    if (nlpData.parameters.fields[paramName].kind === 'stringValue') logger.debug(`   ${paramName}: ${nlpData.parameters.fields[paramName].stringValue}`)
    else if (nlpData.parameters.fields[paramName].kind === 'numberValue') logger.debug(`   ${paramName}: ${nlpData.parameters.fields[paramName].numberValue}`)
    else logger.debug(`  ${paramName}: ${JSON.stringify(nlpData.parameters.fields[paramName]) || null}`)
  }
  console.log()
  console.log('------------------------------------------------------------')
}

function simplifyDialogflowResponse (nlpData) {
  let simple = {}
  simple.query = nlpData.queryText
  simple.intent = nlpData.intent.displayName
  simple.intentConfidence = nlpData.intentDetectionConfidence
  simple.completeParams = nlpData.allRequiredParamsPresent
  simple.isFallback = nlpData.intent.isFallback
  simple.reset = nlpData.intent.resetContexts
  simple.suggestedResponse = nlpData.fulfillmentText
  simple.parameters = {}
  for (const paramName in nlpData.parameters.fields) {
    if (nlpData.parameters.fields[paramName].kind === 'stringValue') simple.parameters[paramName] = nlpData.parameters.fields[paramName].stringValue
    else if (nlpData.parameters.fields[paramName].kind === 'numberValue') simple.parameters[paramName] = nlpData.parameters.fields[paramName].numberValue
    else {
      simple.parameters[paramName] = nlpData.parameters.fields[paramName]
      simple.parameters.raw = true
    }
  }
  return simple
}

async function useDialogflow (message, user) {
  try {
    if (!config.dialogflow.enable) return false

    let sessionId = await redis.getAsync(`dialogflow-session-user:${user.id}`)
    if (!sessionId) sessionId = uuid.v4()
    redis.set(`dialogflow-session-user:${user.id}`, sessionId, 'EX', config.dialogflow.sessionTimeout)

    const sessionClient = new dialogflow.SessionsClient()
    const sessionPath = sessionClient.sessionPath(config.dialogflow.projectId, sessionId)

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message.text,
          languageCode: config.dialogflow.language
        }
      }
    }

    const responses = await sessionClient.detectIntent(request)
    return responses
  } catch (e) {
    logger.error(e)
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

    const nlpData = await useDialogflow(message, user)
    logDialogflowDebug(nlpData[0].queryResult, message)
    const simplified = simplifyDialogflowResponse(nlpData[0].queryResult)
    const nlpHandled = await userNLP(simplified, message, user, nlpData)
    if (nlpHandled) return
    await registerPhrase(message)
    await message.reply.raw(await messages.get('default', user))
  } catch (e) {
    throw e
  }
}
