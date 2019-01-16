const redisHandler = require('../../redis_handler.js')
const knex = require('../../knex.js')

class BotData {
  constructor() {
    this.cacheableData = {
      first_start: {
        timeout: 36 * 60 * 60
      },
      moderator_hours: {
        timeout: 30 * 60
      }
    }
  }

  async get(key) {
    try {
      let data = null
      if (this.cacheableData[key]) data = await this.getCacheable(key)
      else data = await this.getUncacheable(key)

      return data
    } catch (e) {
      throw e
    }
  }

  async getCacheable(key) {
    try {
      let data = await redisHandler.get(`bot-data-${key}`)
      if (data) return JSON.parse(data)

      data = await knex('bot_data').where('name', key).first()
      redisHandler.set(`bot-data-${key}`, JSON.stringify(data.data), this.cacheableData[key].timeout)

      return data.data
    } catch (e) {
      throw e
    }
  }

  async getUncacheable(key) {
    try {
      const data = await knex('bot_data').where('name', key).first()
      return data.data
    } catch (e) {
      throw e
    }
  }
}

module.exports = BotData;
