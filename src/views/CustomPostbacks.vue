<template>
<div class="custom-templates view-with-navbar">
  <notifier ref="notifier"></notifier>
  <creation-button @click="$refs.creationDialog.openDialog()"></creation-button>

  <custom-dialog ref="creationDialog">
    <div slot="custom-dialog-header">
      <h1>Create reaction</h1>
    </div>
    <div slot="custom-dialog-content">
      <div class="container" style="width: 100%; min-width: 300px;">
        <div class="row">
          <div class="col-xs-12">
            <label class="label label--centered">Name
              <input class="input" type="text" v-model="postback.friendly_name" />
            </label>
            <label class="label label--centered">Postback
              <input class="input" type="text" v-model="postback.postback" />
            </label>
            <label class="label label--centered">Message
              <select class="input select" v-model="postback.message_id">
                <option v-for="message in messages" :key="message.id" :value="message.id">{{ message.friendly_name }}</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--blue" @click="createPostback">
        CREATE
      </div>
    </div>
  </custom-dialog>

  <custom-dialog ref="deleteDialog">
    <div slot="custom-dialog-header">
      <h1>Remove reaction</h1>
    </div>
    <div slot="custom-dialog-content">
      You are about to remove bot reaction named <i><b>{{ removeDialog.name }}</b></i> which is connected with <i><b>{{ removeDialog.message_name }}</b></i>. Continue?
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--orange" @click="removePostback()">
        DELETE
      </div>
    </div>
  </custom-dialog>

  <table v-if="postbacks.length" class="custom-postbacks__table table">
    <tr>
      <th>Name</th>
      <th>Postback</th>
      <th>Message name</th>
      <th>Actions</th>
    </tr>
    <tr v-for="postback in postbacks" :key="postback.id">
      <td>{{ postback.friendly_name }}</td>
      <td>{{ postback.postback }}</td>
      <td>{{ postback.message_name }}</td>
      <td>
        <font-awesome-icon @click="openDeleteDialog(postback)" v-tooltip.top-center="'Remove bot reaction on this postback'" icon="trash-alt" size="lg" class="table__icon" fixed-width />
      </td>
    </tr>
  </table>

  <empty-state v-else icon="clipboard-list" title="Responses for custom payloads list is empty..." text="Create reactions to your own buttons here!"></empty-state>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      creationDialog: {
        show: false
      },
      removeDialog: {
        id: null,
        name: '',
        postback: '',
        message_name: '',
        show: false
      },
      postback: {

      },
      postbacks: [],
      messages: [],
      success: false,
      error: false,
      loadError: false
    }
  },

  methods: {
    async createPostback() {
      try {
        const created = await axios.put('/api/postbacks', this.postback)
        this.postbacks.push(created.data)
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('created!', `Postback reaction has been created.`, 'success', 6000)
      } catch (e) {
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot remove!', `An error occured during delete request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async removePostback() {
      try {
        await axios.delete('/api/postbacks', {
          data: {
            id: this.removeDialog.id
          }
        })

        this.postbacks.map((p, i) => {
          if (p.id === this.removeDialog.id) this.postbacks.splice(i, 1)
        })

        this.$refs.deleteDialog.closeDialog()
        this.$refs.notifier.pushNotification('deleted!', `Selected postback reaction has been deleted.`, 'success', 6000)
      } catch (e) {
        this.$refs.deleteDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot remove!', `An error occured during delete request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    openDeleteDialog(postback){
      this.removeDialog.id = postback.id
      this.removeDialog.name = postback.friendly_name
      this.removeDialog.postback = postback.postback
      this.removeDialog.message_name = postback.message_name
      this.removeDialog.show = true
      this.$refs.deleteDialog.openDialog()
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const postbacks = await axios.get('/api/postbacks')
      const messages = await axios.get('/api/messages?id=4')
      this.messages = messages.data
      this.postbacks = postbacks.data
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `An error occured during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  }
}
</script>

<style lang="scss">
.custom-postbacks{
  &__table{
    width: 90%;
    margin: 0 auto;
  }
}
</style>
