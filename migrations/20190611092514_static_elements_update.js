exports.up = function (knex, Promise) {
  let updates = []
  updates.push(knex('static_elements').update({
    value: 'Welcome to chatbot powered by Powerbot CMS.',
    force_update: true
  }).where('name', 'hello'))
  updates.push(knex('static_elements').update({
    force_update: true,
    json: {
      persistent_menu: [
        {
          locale: 'default',
          call_to_actions: [
            {
              title: 'Contact 👤',
              type: 'postback',
              payload: 'CONTACT'
            },
            {
              title: 'Settings ⚙️',
              type: 'nested',
              call_to_actions: [
                {
                  title: 'Remove my data ❌',
                  type: 'postback',
                  payload: 'CLEAR_USER_DATA'
                },
                {
                  title: 'Subscriptions ✉️',
                  type: 'postback',
                  payload: 'NOTIFICATIONS_CHANNELS_0'
                }
              ]
            }
          ]
        }
      ]
    }
  }).where('name', 'menu'))

  return Promise.all(updates)
}

exports.down = function (knex, Promise) {
  return knex('users') // non revertable migration
}
