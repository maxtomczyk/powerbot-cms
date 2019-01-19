exports.up = function (knex, Promise) {
  return knex.schema.alterTable('admins', function (t) {
    t.boolean('chat_requests_notifications').defaultTo(true).notNullable()
    t.boolean('weekly_email_reports').defaultTo(true).notNullable()
    t.boolean('monthly_email_reports').defaultTo(true).notNullable()
    t.string('email').defaultTo(null)
    t.unique('email')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('admins', function (t) {
    t.dropColumn('chat_requests_notifications')
    t.dropColumn('weekly_email_reports')
    t.dropColumn('monthly_email_reports')
    t.dropUnique('email')
    t.dropColumn('email')
  })
}
