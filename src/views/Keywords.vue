<template>
<div class="keywords view-with-navbar">
  <notifier ref="notifier"></notifier>
  <creation-button @click="$refs.creationDialog.openDialog()"></creation-button>

  <custom-dialog ref="creationDialog">
    <div slot="custom-dialog-header">
      <h1>Create reaction</h1>
    </div>
    <div slot="custom-dialog-content">
      <div class="container" style="width: 100%; min-width: 700px;">
        <div class="row">
          <div class="col-xs-12 col-lg-6">
            <label class="label label--centered">Name
              <input class="input" type="text" v-model="keyword.friendly_name" />
            </label>
            <label class="label label--centered">Message
              <select class="input select" v-model="keyword.message_id">
                <option v-for="message in messages" :key="message.id" :value="message.id">{{ message.friendly_name }}</option>
              </select>
            </label>
          </div>
          <div class="col-xs-12 col-lg-6">
            <label class="label label--centered">Regex body
              <input class="input" type="text" v-model="keyword.regex_body" />
            </label>
            <label class="label label--centered">Regex flags
              <input class="input" type="text" v-model="keyword.regex_flags" />
            </label>
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

  <custom-dialog ref="deleteDialog">
    <div slot="custom-dialog-header">
      <h1>Remove reaction</h1>
    </div>
    <div slot="custom-dialog-content">
      You are about to remove bot reaction named <i><b>{{ toDelete.name }}</b></i>. Continue?
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--orange" @click="remove(toDelete.id)">
        DELETE
      </div>
    </div>
  </custom-dialog>


  <table class="keywords__table table" v-if="keywords.length">
    <tr>
      <th>Name</th>
      <th>Regex</th>
      <th>Message</th>
      <th>Actions</th>
    </tr>
    <tr v-for="keyword in keywords" :key="keyword.id">
      <td>{{ keyword.friendly_name }}</td>
      <td>{{ `/${keyword.regex_body}/${keyword.regex_flags}` }}</td>
      <td>{{ keyword.message_name }}</td>
      <td>
        <font-awesome-icon @click="openDeleteDialog(keyword)" v-tooltip.top-center="'Remove bot reaction on this pattern'" icon="trash-alt" size="lg" class="table__icon" fixed-width />
      </td>
    </tr>
  </table>
  <empty-state v-else icon="clipboard-list" title="Responses for keywords list is empty..." text="Show your bot how to response for messages with regular expressions!"></empty-state>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      creationDialog: false,
      loadError: false,
      error: false,
      success: false,
      keywords: [],
      messages: [],
      keyword: {
        regex_body: '',
        regex_flags: '',
        message_id: null,
        friendly_name: ''
      },
      toDelete: {
        name: '',
        id: null
      }
    }
  },

  methods: {
    async remove(id) {
      try {
        await axios.delete('/api/keyword', {
          data: {
            id
          }
        })

        this.keywords.map((k, i) => {
          if (k.id === id) this.keywords.splice(i, 1)
        })

        this.$refs.notifier.pushNotification('deleted!', `Selected keyword reaction has been removed.`, 'success', 6000)
        this.$refs.deleteDialog.closeDialog()
      } catch (e) {
        this.$refs.deleteDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot remove!', `An error occured during delete request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async create() {
      try {
        const created = await axios.put('/api/keyword', this.keyword)
        this.keywords.push(created.data)
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('created!', `Keyword reaction has been created.`, 'success', 6000)
      } catch (e) {
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot create!', `An error occured during creation request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    openDeleteDialog(keyword){
      this.toDelete.name = keyword.friendly_name
      this.toDelete.id = keyword.id
      this.$refs.deleteDialog.openDialog()
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const keywords = await axios.get('/api/keywords')
      const messages = await axios.get('/api/messages?id=3')
      this.keywords = keywords.data
      this.messages = messages.data
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `An error occured during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  }
}
</script>

<style lang="scss">
.keywords {

    &__table {
        width: 90%;
        margin: 0 auto;
    }
}
</style>
