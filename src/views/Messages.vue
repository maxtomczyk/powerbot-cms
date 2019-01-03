<template>
<div class="custom-messages view-with-navbar">
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

  <md-dialog :md-active.sync="removeDialog.show">
    <md-dialog-title>Delete message</md-dialog-title>
    <md-dialog-content>
      You are about to delete <b>{{ removeDialog.name }}</b> message. Continue?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="removeDialog.show = false">No</md-button>
      <md-button class="md-primary" @click="removeMessage(removeDialog.id)">Yes</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="plugDialog.show" style="min-width: 500px; min-height: 520px;">
    <md-dialog-title>Create new message</md-dialog-title>
    <md-dialog-content>
      <md-field>
        <label>Group</label>
        <md-select v-model="plugDialog.data.group_id">
          <md-option v-for="group in groups" :key="group.id" :value="group.id">{{ group.name }}</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label>API access name</label>
        <md-input v-model="plugDialog.data.name"></md-input>
      </md-field>
      <md-field>
        <label>Friendly name</label>
        <md-input v-model="plugDialog.data.friendly_name"></md-input>
      </md-field>
      <md-field>
        <label>Description</label>
        <md-textarea v-model="plugDialog.data.description"></md-textarea>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="plugDialog.show = false">Close</md-button>
      <md-button class="md-primary" @click="createPlug">Create</md-button>
    </md-dialog-actions>
  </md-dialog>

  <!-- <md-tabs :md-active-tab="activeGroup" @md-changed="tabChange">
    <md-tab v-for="group in groups" :id="`${group.id}`" :md-label="group.name" :key="group.id">
    </md-tab>
  </md-tabs> -->

  <tabs @change="tabChange" ref="tabs">
    <div v-for="group in groups" :id="`${group.id}`" :key="group.id">{{ group.name.toUpperCase() }}</div>
  </tabs>

  <table class="custom-messages__table table">
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Actions</th>
    </tr>
    <tr v-for="plug in plugs" v-show="plug.group_id == activeGroup" :key="plug.id">
      <td>{{ plug.friendly_name }}</td>
      <td>{{ plug.description }}</td>
      <td>
        <md-button class="md-icon-button" @click="messagesDialogs[plug.id] = true; $forceUpdate()">
          <md-icon>chat</md-icon>
        </md-button>
      </td>
      <message-creator ref="messageCreator" :mType="plug.type" :name="`${plug.friendly_name} (${plug.name})` || plug.name" :id="plug.id" :message="plug.json" :active="messagesDialogs[plug.id]" :langs="langs" @saved="saved($event, plug.id)" @close="messagesDialogs[plug.id] = false; $forceUpdate()"></message-creator>
    </tr>
  </table>

  <!-- <md-speed-dial class="md-bottom-right">
    <md-speed-dial-target @click="plugDialog.data.group_id = parseInt(activeGroup); plugDialog.show = true">
      <md-icon>add</md-icon>
    </md-speed-dial-target>
  </md-speed-dial> -->

  <creation-button></creation-button>

</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loadError: false,
      success: false,
      message: {},
      langs: [],
      removeDialog: {
        name: '',
        show: false,
        id: null
      },
      plugDialog: {
        show: false,
        data: {
          name: '',
          description: '',
          group_id: null,
          friendly_name: ''
        }
      },
      messagesDialogs: {},
      error: false,
      activeGroup: '1',
      createDialog: false,
      groups: [],
      plugs: []
    }
  },

  methods: {
    tabChange(e) {
      this.activeGroup = e
      console.log(e);
    },

    showRemoveDialog(message) {
      this.removeDialog.name = message.friendly_name
      this.removeDialog.id = message.id
      this.removeDialog.show = true
    },

    async createPlug() {
      try {
        const created = await axios.put('/api/messages/plug', this.plugDialog.data)
        this.plugs.push(created.data)
        this.plugDialog.show = false
        this.success = true
        this.plugDialog.data = {
          group_id: null,
          name: '',
          description: '',
          friendly_name: ''
        }
      } catch (e) {
        this.error = true
      }
    },

    saved(updated, plugId) {
      this.messagesDialogs[plugId] = false
      this.plugs.map(plug => {
        if (plug.id === plugId) {
          plug.json = updated.json
          for (let lang in plug.json) {
            if (plug.json[lang].buttons) {
              plug.json[lang].buttons.map(btn => {
                if (btn.url) {
                  btn.payload = btn.url
                }
              })
            }
            if (!plug.json[lang].buttons) plug.json[lang].buttons = []
            if (!plug.json[lang].quick_replies) plug.json[lang].quick_replies = []
          }
        }
      })
      this.$forceUpdate()
      this.$refs.messageCreator[0].setProps()
      this.success = true
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const plugs = await axios.get('/api/messages/plugs')
      const groups = await axios.get('/api/messages/groups')
      const langs = await axios.get('/api/languages')

      this.langs = langs.data
      this.plugs = plugs.data
      this.groups = groups.data
      this.plugs.map(plug => {
        this.messagesDialogs[plug.id] = false
        for (let lang in plug.json) {
          let msg = plug.json[lang]
          if (msg.buttons) {
            msg.buttons.map(btn => {
              if (!btn.payload) btn.payload = btn.url
              delete btn.url
            })
          }
        }
      })
    } catch (e) {
      this.loadError = true
      console.error(e)
    }
  }
}
</script>

<style lang="scss">
.custom-messages {
    &__table {
        width: 90%;
        margin: 0 auto;
    }
}
</style>
