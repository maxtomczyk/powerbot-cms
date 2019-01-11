const knex = require('../../modules/knex')

async function start() {
  try {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const days = 50
    let data = []
    let currentDate = new Date(now - days * 24 * 60 * 60 * 1000)
    let allUsers = 200

    console.log(`Generating daily stats for ${days} days`)
    for (let i = 0; i < days; i++) {
      let row = {
        unique_users: Math.floor(Math.random() * 70) + 1,
        all_users: allUsers,
        start: currentDate,
        end: new Date(+new Date(currentDate) + (24 * 60 * 60 * 1000))
      }

      data.push(row)
      allUsers += Math.floor(Math.random() * 15) + 0
      currentDate = new Date(+new Date(currentDate) + (24 * 60 * 60 * 1000))
    }

    console.log('Truncating daily stats table')
    await knex('stats_daily_resolution').truncate()
    console.log('Saving generated data to database')
    await knex('stats_daily_resolution').insert(data)
    console.log(`Saved`)

    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
