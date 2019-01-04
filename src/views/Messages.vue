<template>
<div class="custom-messages view-with-navbar">
  <notifier ref="notifier"></notifier>
  <creation-button @click="$refs.creationDialog.openDialog()"></creation-button>
  <custom-dialog ref="creationDialog">
    <div slot="custom-dialog-header">
      <h1>New message</h1>
    </div>
    <div slot="custom-dialog-content">
      <div class="container" style="width: 100%; min-width: 700px;">
        <div class="row">
          <div class="col-xs-12 col-lg-6">
            <label class="label label--centered">Group
              <select class="input select" v-model="plugDialog.data.group_id">
                <option v-for="group in groups" :key="group.id" :value="group.id">{{ group.name }}</option>
              </select>
            </label>
            <label class="label label--centered">API access name
              <input class="input" type="text" v-model="plugDialog.data.name" />
            </label>
          </div>
          <div class="col-xs-12 col-lg-6">
            <label class="label label--centered">Friendly name
              <input class="input" type="text" v-model="plugDialog.data.friendly_name" />
            </label>
            <label class="label label--centered">Description
              <textarea class="textarea textarea--minimal input" rows="1" type="text" v-model="plugDialog.data.description" />
            </label>
          </div>
        </div>
      </div>
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--blue" @click="createPlug">
        CREATE
      </div>
    </div>
  </custom-dialog>

  <tabs @change="tabChange" ref="tabs">
    <div v-for="group in groups" :id="`${group.id}`" :key="group.id">{{ group.name.toUpperCase() }}</div>
  </tabs>

  <table class="custom-messages__table table">
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Actions</th>
    </tr>
    <tr v-for="(plug, i) in plugs" v-show="plug.group_id == activeGroup" :key="plug.id">
      <td>{{ plug.friendly_name }}</td>
      <td>{{ plug.description }}</td>
      <td>
        <font-awesome-icon @click="$refs.messageCreator[i].openDialog()" v-tooltip.top-center="'Opens message editor'" icon="comment-alt" size="lg" class="table__icon" fixed-width />
      </td>
      <message-creator ref="messageCreator" :mType="plug.type" :name="`${plug.friendly_name} (${plug.name})` || plug.name" :id="plug.id" :message="plug.json" :active="messagesDialogs[plug.id]" :langs="langs" @saved="saved($event, plug.id)" @close="messagesDialogs[plug.id] = false; $forceUpdate()"></message-creator>
    </tr>
  </table>
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
      this.$forceUpdate()
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
        this.$refs.tabs.setActiveTab(this.plugDialog.data.group_id.toString())
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('created!', `Message plug has been created. You can edit it now.`, 'success', 6000)
        this.plugDialog.data = {
          group_id: null,
          name: '',
          description: '',
          friendly_name: ''
        }
      } catch (e) {
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot create!', `An error occured during creation request. Error code: ${e.response.status}`, 'error', 10000)
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
      this.$refs.notifier.pushNotification('saved!', 'Message data changes saved.', 'success')
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
      this.$refs.notifier.pushNotification('cannot load!', `An error occured during data load. Error code: ${e.response.status}`, 'error', 10000)
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
