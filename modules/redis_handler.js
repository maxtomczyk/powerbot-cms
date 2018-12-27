const redis = require('./redis')

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

module.exports = {
  get,
  set
}
