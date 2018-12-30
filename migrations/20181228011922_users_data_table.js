exports.up = function (knex, Promise) {
  return knex.schema.createTable('users_data', function (t) {
    t.increments()
    t.string('name', 32).notNullable()
    t.json('data')
    t.integer('user_id').notNullable().references('users.id').onUpdate('cascade').onDelete('cascade')
    t.timestamp('last_update', { useTz: false }).defaultTo(knex.fn.now()).notNullable()
    t.unique('id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users_data')
}
