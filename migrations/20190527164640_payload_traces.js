exports.up = function (knex, Promise) {
  return knex.schema.createTable('payloads_traces', function (t) {
    t.increments()
    t.specificType('payloads', 'TEXT[]').notNullable()
    t.timestamp('created_at', { useTz: false }).defaultTo(knex.fn.now()).notNullable()
    t.integer('user_id').notNullable()
    t.unique('id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('payloads_traces')
}
