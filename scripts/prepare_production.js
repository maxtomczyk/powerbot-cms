const knex = require('../modules/knex')

async function start () {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log('Unable to run database reset procedure in production environment for security reasons.')
      process.exit(0)
    }

    await knex('attachments').update({ attachment_id: null, force_update: true })
    await knex('bot_data').update('data', { timestamp: null }).where('name', 'first_start')
    await knex.raw('truncate table broadcasts restart identity;')
    await knex('channels').update('label_id', null)
    await knex('settings').update('value', 'true').where('name', 'flush_cache')
    await knex('settings').update('value', 'true').where('name', 'channels_check')
    await knex('static_elements').update('force_update', true)
    await knex.raw('truncate table stats_medium_resolution restart identity;')
    await knex.raw('truncate table stats_daily_resolution restart identity;')
    await knex.raw('truncate table stats_weekly_resolution restart identity;')
    await knex.raw('truncate table stats_monthly_resolution restart identity;')
    await knex.raw('truncate table unknown_phrases restart identity;')
    await knex.raw('truncate table users restart identity cascade;')
    await knex.raw('truncate table users_removed restart identity;')

    console.log('Database is ready for production and will be configured on first run.')
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
