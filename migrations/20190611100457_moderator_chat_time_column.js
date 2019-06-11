exports.up = function (knex, Promise) {
  return knex.schema.alterTable('users', function (t) {
    t.timestamp('moderator_chat_time', { useTz: false })
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('users', function (t) {
    t.dropColumn('moderator_chat_time')
  })
}
