exports.up = function (knex, Promise) {
  return knex.schema.alterTable('static_elements', function (t) {
    t.boolean('force_update').defaultTo(false).notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('static_elements', function (t) {
    t.dropColumn('force_update')
  })
}
