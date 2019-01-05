<template>
<div class="attachments view-with-navbar">
  <notifier ref="notifier"></notifier>
  <!-- <creation-button></creation-button> -->

  <div class="view-actions">
    <div class="button button--blue" :class="(unsyncedN) ? '' : 'button--disabled'" @click="syncAll">
      <span>Sync all</span>
      <font-awesome-icon icon="sync-alt" class="button__icon" />
    </div>
  </div>

  <table class="table attachments__table">
    <tr class="table__row">
      <th class="table__head">Name</th>
      <th class="table__head">Description</th>
      <th class="table__head" style="width: 120px; padding-right: 1.5%;">Preview</th>
      <th class="table__head">Status</th>
      <th class="table__head">Actions</th>
    </tr>
    <tr class="table__row" v-for="(attachment, i) in attachments" :key="attachment.id">
      <td class="table__cell" style="width: 16%">{{ attachment.friendly_name }}</td>
      <td class="table__cell" style="width: 47%">{{ attachment.description }}</td>
      <td class="table__cell" style="width: 14%; padding-right: 1.5%;">
        <img v-if="attachment.show_preview" :src="attachment.url" :alt="attachment.friendly_name" class="attachments__image">
        <span v-else>N/A</span>
      </td>
      <td class="table__cell" style="width: 8%; padding-left: 0;">
        <div v-show="!attachment.force_update && attachment.attachment_id" v-tooltip.top-center="'Attachment from database synced with Attachments API.'" class="attachments__synced-check attachments__synced-check--green"></div>
        <div v-show="attachment.force_update && attachment.attachment_id" v-tooltip.top-center="'Attachment known in Attachments API, but it\'s link changed.'" class="attachments__synced-check attachments__synced-check--orange"></div>
        <div v-show="!attachment.attachment_id" v-tooltip.top-center="'Attachment not known in Attachments API, may cause errors.'" class="attachments__synced-check attachments__synced-check--red"></div>
      </td>
      <td class="table__cell" style="width: 15%;">
        <font-awesome-icon @click="$refs[`attachmentEdit_${attachment.id}`][0].openDialog()" icon="edit" size="lg" class="table__icon" v-tooltip.top-center="'Edit attachment.'" />
        <font-awesome-icon v-show="attachment.force_update || !attachment.attachment_id" @click="syncAttachment(attachment.id, i)" icon="sync-alt" size="lg" class="table__icon" v-tooltip.top-center="'Sync attachment with API.'" />
      </td>

      <custom-dialog :ref="`attachmentEdit_${attachment.id}`">
        <div slot="custom-dialog-header">
          <h1 style="margin-bottom: 0;">Edit attachment</h1>
          <span>{{ attachment.friendly_name }} ({{ attachment.name }})</span>
        </div>
        <div slot="custom-dialog-content" style="width: 600px">
          <div class="container" style="width: 100%;">
            <div class="row">
              <div class="col-xs-12">
                <label class="label label--centered" for="name">Friendly name
                  <input class="input" type="text" name="name" v-model="attachment.friendly_name" />
                </label>
                <label class="label label--centered" for="name">Description
                  <input class="input" type="text" name="name" v-model="attachment.description" />
                </label>
                <label class="label label--centered" for="name">URL
                  <input class="input" type="text" name="name" v-model="attachment.url" />
                </label>
                <label class="label label--centered" for="name">API Attachment ID
                  <input class="input" type="text" name="name" v-model="attachment.attachment_id" disabled />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div slot="custom-dialog-buttons">
          <div class="dialog__button dialog__button--blue" @click="editAttachment(attachment, i)">
            SAVE
          </div>
        </div>
      </custom-dialog>
    </tr>
  </table>
</div>
</template>

<script>
import axios from 'axios'
import {
  EventBus
} from '../event-bus'

export default {
  data() {
    return {
      attachments: [],
      unsyncedN: 0
    }
  },

  methods: {
    countUnsynced(){
      let that = this
      this.unsyncedN = 0
      this.attachments.map(a => {
        if (a.force_update) that.unsyncedN++
      })
    },

    async syncAll() {
      try {
        const updated = await axios.post('/api/sync_attachments', {})
        this.attachments = updated.data.attachments
        this.countUnsynced()
        this.$forceUpdate()
        if (!updated.data.errors) this.$refs.notifier.pushNotification('synced', 'All attachments are synced now.', 'success', 5000)
        else this.$refs.notifier.pushNotification('synced', `Attachment sync finished with ${updated.data.errors} error(s)`, 'warning', 5000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot sync', `An error occured during synchronization. Error code: ${e.response.status}.`, 'error')
      }
    },

    async syncAttachment(id, i) {
      try {
        const updated = await axios.post('/api/sync_attachment', {
          id
        })
        this.attachments[i] = updated.data
        this.$refs.notifier.pushNotification('saved', 'Changes to attachment has been saved.', 'success', 5000)
        this.countUnsynced()
        this.$forceUpdate()
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot sync', `An error occured during synchronization. Error code: ${e.response.status}.`, 'error')
      }
    },

    async editAttachment(attachment, i) {
      try {
        const updated = await axios.post('/api/attachment', attachment)
        this.attachments[i] = updated.data
        this.$refs.notifier.pushNotification('saved', 'Changes to attachment has been saved.', 'success', 5000)
        this.$refs[`attachmentEdit_${attachment.id}`][0].closeDialog()
        this.countUnsynced()
        this.$forceUpdate()
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot save', `An error occured during changes save. Error code: ${e.response.status}.`, 'error')
      }
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const attachments = await axios.get('/api/attachments/')

      this.attachments = attachments.data
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load', `An error occured during data load. Error code: ${e.response.status}.`, 'error')
    }
  },
  mounted() {
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },
  destroyed() {
    EventBus.$off('token_refresh')
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.attachments {
    &__table {
        width: 90%;
        margin: 0 auto;
    }

    &__synced-check {
        width: 8px;
        height: 8px;
        background-color: yellow;
        margin: 0 auto;
        border-radius: 50%;

        &--green {
            background-color: $green;
        }

        &--red {
            background-color: $error;
        }
    }

    &__image {
        width: 100%;
    }
}
</style>
