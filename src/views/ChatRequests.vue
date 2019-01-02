<template>
<div class="view-with-navbar">
  <notifier ref="notifier"></notifier>
  <!-- <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="error_snackbar">
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
  </md-dialog> -->

  <custom-dialog ref="unlockDialog">
    <div slot="custom-dialog-header">
      <h1>Finish chat</h1>
    </div>
    <div slot="custom-dialog-content">
      You are about to finish chat and take down chat locks for user <b><i>{{ end.name }}</i></b>. Continue?
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--orange" @click="unlockUser(end.id)">
        UNLOCK
      </div>
    </div>
  </custom-dialog>

  <custom-dialog ref="lockDialog">
    <div slot="custom-dialog-header">
      <h1>Pause bot</h1>
    </div>
    <div slot="custom-dialog-content">
      You are about to lock user <i><b>{{ start.name }}</b></i>. Continue?
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--orange" @click="lockUser(start.id)">
        LOCK
      </div>
    </div>
  </custom-dialog>

  <table class="table chats__table" v-if="requests.length">
    <tr>
      <th>Name</th>
      <th>Locale</th>
      <th>Reason</th>
      <th>Actions</th>
    </tr>
    <tr v-for="user in requests" :key="user.id">
      <td>{{ user.first_name }} {{ user.last_name }}</td>
      <td>{{ user.locale || 'N/A'}}</td>
      <td style="width: 45%;">{{ user.chat_reason || 'N/A'}}</td>
      <td>
        <!-- <md-button v-if="!user.bot_lock" class="md-icon-button" @click="lockDialog = true; end.name = `${user.first_name} ${user.last_name}`; end.id = user.id">
          <md-icon>lock</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="unlockDialog = true; end.name = `${user.first_name} ${user.last_name}`; end.id = user.id">
          <md-icon>clear</md-icon>
        </md-button> -->
        <font-awesome-icon @click="openLockDialog(user)" v-tooltip.top-center="'Pause bot responses for this user to start own conversation.'" v-if="!user.bot_lock" icon="pause" size="lg" class="table__icon" fixed-width/>
        <font-awesome-icon @click="openUnlockDialog(user)" v-tooltip.top-center="'Finish chat request and take down all locks.'" icon="user-times" size="lg" class="table__icon" fixed-width/>

      </td>
    </tr>
  </table>
  <empty-state v-else icon="coffee" title="No chat requests!" text="Relax time! Get some coffee!"></empty-state>
  <!-- <md-empty-state v-show="requests.length === 0" md-icon="done" md-label="Great!" md-description="Nobody is waiting for moderator chat!">
  </md-empty-state> -->
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
      start: {
        name: '',
        id: null
      },
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
      this.$refs.notifier.pushNotification('cannot load!', `There was an error during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  },

  methods: {
    async unlockUser(id) {
      try {
        await axios.post('/api/chat_request', {
          id: id
        })

        this.requests.forEach((req, i) => {
          if (req.id === id) this.requests.splice(i, 1)
        })

        this.$refs.unlockDialog.closeDialog()
        this.$refs.notifier.pushNotification('unlocked!', `Bot is now active for this user.`, 'success', 10000)
      } catch (e) {
        this.$refs.unlockDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot unlock!', `There was an error during request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async lockUser(id) {
      try {
        await axios.post('/api/chat_request_lock', {
          id: id
        })

        this.requests.forEach((req, i) => {
          if (req.id === id) this.requests[i].bot_lock = true
        })

        this.$refs.lockDialog.closeDialog()
        this.$refs.notifier.pushNotification('locked!', `Bot is now locked for this user. Ready to start manual chat!`, 'success', 10000)
      } catch (e) {
        this.$refs.lockDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot lock!', `There was an error during request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    openUnlockDialog(user){
      this.end.id = user.id
      this.end.name = `${user.first_name} ${user.last_name}`
      this.$refs.unlockDialog.openDialog()
    },

    openLockDialog(user){
      this.start.id = user.id
      this.start.name = `${user.first_name} ${user.last_name}`
      this.$refs.lockDialog.openDialog()
    }
  }
}
</script>

<style lang="scss">
.chats{
  &__table{
    width: 90%;
    margin: 0 auto;
  }
}
</style>
