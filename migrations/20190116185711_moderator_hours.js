exports.up = function (knex, Promise) {
  return knex('bot_data').insert({
    name: 'moderator_hours',
    editable: true,
    data: {
      0: {from: '10:00', to: '18:00'},
      1: {from: '10:00', to: '18:00'},
      2: {from: '10:00', to: '18:00'},
      3: {from: '10:00', to: '18:00'},
      4: {from: '10:00', to: '18:00'},
      5: {from: 'null', to: 'null'},
      6: {from: 'null', to: 'null'}
    }
  })
}

exports.down = function (knex, Promise) {
  return knex('bot_data').where('name', 'moderator_hours').del()
}
