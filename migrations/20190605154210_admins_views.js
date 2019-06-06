exports.up = function (knex, Promise) {
  return knex.schema.alterTable('admins', function (t) {
    t.specificType('allowed_views', 'TEXT[]').defaultTo('{}').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('admins', function (t) {
    t.dropColumn('allowed_views')
  })
}
