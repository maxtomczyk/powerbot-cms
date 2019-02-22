exports.up = function (knex, Promise) {
  return knex.schema.createTable('users_removed', function (t) {
    t.increments()
    t.string('messenger_id', 64).notNullable()
    t.unique('id')
    t.unique('messenger_id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users_removed')
}
