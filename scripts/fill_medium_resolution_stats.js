const knex = require('../modules/knex')

async function start(){
  try {
    const now = new Date()
    const days = 10
    const samplesN = days * 24 * 6
    let data = []

    now.setHours(now.getHours(), Math.floor(now.getMinutes() / 10) * 10, 0, 0)
    let startDate = +new Date(now) - 10 * 24 * 60 * 60 * 1000
    let recentDate = null

    console.log(`\nStarting script with start date:\n${new Date(startDate)}`);

    for (let i = 0; i < samplesN; i++) {
      let row = {
        messages_incoming: Math.floor(Math.random() * (200 - 50)) + 50,
        messages_outgoing: Math.floor(Math.random() * (200 - 50)) + 50,
        new_users: Math.floor(Math.random() * (15 - 0)) + 0,
        start: new Date(startDate),
        end: new Date(startDate + 10 * 60 * 1000)
      }
      data.push(row)
      startDate += 10 * 60 * 1000
    }

    console.log(`\nGenerated ${data.length} rows of data (${days} days)`);

    await knex('stats_medium_resolution').truncate()
    console.log(`\n"stats_medium_resolution" table truncated`);

    await knex('stats_medium_resolution').insert(data)

    console.log(`\nSaved data to database`);
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
