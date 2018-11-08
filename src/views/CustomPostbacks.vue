<template>
<div class="custom-templates">
  <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="success">
    <span>Request success!</span>
    <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
  </md-snackbar>

  <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="error">
    <span>Request ended with error!</span>
    <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
  </md-snackbar>

  <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="loadError">
    <span>Error occured during data load. Please refresh site or contact an administrator.</span>
    <md-button class="md-primary" @click="loadError = false">close</md-button>
  </md-snackbar>

  <md-dialog :md-active.sync="creationDialog.show">
    <md-dialog-title>Create custom reaction</md-dialog-title>
    <md-dialog-content>
      <md-field>
        <label>Friendly name</label>
        <md-input v-model="postback.friendly_name"></md-input>
      </md-field>
      <md-field>
        <label>Postback</label>
        <md-input v-model="postback.postback"></md-input>
      </md-field>
      <md-field>
        <label>Reaction message</label>
        <md-select v-model="postback.message_id" name="movie" id="movie">
          <md-option v-for="message in messages" :key="message.id" :value="message.id">{{ message.friendly_name }}</md-option>
        </md-select>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="creationDialog.show = false">Cancel</md-button>
      <md-button class="md-primary" @click="createPostback()">Create</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="removeDialog.show">
    <md-dialog-title>Deleting custom reaction</md-dialog-title>
    <md-dialog-content>
      You are removing reaction <b>{{ removeDialog.name }}</b> reacting on <b>{{ removeDialog.postback }}</b> payload with message <b>{{ removeDialog.message_name }}</b>. Continue?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="removeDialog.show = false">Cancel</md-button>
      <md-button class="md-primary" @click="removePostback()">Remove</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-table class="custom-postbacks__table">
    <md-table-row>
      <md-table-head>Name</md-table-head>
      <md-table-head>Postback</md-table-head>
      <md-table-head>Message name</md-table-head>
      <md-table-head>Actions</md-table-head>
    </md-table-row>
    <md-table-row v-for="postback in postbacks" :key="postback.id">
      <md-table-cell>{{ postback.friendly_name }}</md-table-cell>
      <md-table-cell>{{ postback.postback }}</md-table-cell>
      <md-table-cell>{{ postback.message_name }}</md-table-cell>
      <md-table-cell>
        <md-button class="md-icon-button" @click="showRemoveDialog(postback)">
          <md-icon>delete</md-icon>
        </md-button>
      </md-table-cell>
    </md-table-row>
  </md-table>

  <md-speed-dial class="md-bottom-right">
    <md-speed-dial-target @click="creationDialog.show = true">
      <md-icon>add</md-icon>
    </md-speed-dial-target>
  </md-speed-dial>
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
        this.creationDialog.show = false
        this.success = true
        this.postbacks.push(created.data)
      } catch (e) {
        this.error = true
        console.error(e)
      }
    },

    showRemoveDialog(postback) {
      this.removeDialog.id = postback.id
      this.removeDialog.name = postback.friendly_name
      this.removeDialog.postback = postback.postback
      this.removeDialog.message_name = postback.message_name
      this.removeDialog.show = true
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

        this.success = true
        this.removeDialog.show = false
      } catch (e) {
        console.error(e)
        this.error = true
      }
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
      this.loadError = true
    }
  }
}
</script>

<style lang="scss">
.md-select-menu {
    z-index: 9999;
}
</style>
