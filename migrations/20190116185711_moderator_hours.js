exports.up = function (knex, Promise) {
  return knex('bot_data').insert({
    name: 'moderator_hours',
    editable: true,
    data: {
      0: {from: '9:00', to: '15:00'},
      1: {from: '9:00', to: '15:00'},
      2: {from: '9:00', to: '15:00'},
      3: {from: '9:00', to: '15:00'},
      4: {from: '9:00', to: '15:00'},
      5: {from: null, to: null},
      6: {from: null, to: null}
    }
  })
}

exports.down = function (knex, Promise) {
  return knex('bot_data').where('name', 'moderator_hours').del()
}
