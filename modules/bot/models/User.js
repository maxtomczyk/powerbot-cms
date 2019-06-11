const config = require('../../../config/config.js')
const knex = require('../../knex.js')
const logger = require('../../logger.js')
const incredbot = require('../../incredbot.js')
const messages = require('../../messages.js')
const redis = require('../../redis.js')
const Stats = require('../../models/Stats')

const stats = new Stats()

class User {
  constructor (messenger_id) {
    this.data = {}
    this.messenger_id = messenger_id
  }

  async getDefaultChannels () {
    try {
      return await knex('channels').where('default', true).andWhereNot('label_id', null)
    } catch (e) {
      throw e
    }
  }

  async addToChannel (name) {
    try {
      const row = await knex('channels').where('name', name).first()
      const labelId = row.label_id
      const channelId = row.id

      if (config.settings.autoSyncChannelsWithBroadcastApi) await incredbot.broadcast.labelToUser(labelId, this.messenger_id)
      const duplicate = await knex('users_channels').where('user_id', this.id).andWhere('channel_id', channelId).first()
      if (!duplicate) {
        const o = {
          user_id: this.id,
          channel_id: channelId
        }
        await knex('users_channels').insert(o)
      }
    } catch (e) {
      throw e
    }
  }

  async removeFromChannel (name) {
    try {
      const row = await knex('channels').where('name', name).first()
      const labelId = row.label_id
      const channelId = row.id

      if (config.settings.autoSyncChannelsWithBroadcastApi) await incredbot.broadcast.removeLabelFromUser(labelId, this.messenger_id)
      await knex('users_channels').where('channel_id', channelId).andWhere('user_id', this.id).del()
    } catch (e) {
      throw e
    }
  }

  async loadOrCreate (noCreate) {
    try {
      let record = await knex('users').where('messenger_id', this.messenger_id).first()

      if (record) {
        Object.assign(this, record)
        return this
      } else if (!noCreate) {
        let additionalData = (config.settings.usersAdditionalData) ? config.settings.usersAdditionalData.split(' ') : []
        let data = await incredbot.User(this.messenger_id).getData('first_name', 'last_name', 'id', ...additionalData)
        let defaultChannels = await this.getDefaultChannels()

        let user = {
          first_name: data.first_name,
          last_name: data.last_name,
          locale: data.locale,
          gender: data.gender,
          timezone: data.timezone,
          messenger_id: data.id,
          profile_pic: data.profile_pic
        }

        let createdUser = null

        await knex.transaction((trx) => {
          return trx('users').insert(user).returning('*')
            .then((created) => {
              stats.newUser(created)
              createdUser = created[0]
              let channels = defaultChannels.map((c, i) => {
                return {
                  user_id: created[0].id,
                  channel_id: c.id,
                  label_id: c.label_id
                }
              })
              channels = channels.map((c, i) => {
                incredbot.broadcast.labelToUser(c.label_id, createdUser.messenger_id)
                  .then(data => {
                    logger.debug(`Assigned label ${c.label_id} to user ${createdUser.messenger_id}`)
                  })
                  .catch(e => {
                    logger.warn(`Unable to attach label ${c.label_id} to user ${created[0].messenger_id}`)
                    logger.error(e)
                  })

                return {
                  user_id: created[0].id,
                  channel_id: c.channel_id
                }
              })

              return trx('users_channels').insert(channels)
            })
        }).then(() => {
          logger.debug(`Created user with id ${createdUser.id}`)
        }).catch(e => {
          logger.error(e)
          throw e
        })
        Object.assign(this, createdUser)
        return this
      } else return null
    } catch (e) {
      throw e
    }
  }

  async disableChatLock () {
    try {
      await knex('users').update({
        bot_lock: false
      }).where('messenger_id', this.messenger_id).returning('*')
    } catch (e) {
      throw e
    }
  }

  async enableModeratorChat () {
    try {
      await knex('users').update({
        moderator_chat: true,
        waiting_for_reason: true,
        bot_lock: true,
        moderator_chat_time: new Date()
      }).where('messenger_id', this.messenger_id).returning('*')
    } catch (e) {
      throw e
    }
  }

  async disableModeratorChat (silent) {
    try {
      let [updated] = await knex('users').update({
        moderator_chat: false,
        bot_lock: false,
        chat_reason: '',
        waiting_for_reason: false,
        moderator_chat_time: null
      }).where('messenger_id', this.messenger_id).returning('*')
      if (updated) {
        if (!silent) await incredbot.send.raw(await messages.get('contact_ended', updated))
      }
    } catch (e) {
      throw e
    }
  }

  async disableModeratorChatWithId (id) {
    try {
      let [updated] = await knex('users').update({
        moderator_chat: false,
        bot_lock: false,
        chat_reason: '',
        waiting_for_reason: false
      }).where('id', id).returning('*')
      if (updated) {
        await incredbot.send.raw(await messages.get('contact_ended', updated))
      }
    } catch (e) {
      throw e
    }
  }

  async removeFromDatabase () {
    try {
      const channels = await knex('channels')
      if (!this.id) await this.loadOrCreate()
      for (const channel of channels) {
        await this.removeFromChannel(channel.name)
      }
      await knex('users').where('messenger_id', this.messenger_id).del()
      const saved = await knex('users_removed').where('messenger_id', this.messenger_id).first()
      if (!saved) await knex('users_removed').insert({ messenger_id: this.messenger_id })
    } catch (e) {
      throw e
    }
  }

  async syncChannelsWithRemote () {
    try {
      if (!this.id) await this.loadOrCreate()
      logger.debug(`Channels sync started for user ${this.id}`)

      const locals = await knex('users_channels as uc').join('channels as c', 'c.id', 'uc.channel_id').where('uc.user_id', this.id)
      const channels = await knex('channels')
      let remotes = await incredbot.broadcast.listUserLabels(this.messenger_id)
      remotes = remotes.data

      for (const local of locals) {
        let sync = false
        for (const remote of remotes) {
          if (remote.id == local.label_id) sync = true
        }

        if (!sync) {
          logger.debug(`Local label ${local.name} out of sync. Adding to remote label...`)
          await this.addToChannel(local.name)
          logger.debug('Added!')
        }
      }

      remotes = await incredbot.broadcast.listUserLabels(this.messenger_id)
      remotes = remotes.data

      for (const remote of remotes) {
        let sync = false
        for (const local of locals) {
          if (local.label_id === remote.id) sync = true
        }

        if (sync) continue

        for (const channel of channels) {
          if (remote.id == channel.label_id) {
            logger.debug(`Remote ${remote.name} out of sync and local dependancy found. Adding user to local channel`)
            let o = {}
            o.user_id = this.id
            o.channel_id = channel.id
            await knex('users_channels').insert(o)
          }
        }
      }

      logger.debug(`Channels sync for user ${this.id} finished.`)
    } catch (e) {
      throw e
    }
  }

  async getDbKey (key, detailed) {
    try {
      if (!this.id) {
        logger.warn(`Trying to get key '${key}' from database users data for user without id!`)
        return null
      }

      const row = await knex('users_data').where('user_id', this.id).andWhere('name', key).first()
      if (!row) return null
      if (!detailed) return row.data.value
      else return row
    } catch (e) {
      throw e
    }
  }

  async setDbKey (key, value) {
    try {
      if (!this.id) {
        logger.warn(`Trying to set key '${key}' to database users data for user without id!`)
        return null
      }

      let up = {
        last_update: new Date(),
        data: {
          value
        }
      }

      const updated = await knex('users_data').update(up).where('name', key).andWhere('user_id', this.id)
      if (updated) return

      let ins = {
        data: {
          value
        },
        name: key,
        user_id: this.id
      }
      await knex('users_data').insert(ins)
      return
    } catch (e) {
      throw e
    }
  }

  async removeDbKey (key) {
    try {
      if (!this.id) {
        logger.warn(`Trying to remove key '${key}' from database users data for user without id!`)
        return null
      }

      const del = await knex('users_data').where('name', key).andWhere('user_id', this.id).del()
      return !!del
    } catch (e) {
      throw e
    }
  }

  createRedisKeyName (key) {
    return `user-data:${this.id}:${key}`
  }

  createRedisInternalKeyName (key) {
    return `internal-user-data:${this.id}:${key}`
  }

  async getCacheKey (key) {
    try {
      if (!this.id) {
        logger.warn(`Trying to get key '${key}' from cache users data for user without id!`)
        return undefined
      }

      const data = await redis.getAsync(this.createRedisKeyName(key))
      if (data) return JSON.parse(data).value
      return undefined
    } catch (e) {
      throw e
    }
  }

  async getInternalCacheKey (key) {
    try {
      if (!this.id) {
        logger.warn(`Trying to get internal key '${key}' from cache users data for user without id!`)
        return undefined
      }

      const data = await redis.getAsync(this.createRedisInternalKeyName(key))
      if (data) return JSON.parse(data).value
      return undefined
    } catch (e) {
      throw e
    }
  }

  setCacheKey (key, value, expiration) {
    try {
      if (!this.id) {
        logger.warn(`Trying to set key '${key}' to cache users data for user without id!`)
        return null
      }

      let o = JSON.stringify({
        value
      })
      if (!expiration) redis.set(this.createRedisKeyName(key), o)
      else redis.set(this.createRedisKeyName(key), o, 'EX', expiration)
      return
    } catch (e) {
      throw e
    }
  }

  setInternalCacheKey (key, value, expiration) {
    try {
      if (!this.id) {
        logger.warn(`Trying to set key '${key}' to cache users data for user without id!`)
        return null
      }

      let o = JSON.stringify({
        value
      })
      if (!expiration) redis.set(this.createRedisInternalKeyName(key), o)
      else redis.set(this.createRedisInternalKeyName(key), o, 'EX', expiration)
      return
    } catch (e) {
      throw e
    }
  }

  async removeCacheKey (key) {
    try {
      if (!this.id) {
        logger.warn(`Trying to remove key '${key}' from cache users data for user without id!`)
        return null
      }

      const del = await redis.delAsync(this.createRedisKeyName(key))
      return !!del
    } catch (e) {
      throw e
    }
  }

  async removeInternalCacheKey (key) {
    try {
      if (!this.id) {
        logger.warn(`Trying to remove key '${key}' from cache users data for user without id!`)
        return null
      }

      const del = await redis.delAsync(this.createRedisInternalKeyName(key))
      return !!del
    } catch (e) {
      throw e
    }
  }

  async endNLPSession () {
    try {
      await redis.delAsync(`dialogflow-session-user:${this.id}`)
      return
    } catch (e) {
      throw e
    }
  }
}

module.exports = User
