exports.up = function (knex, Promise) {
  return knex.schema.createTable('stats_daily_resolution', function (t) {
    t.increments()
    t.integer('unique_users').notNullable()
    t.integer('all_users').notNullable()
    t.timestamp('start', { useTz: false }).notNullable()
    t.timestamp('end', { useTz: false }).defaultTo(knex.fn.now()).notNullable()
    t.unique('id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('stats_daily_resolution')
}
