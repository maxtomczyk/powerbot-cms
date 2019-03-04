const config = require('./config/config')

module.exports = {
  client: 'pg',
  useNullAsDefault: true,
  pool: { min: 0, max: 50 },
  connection: process.env.DATABASE_URL || {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
  },
  migrations: {
    directory: ['./node_modules/powerbot-cms/migrations', './migrations']
  }
}
