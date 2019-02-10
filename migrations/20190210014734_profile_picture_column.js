exports.up = function (knex, Promise) {
  return knex.schema.alterTable('users', function (t) {
    t.text('profile_pic')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('users', function (t) {
    t.dropColumn('profile_pic')
  })
}
