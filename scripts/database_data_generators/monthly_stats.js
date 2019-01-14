const knex = require('../../modules/knex')

async function start() {
  try {
    const months = 36
    let now = new Date()
    now.setHours(0, 0, 0, 0)
    now.setMonth(now.getMonth() - months, 1)
    let currentDate = now
    let startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setMonth(startDate.getMonth() - months - 1, 1)
    let data = []
    let allUsers = 400

    console.log(`Generating monthly stats for ${months} months`)

    for (let i = 0; i < months; i++) {
      let row = {
        unique_users: Math.floor(Math.random() * 400) + 1,
        all_users: allUsers,
        start: new Date(startDate.setMonth(startDate.getMonth() + 1)),
        end: new Date(currentDate.setMonth(currentDate.getMonth() + 1))
      }

      data.push(row)
      allUsers += Math.floor(Math.random() * 150) + 0

    }

    console.log('Truncating monthly stats table')
    await knex('stats_monthly_resolution').truncate()
    console.log('Saving generated data to database')
    await knex('stats_monthly_resolution').insert(data)
    console.log(`Saved`)
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
