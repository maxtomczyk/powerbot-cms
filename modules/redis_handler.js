const redis = require('./redis')
const config = require('../config/config')

function get (key) {
  let promise = new Promise((resolve, reject) => {
    redis.getAsync(key)
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        if (err.code === 'NR_CLOSED') resolve(null)
        else reject(err)
      })
  })

  return promise
}

function set (key, data, timeout) {
  redis.set(key, data, 'EX', timeout)
}

function scan (pattern, cursor, results) {
  cursor = cursor || 0
  results = results || []
  return redis.scanAsync(cursor, 'MATCH', `${config.redis.prefix}${pattern}`)
    .then((data) => {
      results = results.concat(data[1])
      if (parseInt(data[0]) === 0) return results
      else return scan(pattern, data[0], results)
    })
}

module.exports = {
  get,
  set,
  scan
}
