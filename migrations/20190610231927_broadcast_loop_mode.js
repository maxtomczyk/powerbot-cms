exports.up = function (knex, Promise) {
  return knex.schema.alterTable('broadcasts', function (t) {
    t.string('mode', 16).notNullable().defaultTo('broadcast_api')
    t.string('tag')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('broadcasts', function (t) {
    t.dropColumn('mode')
    t.dropColumn('tag')
  })
}
