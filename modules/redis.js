const redis = require('redis')
const bluebird = require('bluebird')
const logger = require('./logger')
const config = require('../config/config.js')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

let client = null

if (config.hosting.provider === 'nanobox') {
  client = require('redis').createClient({
    host: config.redis.url,
    prefix: config.redis.prefix,
    enable_offline_queue: false
  })
} else {
  client = require('redis').createClient(config.redis.url, {
    prefix: config.redis.prefix,
    enable_offline_queue: false
  })
}

client.on('error', (err) => {
  logger.error(err)
})

module.exports = client
