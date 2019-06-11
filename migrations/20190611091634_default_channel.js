exports.up = function (knex, Promise) {
  return knex('channels').insert([{
    name: 'powerbot_default',
    default: true,
    friendly_name: 'Default',
    hidden: true
  }, {
    name: 'main',
    default: true,
    friendly_name: 'Main channel',
    hidden: false
  }])
}

exports.down = function (knex, Promise) {
  return knex('channels').where('name', 'powerbot_default').orWhere('name', 'main').del()
}
