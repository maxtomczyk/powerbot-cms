const cms = require('powerbot-cms')

const postbacks = require('./postbacks')
const bot = cms.bot

bot.on('text', async (message, user, raw) => {
  try {
    await cms.utils.handleText(message, user)
  } catch (e) {
    console.error(e)
  }
})

bot.on('payload', async (message, user, raw) => {
  try {
    await postbacks(message, user)
  } catch (e) {
    console.error(e)
  }
})

cms.server.listen(process.env.PORT || 3000, () => {

})
