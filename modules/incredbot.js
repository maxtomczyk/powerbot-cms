const Incredbot = require('incredbot')
const config = require('../config/config.js')

const incredbot = new Incredbot({
    access_token: config.facebook.access_token
})

module.exports = incredbot
