<template>
<div class="emissions view-with-navbar">
  <notifier ref="notifier"></notifier>
  <creation-button @click="$refs.creationDialog.openDialog()"></creation-button>
  <custom-dialog ref="removeDialog">
    <div slot="custom-dialog-header">
      <h1>Delete broadcast</h1>
    </div>
    <div slot="custom-dialog-content">
      You are about removing all data of this broadcast. Continue?
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--orange" @click="removeBroadcast(removeDialog.broadcastId)">
        DELETE
      </div>
    </div>
  </custom-dialog>

  <custom-dialog ref="warningDialog">
    <div slot="custom-dialog-header">
      <h1>Warning!</h1>
    </div>
    <div slot="custom-dialog-content">
      You are about broadcast message <b><i>{{ warnDialog.message_name }}</i></b> to channel <b><i>{{ warnDialog.label_name }}</i></b> without schedule date. Message will broadcast instantly! Continue?
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--orange" @click="pushBroadcast(warnDialog.broadcastId)">
        BROADCAST NOW
      </div>
    </div>
  </custom-dialog>

  <custom-dialog ref="creationDialog">
    <div slot="custom-dialog-header">
      <h1>Create broadcast</h1>
    </div>
    <div slot="custom-dialog-content">
      <div class="container" style="width: 100%; min-width: 300px;">
        <div class="row">
          <div class="col-xs-12">
            <label class="label label--centered">Message
              <select class="input select" v-model="broadcast.message_id">
                <option v-for="message in messages" :key="message.id" :value="message.id">{{ message.friendly_name }}</option>
              </select>
            </label>

            <label class="label label--centered">Channel
              <select class="input select" v-model="broadcast.label_id">
                <option v-for="label in labels" :key="label.id" :value="label.id">{{ label.friendly_name }}</option>
              </select>
            </label>

            <label class="label label--centered">Notification type
              <select class="input select" v-model="broadcast.notification_type">
                <option value="REGULAR">Sound / Vibration</option>
                <option value="SILENT_PUSH">On screen notification only</option>
                <option value="NO_PUSH">No notification</option>
              </select>
            </label>

            <checkbox v-model="broadcast.schedule" :val="broadcast.schedule">Schedule</checkbox>

            <div v-show="broadcast.schedule">
              <div class="emissions__datetime-input">
                <label class="label label--centered emissions__date">Date
                  <input type="date" class="input" v-model="broadcast.scheduleData.date">
                </label>
                <label class="label label--centered emissions__time">Time
                  <input type="time" class="input" v-model="broadcast.scheduleData.time">
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--blue" @click="create">
        CREATE
      </div>
    </div>
  </custom-dialog>

  <table class="emissions__table table">
    <tr>
      <th>ID</th>
      <th>Message</th>
      <th>Label</th>
      <th>Scheduled on</th>
      <th>Status</th>
      <th>Range</th>
      <th>Actions</th>
    </tr>
    <tr v-for="broadcast in broadcasts" :key="broadcast.id">
      <td>{{ broadcast.broadcast_id || '---' }}</td>
      <td>{{ broadcast.message_name }}</td>
      <td>{{ broadcast.label_name }}</td>
      <td>{{ makeDate(broadcast.schedule_time) || 'Instant broadcast'}}</td>
      <td>{{ broadcast.status }}</td>
      <td>{{ broadcast.range || '---'}}</td>
      <td>
        <font-awesome-icon v-if="broadcast.status === 'CREATED_MESSAGE'" @click="openBroadcastDialog(broadcast)" v-tooltip.top-center="'Start this broadcast'" icon="bullhorn" size="lg" class="table__icon" fixed-width />
        <font-awesome-icon v-if="broadcast.status === 'IN_PROGRESS' || broadcast.status === 'CANCELED' || broadcast.status === 'FINISHED' || broadcast.status === 'SCHEDULED'" @click="getBroadcastStatus(broadcast.id)" v-tooltip.top-center="'Get broadcast status from Facebook server.'"
          icon="sync-alt" size="lg" class="table__icon" fixed-width />
        <font-awesome-icon v-if="broadcast.status === 'CREATED_MESSAGE' || broadcast.status === 'CANCELED'" @click="removeBroadcastDialog(broadcast.id)" v-tooltip.top-center="'Remove this broadcast from panel.'" icon="trash-alt" size="lg" class="table__icon"
          fixed-width />
        <font-awesome-icon v-if="broadcast.status === 'SCHEDULED'" @click="cancel(broadcast.id)" v-tooltip.top-center="'Cancel this broadcast.'" icon="times" size="lg" class="table__icon" fixed-width />
      </td>
    </tr>
  </table>
</div>
</template>

<script>
import axios from 'axios'
import {EventBus} from '../event-bus'

export default {
  data() {
    return {
      loadError: false,
      error: false,
      success: false,
      creationDialog: {
        show: false
      },
      warnDialog: {
        show: false,
        broadcastId: null,
        message_name: '',
        label_name: ''
      },
      removeDialog: {
        show: false,
        broadcastId: null
      },
      labels: [],
      messages: [],
      broadcasts: [],
      broadcast: {
        label_id: null,
        message_id: null,
        schedule: false,
        notification_type: 'REGULAR',
        scheduleData: {
          date: null,
          time: null
        }
      }
    }
  },

  methods: {
    async create() {
      try {
        const data = await axios.put('/api/broadcast', this.broadcast)
        this.broadcasts.unshift(data.data)
        this.success = true
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('created!', 'Message broadcast has been created.', 'success', 5000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot create!', `An error occured during create request. Error code: ${e.response.status}`, 'error')
      }
    },

    makeDate(t) {
      if (!t) return null

      const date = new Date(t).toLocaleDateString('pl-PL')
      const hour = new Date(t).toLocaleTimeString('pl-PL')
      return `${date} - ${hour}`
    },

    openBroadcastDialog(broadcast) {
      if (broadcast.schedule_time) return this.pushBroadcast(broadcast.id)
      else {
        this.warnDialog.broadcastId = broadcast.id
        this.warnDialog.message_name = broadcast.message_name
        this.warnDialog.label_name = broadcast.label_name
        this.$refs.warningDialog.openDialog()
      }
    },

    async pushBroadcast(id) {
      try {
        const pushed = await axios.post('/api/broadcast', {
          id: id
        })
        this.warnDialog.show = false
        this.broadcasts.map(b => {
          if (b.id === pushed.data.db_id) {
            b.status = pushed.data.status
            b.broadcast_id = pushed.data.id
          }
        })
        this.$refs.notifier.pushNotification('pushed', 'Broadcast hass been successfully pushed to Facebook server.', 'success', 5000)
        this.$refs.warningDialog.closeDialog()
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot push!', `An error occured on broadcast push request. Error code: ${e.response.status}`, 'error')
        this.$refs.warningDialog.closeDialog()
      }
    },

    async getBroadcastStatus(id) {
      try {
        const data = await axios.get(`/api/broadcast-status?id=${id}`)

        this.broadcasts.map(b => {
          if (b.broadcast_id === data.data.id) {
            b.status = data.data.status
            b.range = data.data.range
          }
        })
        this.$refs.notifier.pushNotification('refreshed!', 'Broadcast status refreshed.', 'success')
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot refresh!', `An error occured on refresh request. Error code: ${e.response.status}`, 'error')
      }
    },

    async cancel(id) {
      try {
        const data = await axios.post(`/api/broadcast-cancel`, {
          id
        })

        this.broadcasts.map(b => {
          if (b.broadcast_id === data.data.id) {
            b.status = data.data.status
          }
        })
        this.success = true
      } catch (e) {
        this.error = true
      }
    },

    async removeBroadcast(id) {
      try {
        await axios.delete('/api/remove-broadcast', {
          data: {
            id
          }
        })

        this.broadcasts.map((b, i) => {
          if (b.id === id) {
            this.broadcasts.splice(i, 1)
          }
        })

        this.$refs.removeDialog.closeDialog()
        this.removeDialog.show = false
        this.$refs.notifier.pushNotification('deleted!', `Broadcast data has been removed from database.`, 'success', 5000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot delete!', `An error occured during create request. Error code: ${e.response.status}.`, 'error')
        this.$refs.removeDialog.closeDialog()
      }
    },

    removeBroadcastDialog(id) {
      this.removeDialog.broadcastId = id
      this.$refs.removeDialog.openDialog()
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

      const labels = await axios.get('/api/labels')
      const messages = await axios.get('/api/messages?id=2')
      const broadcasts = await axios.get('/api/broadcasts')
      this.labels = labels.data
      this.messages = messages.data
      this.broadcasts = broadcasts.data
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `An error occured during data loading. Error code: ${e.response.status}.`, 'error')
    }
  },
  mounted(){
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },
  destroyed(){
    EventBus.$off('token_refresh')
  }
}
</script>

<style lang="scss">
.emissions {
    &__table {
        width: 90%;
        margin: 0 auto;
    }

    &__datetime-input {
        width: 90%;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
    }

    &__date {
        width: 60%;
    }

    &__time {
        width: 30%;
    }
}
</style>
