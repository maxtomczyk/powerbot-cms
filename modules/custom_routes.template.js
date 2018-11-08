const router = require('express').Router()

const auth = require('../node_modules/incredbot-cms/modules/auth.js')()
const logger = require('../node_modules/incredbot-cms/modules/logger.js')

router.get('/test', auth.authenticate(), async (req, res) => {
  logger.debug('Received request on "/custom/test!"')
  res.send('ok')
})

module.exports = router
