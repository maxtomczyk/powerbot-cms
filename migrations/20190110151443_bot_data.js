exports.up = function (knex, Promise) {
  return knex.schema.createTable('bot_data', function (t) {
    t.increments()
    t.string('name').notNullable()
    t.json('data').notNullable()
    t.boolean('editable').notNullable().defaultTo('false')
    t.unique('id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('bot_data')
}
