exports.up = function (knex, Promise) {
  let m1 = {
    name: 'subscriptions_menu',
    friendly_name: 'Subscriptions - Menu',
    description: '',
    json: {},
    group_id: 1,
    type: 'carousel'
  }
  let m2 = {
    name: 'subscription_enabled',
    friendly_name: 'Subscriptions - Channel enabled',
    description: '',
    json: {},
    group_id: 1,
    type: 'text'
  }
  let m3 = {
    name: 'subscription_disabled',
    friendly_name: 'Subscriptions - Channel disabled',
    description: '',
    json: {},
    group_id: 1,
    type: 'text'
  }

  return new Promise(function (resolve, reject) {
    knex('languages').then(languages => {
      for (const lang of languages) {
        m1.json[lang.locale] = {
          cards: [
            {
              title: '{friendly_name}',
              subtitle: 'Channel status: {statusEmoji}',
              buttons: [
                {
                  type: 'postback',
                  payload: '<TEMP_PAYLOAD_SUBSCRIBE>',
                  title: 'Subscribe 🔔'
                },
                {
                  type: 'postback',
                  payload: '<TEMP_PAYLOAD_UNSUBSCRIBE>',
                  title: 'Unsubscribe 🔕'
                }
              ]
            }
          ],
          settings: {
            aspect_ratio: 'horizontal',
            quick_replies: true
          },
          quick_replies: [
            {
              content_type: 'text',
              title: 'Previous ⬅️',
              payload: '<TEMP_PAYLOAD_PREV_PAGE>'
            },
            {
              content_type: 'text',
              title: 'Next ➡️',
              payload: '<TEMP_PAYLOAD_NEXT_PAGE>'
            },
            {
              content_type: 'text',
              title: 'Return 🔙',
              payload: 'MENU'
            }
          ]

        }
        m2.json[lang.locale] = {
          texts: [
            'Done! You will now receive notifications in channel {channel_name}.'
          ],
          quick_replies: [
            {
              content_type: 'text',
              title: 'More changes ⬆️',
              payload: '<TEMP_PAYLOAD_CHANGES>'
            },
            {
              content_type: 'text',
              title: 'Menu 🔙',
              payload: 'MENU'
            }
          ],
          settings: {
            quick_replies: true
          }
        }
        m3.json[lang.locale] = {
          texts: [
            'Okey... You are not interested in channel {channel_name} anymore.'
          ],
          quick_replies: [
            {
              content_type: 'text',
              title: 'More changes ⬆️',
              payload: '<TEMP_PAYLOAD_CHANGES>'
            },
            {
              content_type: 'text',
              title: 'Menu 🔙',
              payload: 'MENU'
            }
          ],
          settings: {
            quick_replies: true
          }
        }
      }
      knex('messages').insert([m1, m2, m3]).then(s => { resolve() }).catch(e => { reject(e) })
    }).catch(e => { reject(e) })
  })
}

exports.down = function (knex, Promise) {
  return knex('messages').whereIn('name', ['subscriptions_menu', 'subscription_enabled', 'subscription_disabled']).del()
}
