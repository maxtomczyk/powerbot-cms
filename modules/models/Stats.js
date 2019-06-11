const redis = require('../redis')
const knex = require('../knex')
const emails = require('../emails')

class Stats {
  incomingMessage (message, user) {
    // User may be null if contacts for the fist time.
    redis.incr('stats-med-incoming-messages')
    redis.sadd('stats-daily-unique-users-list', message.sender_id)
    redis.sadd('stats-weekly-unique-users-list', message.sender_id)
    redis.sadd('stats-monthly-unique-users-list', message.sender_id)
    if (user) user.setInternalCacheKey('last-contact', +new Date())
  }

  outgoingMessage (message) {
    redis.incr('stats-med-outgoing-messages')
  }

  incomingPayload (message, user) {
    redis.incr(`stats-payload-entries:${message.payload}`)
    redis.rpush(`stats-user-payload-trace:${user.id}`, message.payload)
  }

  newUser (user) {
    redis.incr('stats-daily-new-users')
  }

  clearMediumResolutionData () {
    redis.set('stats-med-incoming-messages', 0)
    redis.set('stats-med-outgoing-messages', 0)
  }

  clearDailyResolutionData () {
    redis.del('stats-daily-unique-users-list')
    redis.del('stats-daily-new-users')
  }

  clearWeeklyResolutionData () {
    redis.del('stats-weekly-unique-users-list')
  }

  clearMonthlyResolutionData () {
    redis.del('stats-monthly-unique-users-list')
  }

  async saveMediumResolutionData () {
    try {
      let o = {
        messages_incoming: 0,
        messages_outgoing: 0,
        start: new Date(+new Date() - 10 * 60 * 1000),
        end: new Date()
      }

      let incoming = await redis.getAsync('stats-med-incoming-messages')
      let outgoing = await redis.getAsync('stats-med-outgoing-messages')

      if (incoming) o.messages_incoming = incoming
      if (outgoing) o.messages_outgoing = outgoing

      await knex('stats_medium_resolution').insert(o)
      this.clearMediumResolutionData()
    } catch (e) {
      throw e
    }
  }

  async saveDailyResolutionData () {
    try {
      const [users] = await knex('users').count()
      let o = {
        unique_users: 0,
        all_users: 0,
        new_users: 0,
        start: new Date(+new Date() - 24 * 60 * 60 * 1000),
        end: new Date()
      }

      let uniqueUsers = await redis.scardAsync('stats-daily-unique-users-list')
      let newUsers = await redis.getAsync('stats-daily-new-users')
      let allUsers = users.count

      if (uniqueUsers) o.unique_users = uniqueUsers
      if (allUsers) o.all_users = parseInt(allUsers)
      if (newUsers) o.new_users = parseInt(newUsers)

      await knex('stats_daily_resolution').insert(o)
      this.clearDailyResolutionData()
    } catch (e) {
      throw e
    }
  }

  async saveWeeklyResolutionData () {
    try {
      let start = new Date(+new Date() - 13 * 60 * 60 * 1000)
      let end = new Date(+new Date() - 13 * 60 * 60 * 1000)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      const [users] = await knex('users').count()
      let o = {
        unique_users: 0,
        all_users: 0,
        start: new Date(+new Date(start) - 6 * 24 * 60 * 60 * 1000),
        end
      }

      let uniqueUsers = await redis.scardAsync('stats-weekly-unique-users-list')
      let allUsers = users.count

      if (uniqueUsers) o.unique_users = uniqueUsers
      if (allUsers) o.all_users = parseInt(allUsers)

      await knex('stats_weekly_resolution').insert(o)
      this.clearWeeklyResolutionData()
      emails.broadcastWeeklyStats(o)
    } catch (e) {
      throw e
    }
  }

  async saveMonthlyResolutionData () {
    try {
      const [users] = await knex('users').count()
      let now = new Date(+new Date() - 13 * 60 * 60 * 1000)
      let end = new Date(+new Date() - 13 * 60 * 60 * 1000)
      now.setHours(0, 0, 0, 0)
      now.setMonth(now.getMonth(), 1)
      end.setHours(23, 59, 59, 0)
      end.setMonth(now.getMonth() + 1, 0)
      let o = {
        unique_users: 0,
        all_users: 0,
        start: now,
        end: end
      }

      let uniqueUsers = await redis.scardAsync('stats-monthly-unique-users-list')
      let allUsers = users.count

      if (uniqueUsers) o.unique_users = uniqueUsers
      if (allUsers) o.all_users = parseInt(allUsers)

      await knex('stats_monthly_resolution').insert(o)
      this.clearMonthlyResolutionData()
      emails.broadcastMonthlyStats(o)
    } catch (e) {
      throw e
    }
  }
}

module.exports = Stats
