const config = require('../config/config')
const redisHandler = require('./redis_handler')
const redis = require('./redis')
const knex = require('./knex')

async function webEntries () {
  try {
    let keys = await redisHandler.scan('url-entries-counter:*')
    if (!keys.length) return
    keys = keys.map(k => k.replace(config.redis.prefix, ''))
    let keysToDel = keys
    const values = await redis.mgetAsync(...keys)
    keys = keys.map(k => k.replace('url-entries-counter:', ''))
    let results = {}
    keys.map((k, i) => { results[k] = parseInt(values[i]) })

    let dbRecords = await knex('url_entries').whereIn('url', keys)
    let records = {}
    dbRecords = dbRecords.map(r => { records[r.url] = r })

    let creationQueries = []
    let updateQueries = []

    for (let result in results) {
      if (records[result]) updateQueries.push(knex('url_entries').update('entries', knex.raw('entries + ??', [results[result]])).where('url', result))
      else creationQueries.push(knex('url_entries').insert({ url: result, entries: results[result] }))
    }
    await Promise.all(creationQueries)
    await Promise.all(updateQueries)
    await redis.delAsync(...keysToDel)
  } catch (e) {
    throw e
  }
}

module.exports = {
  webEntries
}
