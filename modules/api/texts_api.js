const lodash = require('lodash');

const knex = require('../knex.js')
const logger = require('../logger.js')

async function plugs(req, res) {
    try {
        let plugs = await knex('texts_plugs')
        res.json(plugs)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function texts(req, res) {
    try {
        let texts = await knex('texts').orderBy('id', 'asc')
        texts.map(text => {
            text.toDelete = false
        })
        res.json(texts)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function updateTexts(req, res) {
    try {
        let toDelete = [],
            toUpdate = [],
            toCreate = [],
            created = []

        req.body.texts.map(text => {
            if (text.toDelete) toDelete.push(text.id)
            else if (!text.id) {
                delete text.toDelete
                toCreate.push(text)
            } else toUpdate.push(text)
        })

        let texts = await knex('texts').where('plug_id', req.body.texts[0].plug_id)
        if (toDelete.length === texts.length) return res.status(400).send('Can\'t remove all messages variants from plug!').end()

        if (toDelete.length > 0) await knex('texts').whereIn('id', toDelete).del()
        if (toUpdate.length > 0) {
            await Promise.all(toUpdate.map(async text => {
                if (text.text.length > 0) await knex('texts').update('text', text.text).where('id', text.id)
            }))
        }
        if (toCreate.length > 0) {
            await Promise.all(toCreate.map(async text => {
                if (text.text.length > 0) await knex('texts').insert(text)
            }))
        }

        let afterChanges = await knex('texts').where('plug_id', req.body.texts[0].plug_id).orderBy('id', 'asc')
        afterChanges = afterChanges.map(ac => {
            ac.toDelete = false
            return ac
        })

        res.json({
            texts: afterChanges
        })
    } catch (e) {
        logger.error(e)
        res.status(500).send('Error occured during data save. Please try again or contact an administrator.')
    }
}

async function groups(req, res) {
    try {
        let groups = await knex('plugs_groups').orderBy('id', 'asc')
        res.json(groups)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function languages(req, res) {
    try {
        let languages = await knex('languages').orderBy('id', 'asc')
        res.json(languages)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function buttons(req, res) {
    try {
        let buttons = await knex('buttons').orderBy('id', 'asc')
        res.json(buttons)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function buttonsPlugs(req, res) {
    try {
        let plugs = await knex('buttons_plugs').orderBy('id', 'asc')
        res.json(plugs)
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}

async function updateButtons(req, res) {
    try {
        let toDelete = [],
            toUpdate = [],
            toCreate = [],
            created = []

        let plugsList = []
        let afterChanges = {}

        let buttons = []

        req.body.buttons_plugs.map(plug => {
            plugsList.push(plug.id)
            plug.buttons.map(btn => {
                buttons.push(btn)
            })
        })

        plugsList.map(p => {
            afterChanges[p] = []
        })

        buttons.map(btn => {
            if (btn.toDelete) toDelete.push(btn.id)
            else if (!btn.id) {
                delete btn.toDelete
                toCreate.push(btn)
            } else toUpdate.push(btn)
        })

        // let dbButtons = await knex('buttons').where('plug_id', req.body.texts[0].plug_id)
        // if (toDelete.length === texts.length) return res.status(400).send('Can\'t remove all messages variants from plug!').end()

        if (toDelete.length > 0) await knex('buttons').whereIn('id', toDelete).del()
        if (toUpdate.length > 0) {
            await Promise.all(toUpdate.map(async btn => {
                if (btn.text.length > 0) await knex('buttons').update('text', btn.text).where('id', btn.id)
            }))
        }
        if (toCreate.length > 0) {
            await Promise.all(toCreate.map(async btn => {
                if (btn.text.length > 0) await knex('buttons').insert(btn)
            }))
        }

        let changedButtons = await knex('buttons').whereIn('plug_id', plugsList).orderBy('id', 'asc')

        changedButtons.map(b => {
            b.toDelete = false
            afterChanges[b.plug_id].push(b)
        })

        res.json({
            buttons: afterChanges
        })
    } catch (e) {
        logger.error(e)
        res.sendStatus(500)
    }
}


module.exports = {
    plugs,
    texts,
    updateTexts,
    groups,
    languages,
    buttons,
    buttonsPlugs,
    updateButtons
}
