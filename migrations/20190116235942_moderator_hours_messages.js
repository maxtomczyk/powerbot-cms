exports.up = function (knex, Promise) {
  return knex('messages').insert([{
      name: 'contact_no_moderator_time',
      friendly_name: 'Contact - No moderator time',
      description: '',
      json: {
        en_US: {
          texts: ['Currently, there is no available moderator. Your request will be processed on the next business day.']
        }
      },
      group_id: 1,
      type: 'text'
    }
  ])
}

exports.down = function (knex, Promise) {
  return knex('messages').where('name', 'contact_no_moderator_time').del()
}
