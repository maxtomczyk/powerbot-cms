const knex = require('../../modules/knex')

async function start() {
  try {
    const weeks = 30
    let lastSunday = new Date(+new Date() - new Date().getDay() * 24 * 60 * 60 * 1000)
    lastSunday.setHours(0, 0, 0, 0)
    let lastMonday = new Date(+new Date(lastSunday) + 24 * 60 * 60 * 1000)
    let currentDate = new Date(+new Date(lastMonday) - weeks * 7 * 24 * 60 * 60 * 1000)
    let data = []
    let allUsers = 200

    console.log(`Generating weekly stats for ${weeks} weeks`)
    for (let i = 0; i < weeks; i++) {
      let row = {
        unique_users: Math.floor(Math.random() * 110) + 1,
        all_users: allUsers,
        start: currentDate,
        end: new Date(+new Date(currentDate) + (7 * 24 * 60 * 60 * 1000))
      }

      data.push(row)
      allUsers += Math.floor(Math.random() * 55) + 0
      currentDate = new Date(+new Date(currentDate) + (7 * 24 * 60 * 60 * 1000))
    }

    console.log('Truncating weekly stats table')
    await knex('stats_weekly_resolution').truncate()
    console.log('Saving generated data to database')
    await knex('stats_weekly_resolution').insert(data)
    console.log(`Saved`)
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
