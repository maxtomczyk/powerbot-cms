exports.up = function (knex, Promise) {
  return knex.schema.alterTable('bot_data', function (t) {
    t.unique('name')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('bot_data', function (t) {
    t.dropUnique('name')
  })
}
