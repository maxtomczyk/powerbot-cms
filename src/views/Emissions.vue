<template>
<div class="emissions view-with-navbar">
  <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="loadError">
    <span>Error occured during data load. Please refresh site or contact an administrator.</span>
    <md-button class="md-primary" @click="loadError = false">close</md-button>
  </md-snackbar>

  <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="success">
    <span>Request success!</span>
    <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
  </md-snackbar>

  <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="error">
    <span>Request ended with error!</span>
    <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
  </md-snackbar>

  <md-dialog :md-active.sync="creationDialog.show">
    <md-dialog-title>Create emission</md-dialog-title>
    <md-dialog-content>
      <md-field>
        <label>Channel</label>
        <md-select v-model="broadcast.label_id">
          <md-option v-for="label in labels" :key="label.id" :value="label.id">{{ label.friendly_name }}</md-option>
        </md-select>
      </md-field>

      <md-field>
        <label>Message</label>
        <md-select v-model="broadcast.message_id">
          <md-option v-for="message in messages" :key="message.id" :value="message.id">{{ message.friendly_name }}</md-option>
        </md-select>
      </md-field>

      <md-field>
        <label>Notification type</label>
        <md-select v-model="broadcast.notification_type">
          <md-option value="REGULAR">Sound / Vibration</md-option>
          <md-option value="SILENT_PUSH">On screen notification only</md-option>
          <md-option value="NO_PUSH">No notification</md-option>
        </md-select>
      </md-field>

      <md-checkbox v-model="broadcast.schedule" class="md-primary">Schedule</md-checkbox>

      <div class="emissions__time" v-show="broadcast.schedule">
        <input type="date" v-model="broadcast.scheduleData.date">
        <input type="time" v-model="broadcast.scheduleData.time">
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="creationDialog.show = false">Cancel</md-button>
      <md-button class="md-primary" @click="create()">Create</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="warnDialog.show">
    <md-dialog-title>Warning!</md-dialog-title>
    <md-dialog-content>
      You are about pushing to Faceebook broadcast without schedule date. Message will broadcast instantly! Continue?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="pushBroadcast(warnDialog.broadcastId)">Broadcast now</md-button>
      <md-button class="md-primary" @click="warnDialog.show = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="removeDialog.show">
    <md-dialog-title>Warning!</md-dialog-title>
    <md-dialog-content>
      You are about removing all data of this broadcast. Continue?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="removeBroadcast(removeDialog.broadcastId)">Delete</md-button>
      <md-button class="md-primary" @click="removeDialog.show = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>

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
      <td>{{ broadcast.broadcast_id }}</td>
      <td>{{ broadcast.message_name }}</td>
      <td>{{ broadcast.label_name }}</td>
      <td>{{ makeDate(broadcast.schedule_time) || 'Instant broadcast'}}</td>
      <td>{{ broadcast.status }}</td>
      <td>{{ broadcast.range || '---'}}</td>
      <td>
        <!-- <md-button class="md-icon-button" @click="openBroadcastDialog(broadcast)" v-if="broadcast.status === 'CREATED_MESSAGE'">
          <md-icon>send</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="getBroadcastStatus(broadcast.id)" v-if="broadcast.status === 'IN_PROGRESS' || broadcast.status === 'CANCELED' || broadcast.status === 'FINISHED' || broadcast.status === 'SCHEDULED'">
          <md-icon>refresh</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="removeBroadcastDialog(broadcast.id)" v-if="broadcast.status === 'CREATED_MESSAGE' || broadcast.status === 'CANCELED'">
          <md-icon>clear</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="cancel(broadcast.id)" v-if="broadcast.status === 'SCHEDULED'">
          <md-icon>cancel</md-icon>
        </md-button> -->
        <font-awesome-icon v-if="broadcast.status === 'CREATED_MESSAGE'" @click="openBroadcastDialog(broadcast)" v-tooltip.top-center="'Start this broadcast'" icon="bullhorn" size="lg" class="table__icon" fixed-width />
        <font-awesome-icon v-if="broadcast.status === 'IN_PROGRESS' || broadcast.status === 'CANCELED' || broadcast.status === 'FINISHED' || broadcast.status === 'SCHEDULED'" @click="getBroadcastStatus(broadcast.id)" v-tooltip.top-center="'Get broadcast status from Facebook server.'"
          icon="sync-alt" size="lg" class="table__icon" fixed-width />
        <font-awesome-icon v-if="broadcast.status === 'CREATED_MESSAGE' || broadcast.status === 'CANCELED'" @click="removeBroadcastDialog(broadcast.id)" v-tooltip.top-center="'Remove this broadcast from panel.'" icon="trash-alt" size="lg" class="table__icon"
          fixed-width />
        <font-awesome-icon v-if="broadcast.status === 'SCHEDULED'" @click="cancel(broadcast.id)" v-tooltip.top-center="'Cancel this broadcast.'" icon="times" size="lg" class="table__icon" fixed-width />
      </td>
    </tr>
  </table>

  <!-- <md-speed-dial class="md-bottom-right">
    <md-speed-dial-target @click="creationDialog.show = true">
      <md-icon>add</md-icon>
    </md-speed-dial-target>
  </md-speed-dial> -->

  <creation-button @click="$refs.creationDialog.openDialog()"></creation-button>
</div>
</template>

<script>
import axios from 'axios'

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
        broadcastId: null
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
        this.creationDialog.show = false
      } catch (e) {
        this.error = true
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
        this.warnDialog.show = true
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
        this.success = true
      } catch (e) {
        this.error = true
        this.warnDialog.show = false
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
        this.success = true
      } catch (e) {
        this.error = true
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

        this.removeDialog.show = false
        this.success = true
      } catch (e) {
        this.error = true
      }
    },

    removeBroadcastDialog(id) {
      this.removeDialog.broadcastId = id
      this.removeDialog.show = true
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
      this.loadError = true
    }
  }
}
</script>

<style lang="scss">
.md-select-menu {
    z-index: 9999;
}

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
