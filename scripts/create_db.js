const config = require('../config/config')
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: 'postgres'
  }
})

async function start () {
  try {
    let databases = await knex('pg_database').select('datname')
    databases = databases.map(d => d.datname)
    if (databases.indexOf(config.database.name) !== -1) {
      console.log('Database already available.')
      process.exit(0)
    }
    await knex.raw(`CREATE DATABASE ${config.database.name};`)
    console.log('Database created.')
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
