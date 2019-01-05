const knex = require('../knex.js')
const logger = require('../logger.js')
const incredbot = require('../incredbot.js');

async function list(req, res, returnAsData) {
  try {
    let attachments = await knex('attachments').orderBy('id', 'asc')
    attachments.map(attachment => {
      let ext = /.\w*$/gmi.exec(attachment.url)[0]
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') attachment.show_preview = true
    })
    if (returnAsData) return attachments
    res.json(attachments)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function sync(req, res) {
  try {
    const id = req.body.id
    const attachment = await knex('attachments').where('id', id).first()
    let ext = /.\w*$/gmi.exec(attachment.url)[0]
    const isImage = (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif')
    let attachment_id = null

    if (isImage) attachment_id = await incredbot.upload.fromUrl('image', attachment.url)
    else attachment_id = await incredbot.upload.fromUrl('video', attachment.url)

    let [updated] = await knex('attachments').update({
      attachment_id: attachment_id,
      force_update: false
    }).where('id', attachment.id).returning('*')

    updated.show_preview = isImage

    res.json(updated)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function syncAll(req, res) {
  try {
    const attachments = await knex('attachments').orderBy('id', 'asc')

    let errors = 0
    for (let attachment of attachments) {
      try {
        if(!attachment.force_update) continue
        let attachment_id = null
        let ext = /.\w*$/gmi.exec(attachment.url)[0]
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') attachment_id = await incredbot.upload.fromUrl('image', attachment.url)
        else attachment_id = await incredbot.upload.fromUrl('video', attachment.url)
        await knex('attachments').update({
          attachment_id: attachment_id,
          force_update: false
        }).where('id', attachment.id)
      } catch (e) {
        logger.error(`${attachment.name} : ${e.response.data.error.message}`)
        errors++
      }
    }

    const updated = await list(req, res, true)
    const o = {
      attachments: updated,
      errors
    }

    res.json(o)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function edit(req, res) {
  try {
    const actual = await knex('attachments').where('id', req.body.id).first()

    const o = {
      friendly_name: req.body.friendly_name,
      description: req.body.description,
      url: req.body.url,
      force_update: (req.body.url !== actual.url)
    }

    let [updated] = await knex('attachments').update(o).where('id', req.body.id).returning('*')
    let ext = /.\w*$/gmi.exec(updated.url)[0]
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') updated.show_preview = true
    res.json(updated)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  list,
  syncAll,
  edit,
  sync
}
