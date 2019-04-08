exports.up = function (knex, Promise) {
  let m = {
    name: 'contact_bot_unlocked',
    friendly_name: 'Contact - Bot unlocked',
    description: '',
    json: {},
    group_id: 1,
    type: 'text'
  }
  return new Promise(function (resolve, reject) {
    knex('languages').then(languages => {
      for (const lang of languages) {
        m.json[lang.locale] = {
          texts: [`contact_bot_unlocked default text in ${lang.name} (${lang.locale}) language.`]
        }
      }
      knex('messages').insert(m).then(s => { resolve() }).catch(e => { reject(e) })
    }).catch(e => { reject(e) })
  })
}

exports.down = function (knex, Promise) {
  return knex('messages').where('name', 'contact_bot_unlocked').del()
}
