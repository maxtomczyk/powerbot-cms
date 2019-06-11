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

async function buttonsClicks () {
  try {
    let monitored = []
    if (Array.isArray(config.stats.monitoredPayloads)) monitored = config.stats.monitoredPayloads
    else monitored = config.stats.monitoredPayloads.split(',').map(el => el.trim())

    let keys = await redisHandler.scan('stats-payload-entries:*')
    const keysWithoutPrefixes = keys.map(k => k.replace(config.redis.prefix, ''))
    if (!keys.length) return

    let creationQueries = []
    let updateQueries = []
    let stored = {}
    const storedRows = await knex('payloads_entries')

    for (let row of storedRows) stored[row.payload] = row
    const value = await redis.mgetAsync(...keysWithoutPrefixes)
    let i = -1

    for (let key of keys) {
      ++i
      const payload = key.replace(`${config.redis.prefix}stats-payload-entries:`, '')
      if (monitored[0] !== '*' && monitored.indexOf(payload) === -1) continue
      if (stored[payload]) updateQueries.push(knex('payloads_entries').update('entries', knex.raw('entries + ??', parseInt(value[i]))).where('payload', payload))
      else creationQueries.push(knex('payloads_entries').insert({ payload, entries: value[i] }))
    }

    await Promise.all(creationQueries)
    await Promise.all(updateQueries)
    await redis.delAsync(...keysWithoutPrefixes)
  } catch (e) {
    throw e
  }
}

async function collectPayloadTraces () {
  try {
    let keys = await redisHandler.scan('stats-user-payload-trace:*')
    if (!keys.length) return
    let users = keys.map(k => `internal-user-data:${parseInt(k.replace(`${config.redis.prefix}stats-user-payload-trace:`, ''))}:last-contact`)
    const lastContacts = await redis.mgetAsync(...users)
    users = users
      .filter((u, i) => {
        if (!lastContacts[i]) return false
        else return +new Date() - JSON.parse(lastContacts[i]).value >= 5 * 60 * 1000
      })
      .map(u => u.replace('internal-user-data:', '').replace(':last-contact', ''))
    keys = keys
      .map(k => k.replace(config.redis.prefix, ''))
      .filter(k => users.indexOf(k.replace('stats-user-payload-trace:', '')) !== -1)
    if (!keys.length) return
    let multi = redis.multi()
    for (let key of keys) multi.lrange(key, 0, -1)
    const replies = await multi.execAsync()
    let data = []
    for (let i = 0; i < keys.length; i++) {
      if (replies[i].length <= 1) continue
      data.push({
        user_id: users[i],
        payloads: replies[i]
      })
    }
    await redis.delAsync(...keys)
    await knex.batchInsert('payloads_traces', data)
  } catch (e) {
    throw e
  }
}

module.exports = {
  webEntries,
  buttonsClicks,
  collectPayloadTraces
}
