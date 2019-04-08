exports.up = function (knex, Promise) {
  return knex('messages').where('name', 'contact_message_saved').del()
}

exports.down = function (knex, Promise) {
  let m = {
    name: 'contact_message_saved',
    friendly_name: 'Contact description saved',
    description: '',
    json: {},
    group_id: 1,
    type: 'text'
  }

  return new Promise(function (resolve, reject) {
    knex('languages').then(languages => {
      for (const lang of languages) {
        m.json[lang.locale] = {
          texts: [`contact_message_saved default text in ${lang.name} (${lang.locale}) language.`]
        }
      }
      knex('messages').insert(m).then(() => { resolve() }).catch(e => { reject(e) })
    }).catch(e => { reject(e) })
  })
}
