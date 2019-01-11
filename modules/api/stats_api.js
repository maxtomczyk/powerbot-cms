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
      dates.push(record.start)
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

async function usersData(req, res) {
  try {
    const gendersCount = await knex('users').select('gender').groupBy('gender').count()
    const [awaitingCount] = await knex('users').where('moderator_chat', true).count()
    const [topId] = await knex('users').max('id')

    let total = 0
    let genders = {}
    let percents = {
      male: null,
      female: null
    }

    for (let row of gendersCount) {
      let n = parseInt(row.count)
      genders[row.gender] = n
      total += n
    }

    percents.male = Math.round((genders.male / (genders.male + genders.female)) * 100)
    percents.female = Math.round((genders.female / (genders.male + genders.female)) * 100)

    let deleted = topId.max - total
    let awaiting = awaitingCount.count

    res.json({
      total,
      percents,
      deleted,
      awaiting
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function botData(req, res) {
  try {
    const [messagesCount] = await knex('messages').count()
    const [attachmentsCount] = await knex('attachments').count()
    const [broadcastsCount] = await knex('broadcasts').where('status', 'FINISHED').count()
    const firstStart = await knex('bot_data').where('name', 'first_start').first()
    const daysInWeb = (+new Date() - +new Date(firstStart.data.timestamp)) / (1000 * 60 * 60 * 24)

    res.json({
      messages: messagesCount.count,
      attachments: attachmentsCount.count,
      broadcasts: broadcastsCount.count,
      daysUp: Math.floor(daysInWeb)
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function usersDailyChartData(req, res) {
  try {
    let rows = await knex('stats_daily_resolution').orderBy('id', 'desc').limit(req.query.days)
    rows = rows.reverse()
    let xaxis = []
    let allUsers = []
    let uniqueUsers = []

    for (let record of rows) {
      xaxis.push(record.start)
      allUsers.push(record.all_users)
      uniqueUsers.push(record.unique_users)
    }


    res.json({
      xaxis,
      allUsers,
      uniqueUsers
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function usersWeeklyChartData(req, res) {
  try {
    let rows = await knex('stats_weekly_resolution').orderBy('id', 'desc').limit(req.query.weeks)
    rows = rows.reverse()
    let xaxis = []
    let allUsers = []
    let uniqueUsers = []

    for (let record of rows) {
      let label = createChartTimeString(record.start)
      label = label.replace(/ \d\d:\d\d/, '')
      xaxis.push(record.start)
      allUsers.push(record.all_users)
      uniqueUsers.push(record.unique_users)
    }


    res.json({
      xaxis,
      allUsers,
      uniqueUsers
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  systemStatus,
  messagesChartData,
  messagesData,
  usersData,
  botData,
  usersDailyChartData,
  usersWeeklyChartData
}
