const admins = require('./admins_api')
const texts = require('./texts_api')
const chats = require('./chats_api')
const messages = require('./messages_api')
const postbacks = require('./postbacks_api')
const broadcast = require('./broadcast_api')
const keywords = require('./keywords_api')

module.exports = {
  admins,
  texts,
  chats,
  messages,
  postbacks,
  broadcast,
  keywords
}
