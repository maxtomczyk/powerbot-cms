exports.up = function (knex, Promise) {
  return knex.schema.createTable('stats_medium_resolution', function (t) {
    t.increments()
    t.integer('messages_incoming').notNullable()
    t.integer('messages_outgoing').notNullable()
    t.integer('new_users').notNullable()
    t.timestamp('start', { useTz: false }).notNullable()
    t.timestamp('end', { useTz: false }).defaultTo(knex.fn.now()).notNullable()
    t.unique('id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('stats_medium_resolution')
}
