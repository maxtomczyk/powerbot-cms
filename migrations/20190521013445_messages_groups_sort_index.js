exports.up = function (knex, Promise) {
  return knex.schema.alterTable('messages_groups', function (t) {
    t.integer('sort_index')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('messages_groups', function (t) {
    t.dropColumn('sort_index')
  })
}
