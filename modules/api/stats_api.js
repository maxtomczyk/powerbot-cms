const axios = require('axios')

const knex = require('../knex.js')
const redis = require('../redis.js')
const logger = require('../logger.js')

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

    for (let i = 0; i < data.length; i++) {
      let row = data[i]
      let nextRow = data[i + 1]

      if (nextRow) {
        if (nextRow.start - row.start > (10 * 60 * 1000) + 10000) {
          let startDate = row.end
          let insertData = []
          while (startDate < nextRow.start) {
            insertData.push({
              messages_incoming: null,
              messages_outgoing: null,
              messages_total: null,
              new_users: null,
              start: startDate,
              end: new Date(+new Date(startDate) + 10 * 60 * 1000)
            })
            startDate = new Date(+new Date(startDate) + 10 * 60 * 1000)
          }
          insertData.pop()
          insertData = insertData.reverse()
          for (insert of insertData) {
            let o = i + 1
            data.splice(o, 0, insert)
            o++
          }

          i = i + insertData.length
        }
      }
    }

    res.json({
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

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      let nextRow = rows[i + 1]

      if (nextRow) {
        if (nextRow.start - row.start > (24 * 60 * 60 * 1000) + 10000) {
          let startDate = row.end
          let insertData = []
          while (startDate < nextRow.start) {
            insertData.push({
              all_users: null,
              unique_users: null,
              start: startDate,
              end: new Date(+new Date(startDate) + 24 * 60 * 60 * 1000)
            })
            startDate = new Date(+new Date(startDate) + 24 * 60 * 60 * 1000)
          }
          insertData.reverse()
          for (insert of insertData) {
            let o = i + 1
            rows.splice(o, 0, insert)
            o++
          }

          i = i + insertData.length
        }
      }
    }

    res.json({
      rows
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

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      let nextRow = rows[i + 1]

      if (nextRow) {
        if (nextRow.start - row.start > (7 * 24 * 60 * 60 * 1000) + 10000) {
          let startDate = row.end
          let insertData = []
          while (startDate < nextRow.start) {
            insertData.push({
              all_users: null,
              unique_users: null,
              start: startDate,
              end: new Date(+new Date(startDate) + 7 * 24 * 60 * 60 * 1000)
            })
            startDate = new Date(+new Date(startDate) + 7 * 24 * 60 * 60 * 1000)
          }
          insertData.reverse()
          for (insert of insertData) {
            let o = i + 1
            rows.splice(o, 0, insert)
            o++
          }

          i = i + insertData.length
        }
      }
    }


    res.json({
      rows
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
