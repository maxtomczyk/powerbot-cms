const knex = require('../../modules/knex')

async function start () {
  try {
    const payloads = ['MENU', 'CONTACT', 'ARTICLES', 'CONTACT_CONFIRM', 'DETAILS', 'CLOTHES', 'STATS', 'RESET_USER_DATA', 'USERS_RANKING']
    let generated = []
    let created_at = new Date(+new Date() - 75 * 24 * 60 * 60 * 1000)
    for (let i = 0; i < 1500; i++) {
      const length = Math.floor(Math.random() * 20) + 2
      let trace = []
      for (let o = 0; o < length; o++) trace.push(payloads[Math.floor(Math.random() * payloads.length)])
      generated.push({
        payloads: trace,
        user_id: Math.floor(Math.random() * 12) + 1,
        created_at
      })
      if (i % 20 === 0) created_at = new Date(+new Date(created_at) + 24 * 60 * 60 * 1000)
    }
    await knex('payloads_traces').insert(generated)
    process.exit(0)
  } catch (e) {
    throw e
  }
}

start()
