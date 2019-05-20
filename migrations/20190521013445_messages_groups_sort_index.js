exports.up = function (knex, Promise) {
  return knex.schema.alterTable('messages_groups', function (t) {
    t.integer('sort_indexknex m')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('messages_groups', function (t) {
    t.dropColumn('sort_indexknex m')
  })
}
