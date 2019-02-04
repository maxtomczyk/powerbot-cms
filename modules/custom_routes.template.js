const router = require('express').Router()

const auth = require('../node_modules/powerbot-cms/modules/auth.js')()
const logger = require('../node_modules/powerbot-cms/modules/logger.js')
const api = require('./api')

router.get('/test', auth.authenticate(), async (req, res) => {
  logger.debug('Received request on "/custom/test!"')
  api.test(req, res)
})

module.exports = router
