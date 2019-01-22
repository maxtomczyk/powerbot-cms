exports.up = function (knex, Promise) {
  return knex('messages').insert([{
      name: 'chat_in_progress',
      friendly_name: 'Chat request in progress',
      description: '',
      json: {
        en_US: {
          texts: ['Your chat request is in queue. You can use all features until moderator chat start.']
        }
      },
      group_id: 1,
      type: 'text'
    }
  ])
}

exports.down = function (knex, Promise) {
  return knex('messages').where('name', 'chat_in_progress').del()
}
