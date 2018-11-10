const knex = require('../knex.js')

async function get (id) {
  let aId = null
  if (typeof (id) === 'string') {
    let row = await knex('attachments').where('name', id).first()
    aId = row.attachment_id
  } else {
    let row = await knex('attachments').where('id', id).first()
    aId = row.attachment.id
  }

  return aId
}

module.exports = {
  get
}
