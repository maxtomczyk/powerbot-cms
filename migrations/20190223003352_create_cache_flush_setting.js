exports.up = function (knex, Promise) {
  return knex('settings').insert({
    id: 1,
    name: 'flush_cache',
    value: 'false'
  })
}

exports.down = function (knex, Promise) {
  return knex('settings').where('name', 'flush_cache').del()
}
