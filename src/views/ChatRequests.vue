<template>
<div>
  <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="error_snackbar">
    <span>Error, please try again or contact an administrator.</span>
    <md-button class="md-primary" @click="error_snackbar = false">close</md-button>
  </md-snackbar>

  <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="lockedDialog">
    <span>Bot has been paused for user</span>
    <md-button class="md-primary" @click="lockedDialog = false">close</md-button>
  </md-snackbar>

  <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="successDialog">
    <span>Chat request closed.</span>
    <md-button class="md-primary" @click="successDialog = false">close</md-button>
  </md-snackbar>
  <md-dialog :md-active.sync="unlockDialog">
    <md-dialog-title>End moderator chat</md-dialog-title>
    <md-dialog-content>
      Are you sure you want to end moderator chat for {{ end.name }}?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="unlockDialog = false">Close</md-button>
      <md-button class="md-primary" @click="unlockUser(end.id)">Unlock</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="lockDialog">
    <md-dialog-title>Pause bot</md-dialog-title>
    <md-dialog-content>
      Are you sure you want to pause bot for {{ end.name }}?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="lockDialog = false">Close</md-button>
      <md-button class="md-primary" @click="lockUser(end.id)">Pause</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-table>
    <md-table-row>
      <md-table-head>Name</md-table-head>
      <md-table-head>Locale</md-table-head>
      <md-table-head>Reason</md-table-head>
      <md-table-head>Actions</md-table-head>
    </md-table-row>
    <md-table-row v-for="user in requests" :key="user.id">
      <md-table-cell>{{ user.first_name }} {{ user.last_name }}</md-table-cell>
      <md-table-cell>{{ user.locale }}</md-table-cell>
      <md-table-cell style="width: 45%;">{{ user.chat_reason }}</md-table-cell>
      <md-table-cell>
        <md-button v-if="!user.bot_lock" class="md-icon-button" @click="lockDialog = true; end.name = `${user.first_name} ${user.last_name}`; end.id = user.id">
          <md-icon>lock</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="unlockDialog = true; end.name = `${user.first_name} ${user.last_name}`; end.id = user.id">
          <md-icon>clear</md-icon>
        </md-button>
      </md-table-cell>
    </md-table-row>
  </md-table>
  <md-empty-state v-show="requests.length === 0" md-icon="done" md-label="Great!" md-description="Nobody is waiting for moderator chat!">
  </md-empty-state>
</div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      requests: [],
      unlockDialog: false,
      lockedDialog: false,
      lockDialog: false,
      error_snackbar: false,
      successDialog: false,
      end: {
        name: '',
        id: null
      }
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      let users = await axios.get('/api/chat_requests')
      this.requests = users.data
    } catch (e) {
      console.error(e)
    }
  },

  methods: {
    async unlockUser(id) {
      try {
        await axios.post('/api/chat_request', {
          id: id
        })

        this.successDialog = true
        this.requests.forEach((req, i) => {
          if (req.id === id) this.requests.splice(i, 1)
        })

        this.unlockDialog = false
      } catch (e) {
        console.error(e)
        this.error_snackbar = true
      }
    },

    async lockUser(id) {
      try {
        await axios.post('/api/chat_request_lock', {
          id: id
        })

        this.lockedDialog = true
        this.requests.forEach((req, i) => {
          if (req.id === id) this.requests[i].bot_lock = true
        })

        this.lockDialog = false
      } catch (e) {
        console.error(e)
        this.error_snackbar = true
      }
    }
  }
}
</script>

<style lang="scss">
</style>
