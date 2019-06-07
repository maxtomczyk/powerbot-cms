exports.up = function (knex, Promise) {
  return knex.schema.alterTable('channels', function (t) {
    t.boolean('hidden').defaultTo('false').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('channels', function (t) {
    t.dropColumn('hidden')
  })
}
