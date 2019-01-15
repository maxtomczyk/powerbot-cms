exports.up = function (knex, Promise) {
  return knex('settings').where('name', 'force_update_statics').del()
}

exports.down = function (knex, Promise) {
  return knex('settings').insert({
    id: 1,
    name: 'force_update_statics',
    value: 'false'
  })
}
