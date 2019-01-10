const axios = require('axios')

const knex = require('../knex.js')
const redis = require('../redis.js')
const logger = require('../logger.js')

function createChartTimeString(date) {
  let d = new Date(date)
  let h = d.getHours().toString()
  let m = d.getMinutes().toString()
  let day = d.getDate()
  let month = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.', 'VII.', 'VIII.', 'IX.', 'X.', 'XI.', 'XII.'][d.getMonth()]

  if (h.length !== 2) h = `0${h}`
  if (m.length !== 2) m = `0${m}`

  return `${day} ${month} ${h}:${m}`
}

async function systemStatus(req, res) {
  try {
    let status = {
      database: {},
      cache: {},
      system: {
        live: true
      }
    }

    try {
      let db = await knex.raw('select 1+1 as result;');
      status.database.live = true
    } catch (e) {
      status.database.live = false
    }

    try {
      let red = await redis.pingAsync()
      status.cache.live = true
    } catch (e) {
      status.cache.live = false
    }

    res.json(status)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function messagesChartData(req, res) {
  try {
    let data = await knex('stats_medium_resolution').select('*', knex.raw('(messages_incoming + messages_outgoing) as messages_total')).orderBy('id', 'desc').limit(6 * req.query.hours);
    data = data.reverse()
    const startDate = new Date(new Date() - (parseInt(req.query.hours) * 60 * 60 * 1000))
    let dates = []

    for (let record of data) {
      let str = `${createChartTimeString(record.start)} - ${createChartTimeString(record.end)}`
      dates.push(str)
    }

    res.json({
      xaxis: dates,
      stats: data
    })

  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

async function messagesData(req, res) {
  try {
    const data = await knex.raw('select sum(messages_outgoing) as outgoing, sum(messages_incoming) as incoming from (select * from stats_medium_resolution order by id desc limit ?) as subquery', [6 * req.query.hours])
    const incoming = parseInt(data.rows[0].incoming)
    const outgoing = parseInt(data.rows[0].outgoing)
    const total = incoming + outgoing
    const ratio = Math.round((outgoing / incoming) * 100) / 100

    res.json({
      incoming,
      outgoing,
      total,
      ratio
    })
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  systemStatus,
  messagesChartData,
  messagesData
}
