const admins = require('./admins_api')
const languages = require('./languages_api')
const chats = require('./chats_api')
const messages = require('./messages_api')
const postbacks = require('./postbacks_api')
const broadcast = require('./broadcast_api')
const keywords = require('./keywords_api')
const attachments = require('./attachments_api')
const stats = require('./stats_api')
const elements = require('./elements_api')

module.exports = {
  admins,
  languages,
  chats,
  messages,
  postbacks,
  broadcast,
  keywords,
  attachments,
  stats,
  elements
}
