const cms = require('powerbot-cms')

module.exports = async function (result, message, user, rawResult) {
  try {
    // return false to execute default message sending
  } catch (e) {
    cms.logger.error(e)
  }
}
