const os = require('os')
const knex = require('../modules/knex')
const {
  spawnSync
} = require('child_process')

async function start() {
  try {
    await knex.schema.createTable('admins', function (table) {
      table.increments()
      table.string('name', 64).notNullable()
      table.string('login', 64).notNullable()
      table.text('password').notNullable()
      table.boolean('owner').defaultTo(false).notNullable()

      table.unique('id')
      table.unique('login')
    })

    await knex.schema.createTable('attachments', function (table) {
      table.increments()
      table.string('name', 32).notNullable()
      table.string('friendly_name', 64).notNullable()
      table.text('description')
      table.text('url').notNullable()
      table.boolean('force_update').defaultTo(true).notNullable()
      table.string('attachment_id', 64)

      table.unique('id')
      table.unique('name')
    })

    await knex.schema.createTable('channels', function (table) {
      table.increments()
      table.string('name', 64).notNullable()
      table.boolean('default').defaultTo(false).notNullable()
      table.text('label_id')
      table.string('friendly_name', 64)

      table.unique('id')
    })

    await knex.schema.createTable('languages', function (table) {
      table.increments()
      table.string('name', 64).notNullable()
      table.string('locale', 8).notNullable()
      table.boolean('default').defaultTo(false).notNullable()
      table.unique('id')
      table.unique('locale')
    })

    await knex.schema.createTable('messages_groups', function (table) {
      table.increments()
      table.string('name', 64)
      table.boolean('builtin').defaultTo(false)

      table.unique('id')
    })

    await knex.schema.createTable('messages', function (table) {
      table.increments()
      table.string('name', 64).notNullable()
      table.string('friendly_name', 64)
      table.text('description')
      table.json('json').notNullable()
      table.integer('group_id').notNullable().references('messages_groups.id').onUpdate('cascade').onDelete('cascade')
      table.varchar('type', 32).notNullable()

      table.unique('id')
      table.unique('name')
    })

    await knex.schema.createTable('custom_postbacks', function (table) {
      table.increments()
      table.string('postback', 1000).notNullable()
      table.integer('message_id').notNullable().references('messages.id').onUpdate('cascade').onDelete('cascade')
      table.string('friendly_name', 64)

      table.unique('id')
      table.unique('postback')
    })

    await knex.schema.createTable('regex_reactions', function (table) {
      table.increments()
      table.text('regex_body').notNullable()
      table.integer('message_id').notNullable().references('messages.id').onUpdate('cascade').onDelete('cascade')
      table.string('regex_flags', 16)
      table.string('friendly_name', 64)

      table.unique('id')
    })

    await knex.schema.createTable('settings', function (table) {
      table.increments()
      table.string('name', 32).notNullable()
      table.string('value', 128).notNullable()

      table.unique('id')
      table.unique('name')
    })

    await knex.schema.createTable('static_elements', function (table) {
      table.increments()
      table.string('name', 32).notNullable()
      table.text('value')
      table.json('json')

      table.unique('id')
    })

    await knex.schema.createTable('unknown_phrases', function (table) {
      table.increments()
      table.text('phrase').notNullable()

      table.unique('id')
    })

    await knex.schema.createTable('users', function (table) {
      table.increments()
      table.string('first_name', 64)
      table.string('last_name', 64)
      table.string('locale', 8)
      table.string('messenger_id', 64).notNullable()
      table.string('gender', 6)
      table.boolean('moderator_chat').defaultTo(false).notNullable()
      table.boolean('bot_lock').defaultTo(false).notNullable()
      table.boolean('waiting_for_reason').defaultTo(false).notNullable()
      table.text('chat_reason')

      table.unique('id')
    })

    await knex.schema.createTable('broadcasts', function (table) {
      table.increments()
      table.text('broadcast_id')
      table.integer('channel_id').notNullable().references('channels.id').onUpdate('cascade').onDelete('cascade')
      table.integer('message_id').notNullable().references('messages.id').onUpdate('cascade').onDelete('cascade')
      table.timestamp('schedule_time')
      table.string('status', 32)
      table.text('creative_id').notNullable()
      table.text('range')

      table.unique('id')
      table.unique('broadcast_id')
    })

    await knex.schema.createTable('users_channels', function (table) {
      table.increments()
      table.integer('user_id').notNullable().references('users.id').onUpdate('cascade').onDelete('cascade')
      table.integer('channel_id').notNullable().references('channels.id').onUpdate('cascade').onDelete('cascade')

      table.unique('id')
    })

    await knex('admins').insert({
      name: 'Bot Owner',
      login: 'owner',
      password: '$argon2i$v=19$m=4096,t=1,p=1$c29tZXNhbHQ$Q9zntiU3SaKoZ/8zc4I2gksMx3Y6wUzeHK8ygWcoaMQ',
      owner: true
    })

    await knex('channels').insert({
      name: 'incredbot_default',
      friendly_name: 'Incredbot CMS Channel',
      default: true
    })

    await knex('languages').insert({
      name: 'English',
      locale: 'en_US',
      default: true
    })

    await knex('messages_groups').insert({
      id: 1,
      name: 'Basic',
      builtin: true
    })

    await knex('messages_groups').insert({
      id: 2,
      name: 'Emissions',
      builtin: true
    })

    await knex('messages_groups').insert({
      id: 3,
      name: 'Text reactions',
      builtin: true
    })

    await knex('messages_groups').insert({
      id: 4,
      name: 'Postbacks reactions',
      builtin: true
    })

    await knex('settings').insert([{
      name: 'force_update_statics',
      value: 'true'
    }, {
      name: 'channels_check',
      value: 'false'
    }, {
      name: 'channels_sync_check',
      value: 'false'
    }])

    await knex('static_elements').insert([{
      name: 'menu',
      value: null,
      json: {
        persistent_menu: [{
          locale: 'default',
          call_to_actions: [{
            title: 'Contact',
            type: 'postback',
            payload: 'CONTACT'
          }, {
            title: 'Settings',
            type: 'nested',
            call_to_actions: [{
              title: 'Remove my data',
              type: 'postback',
              payload: 'CLEAR_USER_DATA'
            }]
          }, {
            title: 'Powered by Incredbot',
            type: 'web_url',
            url: 'https://github.com/maxtomczyk/incredbot-cms'
          }]
        }]
      }

    }, {
      name: 'get_started_payload',
      value: 'GET_STARTED',
      json: null
    }, {
      name: 'hello',
      value: `Hello, it's default hello message of Incredbot CMS`,
      json: null
    }])

    await knex('messages').insert([{
      name: 'default',
      friendly_name: 'Unknown message reaction',
      description: 'Sended when received textmessage unhandled by code and CMS regex reactions.',
      json: {
        'en_US': {
          'texts': [`Ohh, sorry. I don't know what to say... You can set reaction for text messages in your code or CMS! :)`]
        }
      },
      group_id: 1,
      type: 'text'
    }, {
      name: 'contact_question',
      friendly_name: 'Contact question',
      description: `Sended after 'Contact' button.`,
      json: {
        'en_US': {
          'texts': ['You are going to contact our moderator, do you want to continue?'],
          'quick_replies': [{
            'content_type': 'text',
            'title': 'Continue',
            'payload': 'CONTACT_CONFIRM'
          }, {
            'content_type': 'text',
            'title': 'Cancel',
            'payload': 'CONTACT_CANCEL'
          }]
        }
      },
      group_id: 1,
      type: 'quick_replies'
    }, {
      name: 'contact_confirmed',
      friendly_name: 'Contact confirmed',
      description: 'Bot replies this message to user which confirmed contact question',
      json: {
        'en_US': {
          'texts': ['Okay. Can you describe your problem/question? This will be joined to your moderator chat request ;)\nPlease, send it in one message :D']
        }
      },
      group_id: 1,
      type: 'text'
    }, {
      name: 'contact_canceled',
      friendly_name: 'Contact canceled',
      description: 'Sended when user canceled moderator chat request',
      json: {
        'en_US': {
          'texts': ['Contact with moderator has been canceled! ']
        }
      },
      group_id: 1,
      type: 'text'
    }, {
      name: 'contact_message_saved',
      friendly_name: 'Contact description saved',
      description: 'Sended when user sends message with question for moderator',
      json: {
        'en_US': {
          'texts': ["Okay, your question has been saved!\nModerator will contact you as soon as it's possible!"]
        }
      },
      group_id: 1,
      type: 'text'
    }, {
      name: 'contact_ended',
      friendly_name: 'Contact ended',
      description: 'Sended when moderator finishes contact and unblocks bot.',
      json: {
        'en_US': {
          'texts': ['Moderator finished chat!']
        }
      },
      group_id: 1,
      type: 'text'
    }, {
      name: 'user_data_remove',
      friendly_name: 'User data remove question',
      description: 'Sended when user click "Data remove" button',
      json: {
        'en_US': {
          'texts': ['You are about to remove your data from bot. Are you sure?'],
          'quick_replies': [{
            'content_type': 'text',
            'title': 'Delete my data',
            'payload': 'REMOVE_USER_DATA'
          }, {
            'content_type': 'text',
            'title': 'Cancel',
            'payload': 'CLEAR_USER_DATA_CANCEL'
          }]
        }
      },
      group_id: 1,
      type: 'quick_replies'
    }, {
      name: 'user_data_remove_canceled',
      friendly_name: 'User data remove cancel',
      description: 'Sended when user cancel data removal',
      json: {
        'en_US': {
          'texts': ['User data remove canceled!']
        }
      },
      group_id: 1,
      type: 'text'
    }, {
      name: 'user_data_removed',
      friendly_name: 'User data removed',
      description: 'Sended when user removed data',
      json: {
        'en_US': {
          'texts': ['Your data has been removed. If you start new conversation you will be treated as a new user.'],
          'quick_replies': [{
            'content_type': 'text',
            'title': 'Start',
            'payload': 'GET_STARTED'
          }]
        }
      },
      group_id: 1,
      type: 'quick_replies'
    }])
    const npm = (os.platform() === 'win32') ? 'npm.cmd' : 'npm'
    const child = spawnSync(npm, ['run', 'migrate']);

    if (child.error) console.log(child.error.toString('utf8'));
    if (child.stdout) console.log(child.stdout.toString('utf8'));
    if (child.stderr) console.log(child.stderr.toString('utf8'));

    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
