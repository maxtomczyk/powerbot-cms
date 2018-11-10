const Incredbot = require('incredbot')
const config = require('../../../config/config.js')
const knex = require('../../knex.js')
const BotText = require('../../models/BotText.js')
const logger = require('../../logger.js')
const incredbot = require('../../incredbot.js')
const messages = require('../../messages.js')

const texts = new BotText()

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

      return knex.transaction(trx => {
        return incredbot.broadcast.labelToUser(labelId, this.messenger_id)
          .then(async data => {
            try {
              if (data.success) {
                const duplicate = await knex('users_channels').where('user_id', this.id).andWhere('channel_id', channelId).first()
                if (!duplicate) {
                  const o = {
                    user_id: this.id,
                    channel_id: channelId
                  }
                  await knex('users_channels').insert(o)
                }
              } else {
                throw new Error('Adding user to label failed. Returned status other than success.')
              }
            } catch (e) {
              throw e
            }
          }).catch(e => {
            throw e
          })
      })
    } catch (e) {
      throw e
    }
  }

  async removeFromChannel (name) {
    try {
      const row = await knex('channels').where('name', name).first()
      const labelId = row.label_id
      const channelId = row.id

      return knex.transaction(trx => {
        return incredbot.broadcast.removeLabelFromUser(labelId, this.messenger_id)
          .then(async data => {
            try {
              if (data.success) {
                await knex('users_channels').where('channel_id', channelId).andWhere('user_id', this.id).del()
              } else {
                throw new Error('Adding user to label failed. Returned status other than success.')
              }
            } catch (e) {
              throw e
            }
          }).catch(e => {
            throw e
          })
      })
    } catch (e) {
      throw e
    }
  }

  async loadOrCreate () {
    try {
      let record = await knex('users').where('messenger_id', this.messenger_id).first()

      if (record) {
        Object.assign(this, record)
        return this
      } else {
        let data = await incredbot.User(this.messenger_id).getData('first_name', 'last_name', 'id')
        let defaultChannels = await this.getDefaultChannels()

        let user = {
          first_name: data.first_name,
          last_name: data.last_name,
          locale: data.locale,
          gender: data.gender,
          messenger_id: data.id
        }

        let createdUser = null

        await knex.transaction((trx) => {
          return trx('users').insert(user).returning('*')
            .then((created) => {
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
        this.data = createdUser
        Object.assign(this, createdUser)
        return this
      }
    } catch (e) {
      throw e
    }
  }

  async enableModeratorChat () {
    try {
      let [updated] = await knex('users').update({
        moderator_chat: true,
        waiting_for_reason: true
      }).where('messenger_id', this.messenger_id).returning('*')
    } catch (e) {
      throw e
    }
  }

  async disableModeratorChat () {
    try {
      let [updated] = await knex('users').update({
        moderator_chat: false,
        bot_lock: false,
        chat_reason: '',
        waiting_for_reason: false
      }).where('messenger_id', this.messenger_id).returning('*')
      if (updated) {
        await incredbot.send.raw(await messages.get('contact_ended', updated))
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
      await knex('users').where('messenger_id', this.messenger_id).del()
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
}

module.exports = User
