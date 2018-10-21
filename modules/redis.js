const redis = require('redis')
const bluebird = require('bluebird');
const logger = require('./logger')
const config = require('../config/config.js')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

let client = require('redis').createClient(config.redis.url, {
  prefix: config.redis.prefix
})

client.on('error', (err) => {
    logger.error(err)
})

client.on('connect', async () => {
    logger.info('Connected to Redis store')
})
module.exports = client;
