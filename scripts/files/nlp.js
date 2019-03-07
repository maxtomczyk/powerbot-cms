const cms = require('powerbot-cms')

module.exports = async function (nlpData, message, user, raw) {
  try {
    // return false to execute default message sending
    console.log(nlpData)
  } catch (e) {
    cms.logger.error(e)
  }
}
