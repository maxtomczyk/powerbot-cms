const jwt = require('jsonwebtoken')
const router = require('express').Router()

const auth = require('../node_modules/incredbot-cms/modules/auth.js')()
const config = require('../config/config.js')
const Admin = require('../node_modules/incredbot-cms/modules/models/Admin.js')
const api = require('../node_modules/incredbot-cms/modules/api')
const logger = require('../node_modules/incredbot-cms/modules/logger.js')

router.post('/api/auth', async (req, res) => {
    try {
        if (req.body.login && req.body.password) {
            let user = new Admin(req.body.login)
            if (await user.authenticate(req.body.password)) {
                let payload = {
                    id: user.id
                }
                let token = jwt.sign(payload, config.jwt.secret)
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

router.get('/api/admins', auth.authenticate(), async (req, res) => {
    api.admins.list(req, res)
})

router.get('/api/plugs', auth.authenticate(), async (req, res) => {
    api.texts.plugs(req, res)
})

router.get('/api/texts', auth.authenticate(), async (req, res) => {
    api.texts.texts(req, res)
})

router.get('/api/plugs_groups', auth.authenticate(), async (req, res) => {
    api.texts.groups(req, res)
})

router.get('/api/languages', auth.authenticate(), async (req, res) => {
    api.texts.languages(req, res)
})

router.get('/api/chat_requests', auth.authenticate(), async (req, res) => {
    api.chats.list(req, res)
})

router.get('/api/buttons', auth.authenticate(), async (req, res) => {
    api.texts.buttons(req, res)
})

router.get('/api/buttons_plugs', auth.authenticate(), async (req, res) => {
    api.texts.buttonsPlugs(req, res)
})

router.get('/api/messages', auth.authenticate(), async (req, res) => {
    api.messages.list(req, res)
})

router.get('/api/postbacks', auth.authenticate(), async (req, res) => {
    api.postbacks.list(req, res)
})

router.get('/api/words', auth.authenticate(), async (req, res) => {
    api.messages.listUnknownWords(req, res)
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

router.put('/api/admins', auth.authenticate(), async (req, res) => {
    api.admins.create(req, res)
})

router.put('/api/messages', auth.authenticate(), async (req, res) => {
    api.messages.create(req, res)
})

router.put('/api/broadcast', auth.authenticate(), async (req, res) => {
    api.broadcast.create(req, res)
})

router.put('/api/keyword', auth.authenticate(), async (req, res) => {
    api.keywords.create(req, res)
})

router.post('/api/admins', auth.authenticate(), async (req, res) => {
    api.admins.changePassword(req, res)
})

router.post('/api/broadcast', auth.authenticate(), async (req, res) => {
    api.broadcast.push(req, res)
})

router.post('/api/texts', auth.authenticate(), async (req, res) => {
    api.texts.updateTexts(req, res)
})

router.post('/api/chat_request', auth.authenticate(), async (req, res) => {
    api.chats.unlock(req, res)
})

router.post('/api/buttons', auth.authenticate(), async (req, res) => {
    api.texts.updateButtons(req, res)
})

router.post('/api/broadcast-cancel', auth.authenticate(), async (req, res) => {
    api.broadcast.cancel(req, res)
})

router.post('/api/chat_request_lock', auth.authenticate(), async (req, res) => {
    api.chats.lock(req, res)
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