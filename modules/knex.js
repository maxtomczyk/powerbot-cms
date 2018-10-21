const config = require('../config/config.js');
const knex = require('knex')({
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL || {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name
    },
    pool: { min: 0, max: 50 }
});

module.exports = knex;
