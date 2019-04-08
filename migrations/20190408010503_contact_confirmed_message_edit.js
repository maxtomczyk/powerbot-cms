exports.up = function (knex, Promise) {
  return new Promise(function (resolve, reject) {
    knex('messages').where('name', 'contact_confirmed').first().then(message => {
      for (const locale in message.json) {
        message.json[locale].buttons = []
        message.json[locale].buttons.push({
          type: 'postback',
          payload: 'CONTACT_UNLOCK_BOT',
          title: `unlock bot <${locale}>`
        })
        message.json[locale].buttons.push({
          type: 'postback',
          payload: 'CONTACT_END',
          title: `end contact <${locale}>`
        })
      }
      knex('messages').update({ json: message.json, type: 'buttons' }).where('name', 'contact_confirmed').then(() => { resolve() }).catch(e => { reject(e) })
    }).catch(e => { reject(e) })
  })
}

exports.down = function (knex, Promise) {
  return new Promise(function (resolve, reject) {
    knex('messages').where('name', 'contact_confirmed').first().then(message => {
      for (const locale in message.json) {
        delete message.json[locale].buttons
      }
      knex('messages').update({ json: message.json, type: 'text' }).where('name', 'contact_confirmed').then(() => { resolve() }).catch(e => { reject(e) })
    }).catch(e => { reject(e) })
  })
}
