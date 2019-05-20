const cms = require('powerbot-cms')

module.exports = async function (message, user) {
  try {
    const payload = message.payload
    switch (payload) {
      case 'GET_STARTED':

        break

      case /^CASE_WITH_REGEX_USAGE$/.test(payload) && payload:

        break

      default:
        await cms.utils.handlePostback(message, user)
        break
    }
  } catch (e) {
    throw e
  }
}
