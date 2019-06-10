exports.up = async function (knex, Promise) {
  try {
    const plugs = await knex('messages').where('type', 'quick_replies')
    let updates = []
    for (let plug of plugs) {
      for (let lang in plug.json) {
        let message = plug.json[lang]
        message.settings = {}
        message.settings.quick_replies = true
        message.settings.aspect_ratio = 'horizontal'
      }
      let o = {
        json: plug.json,
        type: 'text'
      }
      updates.push(knex('messages').update(o).where('id', plug.id))
    }
    return Promise.all(updates)
  } catch (e) {
    throw e
  }
}

exports.down = async function (knex, Promise) {
  try {
    const plugs = await knex('messages').where('type', 'text')
    let updates = []
    for (let plug of plugs) {
      let o = {}
      for (let lang in plug.json) {
        let message = plug.json[lang]
        if (message.quick_replies && message.quick_replies.length && message.settings.quick_replies) {
          o.type = 'quick_replies'
        }
        delete message.settings
      }
      o.json = plug.json
      updates.push(knex('messages').update(o).where('id', plug.id))
    }
    return Promise.all(updates)
  } catch (e) {
    throw e
  }
}
