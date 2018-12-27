const redis = require('redis')
const bluebird = require('bluebird');
const logger = require('./logger')
const config = require('../config/config.js')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

let client = require('redis').createClient(config.redis.url, {
  prefix: config.redis.prefix,
  enable_offline_queue: false
})

client.on('error', (err) => {
    logger.warn(err)
})

module.exports = client
