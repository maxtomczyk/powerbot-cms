const knex = require('../modules/knex')

async function start () {
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

    await knex.schema.createTable('messages_plugs', function (table) {
      table.increments()
      table.integer('group_id').references('messages_groups.id').onUpdate('cascade').onDelete('cascade')
      table.string('name', 64)

      table.unique('id')
    })

    await knex.schema.createTable('messages', function (table) {
      table.increments()
      table.varchar('name', 32).notNullable()
      table.string('friendly_name', 64)
      table.json('json').notNullable()
      table.integer('plug_id').references('messages_plugs.id').onUpdate('cascade').onDelete('cascade')
      table.integer('language_id').references('languages.id').onUpdate('cascade').onDelete('cascade')
      table.varchar('description', 64)

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
      name: 'Default'
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
            type: 'postback',
            payload: 'CONTACT'
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

    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
