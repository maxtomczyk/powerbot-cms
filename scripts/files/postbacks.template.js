const cms = require('powerbot-cms')

module.exports = async function (message, user) {
  switch (message.payload) {
    case 'GET_STARTED':

      break
    default:
      await cms.utils.handlePostback(message, user)
      break
  }
}
