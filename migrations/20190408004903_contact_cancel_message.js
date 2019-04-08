exports.up = function (knex, Promise) {
  let m = {
    name: 'contact_ended_by_user',
    friendly_name: 'Contact - Ended by user',
    description: '',
    json: {},
    group_id: 1,
    type: 'text'
  }

  return new Promise(function (resolve, reject) {
    knex('languages').then(languages => {
      for (const lang of languages) {
        m.json[lang.locale] = {
          texts: [`contact_ended_by_user default text in ${lang.name} (${lang.locale}) language.`]
        }
      }
      knex('messages').insert(m).then(() => { resolve() }).catch(e => { reject(e) })
    }).catch(e => { reject(e) })
  })
}

exports.down = function (knex, Promise) {
  return knex('messages').where('name', 'contact_ended_by_user').del()
}
