<template>
  <div class="view-with-navbar clicks">
    <notifier ref="notifier"></notifier>

    <custom-dialog ref="urlEditDialog">
      <div slot="custom-dialog-header">
        <h1>Edit URL</h1>
      </div>
      <div slot="custom-dialog-content">
        <label class="label label--centered" for="login">
          Name
          <input
            class="input"
            type="text"
            name="friendly_name"
            v-model="editUrlEntry.friendly_name"
          >
        </label>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--orange" @click="saveURLChanges">SAVE</div>
      </div>
    </custom-dialog>

    <custom-dialog ref="urlRestartDialog">
      <div slot="custom-dialog-header">
        <h1>Remove URL counter</h1>
      </div>
      <div slot="custom-dialog-content">
        <div style="max-width: 800px;">
          You are about removing counted clicks for URL
          <b>
            <i>{{ restartUrlEntry.url }}</i>
          </b>. This can't be undone, continue?
          <br>Remember, counter will appear here again when monitored request will be performed.
        </div>
        <checkbox
          v-model="restartUrlEntry.leaveCache"
          :val="restartUrlEntry.leaveCache"
          class="clicks__dialog-checkbox"
        >Don't remove cached entries</checkbox>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--orange" @click="resetUrlCounter">DELETE</div>
      </div>
    </custom-dialog>

    <tabs @change="tabChange" ref="tabs">
      <div id="1">CHATBOT BUTTONS</div>
      <div id="2">WEB LINKS</div>
    </tabs>
    <div class="clicks__wrapper" v-show="activeTab === '1'"></div>
    <div class="clicks__wrapper" v-show="activeTab === '2'">
      <empty-state
        v-show="!webEntries.length"
        icon="unlink"
        title="No counters saved in database"
        text="Data is refreshed every 2 hours"
      ></empty-state>
      <table class="table admins__table">
        <tr class="table__row">
          <th class="table__head">Name</th>
          <th class="table__head">URL</th>
          <th class="table__head">Entries</th>
          <th class="table__head">Actions</th>
        </tr>
        <tr class="table__row" v-for="entry in webEntries" :key="entry.id">
          <td class="table__cell">{{ entry.friendly_name || '-' }}</td>
          <td class="table__cell">{{ entry.url }}</td>
          <td class="table__cell">{{ entry.entries }}</td>
          <td class="table__cell">
            <font-awesome-icon
              @click="openURLEditDialog(entry)"
              v-tooltip.top-center="'Edit data'"
              icon="cog"
              size="lg"
              class="table__icon"
            />
            <font-awesome-icon
              @click="openURLRestartDialog(entry)"
              v-tooltip.top-center="'Delete counter'"
              icon="trash-alt"
              size="lg"
              class="table__icon"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {
  EventBus
} from '../event-bus'

export default {
  data () {
    return {
      activeTab: '1',
      webEntries: [],
      editUrlEntry: {},
      restartUrlEntry: {}
    }
  },

  async created () {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const urlClicks = await axios.get('/api/stats/url_clicks')
      this.webEntries = urlClicks.data
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `There was an error during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  },

  methods: {
    tabChange (e) {
      this.activeTab = e
      this.$forceUpdate()
    },

    openURLEditDialog (entry) {
      this.editUrlEntry = entry
      this.$refs.urlEditDialog.openDialog()
    },

    openURLRestartDialog (entry) {
      this.restartUrlEntry = entry
      this.restartUrlEntry.leaveCache = false
      this.$refs.urlRestartDialog.openDialog()
    },

    async saveURLChanges () {
      try {
        await axios.post('/api/stats/url_entry', this.editUrlEntry)
        this.$refs.urlEditDialog.closeDialog()
        this.$refs.notifier.pushNotification('saved!', `URL data has been saved.`, 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot save!', `There was an error during data save. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async resetUrlCounter () {
      try {
        await axios.delete('/api/stats/url_entry', { data: this.restartUrlEntry })
        let i = 0
        for (let entry of this.webEntries) {
          console.log(entry)
          if (entry.id === this.restartUrlEntry.id) {
            this.webEntries.splice(i, 1)
            break
          }
          i++
        }
        this.$refs.urlRestartDialog.closeDialog()
        this.$refs.notifier.pushNotification('cleared!', `URL counter has been cleared.`, 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot reset!', `There was an error during counter resetting. Error code: ${e.response.status}`, 'error', 10000)
      }
    }
  },
  mounted () {
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },
  destroyed () {
    EventBus.$off('token_refresh')
  }
}
</script>

<style lang="scss">
.clicks {
  &__dialog-checkbox {
    margin-left: 0 !important;
    margin-top: 8px !important;
  }
}
</style>
