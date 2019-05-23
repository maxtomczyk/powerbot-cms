exports.up = function (knex, Promise) {
  return knex.schema.createTable('url_entries', function (t) {
    t.increments()
    t.string('friendly_name')
    t.text('url').notNullable().unique()
    t.integer('entries').notNullable().defaultTo(0)
    t.unique('id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('url_entries')
}
