exports.up = function (knex, Promise) {
  return knex.schema.createTable('payloads_entries', function (t) {
    t.increments()
    t.string('friendly_name')
    t.string('payload', 1000).notNullable().unique()
    t.integer('entries').notNullable().defaultTo(0)
    t.unique('id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('payloads_entries')
}
