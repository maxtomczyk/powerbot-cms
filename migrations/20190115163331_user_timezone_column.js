exports.up = function (knex, Promise) {
  return knex.schema.alterTable('users', function (t) {
    t.integer('timezone')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('users', function (t) {
    t.dropColumn('timezone')
  })
}
