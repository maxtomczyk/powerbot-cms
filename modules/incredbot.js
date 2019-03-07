const Incredbot = require('incredbot')
const config = require('../config/config')

const incredbot = new Incredbot({
  access_token: config.facebook.access_token,
  log_to_console: false
})

module.exports = incredbot
