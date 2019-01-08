const redis = require('../redis')
const knex = require('../knex')
const config = require('../../config/config')

class Stats {
  constructor() {

  }

  incomingMessage(message) {
    redis.incr('stats-med-incoming-messages')
    redis.sadd('stats-daily-unique-users-list', message.sender_id)
    redis.sadd('stats-weekly-unique-users-list', message.sender_id)
  }

  outgoingMessage(message) {
    redis.incr('stats-med-outgoing-messages')
  }

  newUser(user) {
    redis.incr('stats-med-new-users')
  }

  clearMediumResolutionData() {
    redis.set('stats-med-incoming-messages', 0)
    redis.set('stats-med-outgoing-messages', 0)
    redis.set('stats-med-new-users', 0)
  }

  clearDailyResolutionData() {
    redis.del('stats-daily-unique-users-list')
  }

  clearWeeklyResolutionData() {
    redis.del('stats-weekly-unique-users-list')
  }

  async saveMediumResolutionData() {
    try {
      let o = {
        messages_incoming: 0,
        messages_outgoing: 0,
        new_users: 0,
        start: new Date(+new Date - 10 * 60 * 1000),
        end: new Date()
      }

      let incoming = await redis.getAsync('stats-med-incoming-messages')
      let outgoing = await redis.getAsync('stats-med-outgoing-messages')
      let users = await redis.getAsync('stats-med-new-users')

      if (incoming) o.messages_incoming = incoming
      if (outgoing) o.messages_outgoing = outgoing
      if (users) o.new_users = users

      await knex('stats_medium_resolution').insert(o)
      this.clearMediumResolutionData()
    } catch (e) {
      throw e
    }
  }

  async saveDailyResolutionData() {
    try {
      const [users] = await knex('users').count()
      let o = {
        unique_users: 0,
        all_users: 0,
        start: new Date(+new Date - 24 * 60 * 60 * 1000),
        end: new Date()
      }

      let uniqueUsers = await redis.scardAsync('stats-daily-unique-users-list')
      let allUsers = users.count

      if (uniqueUsers) o.unique_users = uniqueUsers
      if (allUsers) o.all_users = parseInt(allUsers)

      await knex('stats_daily_resolution').insert(o)
      this.clearDailyResolutionData()
    } catch (e) {
      throw e
    }
  }

  async saveWeeklyResolutionData() {
    try {
      const [users] = await knex('users').count()
      let o = {
        unique_users: 0,
        all_users: 0,
        start: new Date(+new Date - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      }

      let uniqueUsers = await redis.scardAsync('stats-weekly-unique-users-list')
      let allUsers = users.count

      if (uniqueUsers) o.unique_users = uniqueUsers
      if (allUsers) o.all_users = parseInt(allUsers)

      await knex('stats_weekly_resolution').insert(o)
      this.clearWeeklyResolutionData()
    } catch (e) {
      throw e
    }
  }
}

module.exports = Stats;
