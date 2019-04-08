const jwt = require('jsonwebtoken')
const router = require('express').Router()

const auth = require('./auth.js')()
const config = require('../config/config.js')
const Admin = require('./models/Admin.js')
const api = require('./api')
const logger = require('./logger.js')

router.post('/api/auth', async (req, res) => {
  try {
    if (req.body.login && req.body.password) {
      let user = new Admin(req.body.login)
      if (await user.authenticate(req.body.password)) {
        let payload = {
          id: user.id
        }
        let token = jwt.sign(payload, config.jwt.secret, {expiresIn: '2h'})
        res.json({
          token: token,
          user: JSON.stringify(user)
        })
      } else res.status(401).end()
    } else res.status(401).end()
  } catch (e) {
    logger.error(e)
    res.status(500).end()
  }
})

router.get('/api/token_refresh', auth.authenticate(), async (req, res) => {
  let payload = {
    id: req.user.id
  }
  let token = jwt.sign(payload, config.jwt.secret, {expiresIn: '2h'})
  res.json({
    token: token
  })
})

router.get('/api/admins', auth.authenticate(), async (req, res) => {
  api.admins.list(req, res)
})

router.get('/api/languages', auth.authenticate(), async (req, res) => {
  api.languages.list(req, res)
})

router.get('/api/chat_requests', auth.authenticate(), async (req, res) => {
  api.chats.list(req, res)
})

router.get('/api/messages', auth.authenticate(), async (req, res) => {
  api.messages.listPlugs(req, res)
})

router.get('/api/messages/plugs', auth.authenticate(), async (req, res) => {
  api.messages.listPlugs(req, res)
})

router.get('/api/postbacks', auth.authenticate(), async (req, res) => {
  api.postbacks.list(req, res)
})

router.get('/api/phrases', auth.authenticate(), async (req, res) => {
  api.messages.listUnknownPhrases(req, res)
})

router.get('/api/labels', auth.authenticate(), async (req, res) => {
  api.broadcast.listLabels(req, res)
})

router.get('/api/broadcasts', auth.authenticate(), async (req, res) => {
  api.broadcast.listBroadcasts(req, res)
})

router.get('/api/broadcast-status', auth.authenticate(), async (req, res) => {
  api.broadcast.updateStatus(req, res)
})

router.get('/api/keywords', auth.authenticate(), async (req, res) => {
  api.keywords.list(req, res)
})

router.get('/api/messages/groups', auth.authenticate(), async (req, res) => {
  api.messages.listGroups(req, res)
})

router.get('/api/attachments', auth.authenticate(), async (req, res) => {
  api.attachments.list(req, res)
})

router.get('/api/stats/system', auth.authenticate(), async (req, res) => {
  api.stats.systemStatus(req, res)
})

router.get('/api/stats/messages_chart', auth.authenticate(), async (req, res) => {
  api.stats.messagesChartData(req, res)
})

router.get('/api/stats/messages', auth.authenticate(), async (req, res) => {
  api.stats.messagesData(req, res)
})

router.get('/api/stats/users', auth.authenticate(), async (req, res) => {
  api.stats.usersData(req, res)
})

router.get('/api/stats/bot', auth.authenticate(), async (req, res) => {
  api.stats.botData(req, res)
})

router.get('/api/stats/users_daily_chart', auth.authenticate(), async (req, res) => {
  api.stats.usersDailyChartData(req, res)
})

router.get('/api/stats/users_weekly_chart', auth.authenticate(), async (req, res) => {
  api.stats.usersWeeklyChartData(req, res)
})

router.get('/api/stats/users_monthly_chart', auth.authenticate(), async (req, res) => {
  api.stats.usersMonthlyChartData(req, res)
})

router.get('/api/elements/list', auth.authenticate(), async (req, res) => {
  api.elements.list(req, res)
})

router.get('/api/version', auth.authenticate(), async (req, res) => {
  api.stats.version(req, res)
})

router.put('/api/admins', auth.authenticate(), async (req, res) => {
  api.admins.create(req, res)
})

router.put('/api/messages', auth.authenticate(), async (req, res) => {
  api.messages.update(req, res)
})

router.put('/api/broadcast', auth.authenticate(), async (req, res) => {
  api.broadcast.create(req, res)
})

router.put('/api/keyword', auth.authenticate(), async (req, res) => {
  api.keywords.create(req, res)
})

router.put('/api/messages/plug', auth.authenticate(), async (req, res) => {
  api.messages.createPlug(req, res)
})

router.put('/api/postbacks', auth.authenticate(), async (req, res) => {
  api.postbacks.create(req, res)
})

router.post('/api/attachment', auth.authenticate(), async (req, res) => {
  api.attachments.edit(req, res)
})

router.post('/api/sync_attachment', auth.authenticate(), async (req, res) => {
  api.attachments.sync(req, res)
})

router.post('/api/admins', auth.authenticate(), async (req, res) => {
  api.admins.changePassword(req, res)
})

router.post('/api/broadcast', auth.authenticate(), async (req, res) => {
  api.broadcast.push(req, res)
})

router.post('/api/chat_request', auth.authenticate(), async (req, res) => {
  api.chats.unlock(req, res)
})

router.post('/api/sync_attachments', auth.authenticate(), async (req, res) => {
  api.attachments.syncAll(req, res)
})

router.post('/api/broadcast-cancel', auth.authenticate(), async (req, res) => {
  api.broadcast.cancel(req, res)
})

router.post('/api/chat_request_lock', auth.authenticate(), async (req, res) => {
  api.chats.lock(req, res)
})

router.post('/api/elements/save', auth.authenticate(), async (req, res) => {
  api.elements.save(req, res)
})

router.post('/api/elements/sync', auth.authenticate(), async (req, res) => {
  api.elements.sync(req, res)
})

router.post('/api/admins/notifications', auth.authenticate(), async (req, res) => {
  api.admins.notificationsSettings(req, res)
})

router.delete('/api/admins', auth.authenticate(), async (req, res) => {
  api.admins.deleteAdmin(req, res)
})

router.delete('/api/messages', auth.authenticate(), async (req, res) => {
  api.messages.remove(req, res)
})

router.delete('/api/postbacks', auth.authenticate(), async (req, res) => {
  api.postbacks.remove(req, res)
})

router.delete('/api/remove-broadcast', auth.authenticate(), async (req, res) => {
  api.broadcast.remove(req, res)
})

router.delete('/api/keyword', auth.authenticate(), async (req, res) => {
  api.keywords.remove(req, res)
})

module.exports = router
