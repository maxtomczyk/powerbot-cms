module.exports = async function (cms, postbacks, result, message, user, rawResult) {
  try {
    const ps = new cms.PostbackSimulator(postbacks)
    return false
    // return false to execute default message sending
  } catch (e) {
    cms.logger.error(e)
  }
}