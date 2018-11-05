<template>
<div class="message-creator__wrapper">
  <md-dialog :md-active.sync="active" class="message-creator">
    <md-dialog-title>New custom message</md-dialog-title>
    <md-dialog-content>
      <div class="message-creator__columns">
        <div class="message-creator__column">
          <md-field>
            <label>Name</label>
            <md-input v-model="name"></md-input>
          </md-field>

          <md-field>
            <label>Description</label>
            <md-textarea md-autogrow v-model="description"></md-textarea>
          </md-field>
          <md-radio v-model="type" value="text" class='md-primary'>Text</md-radio>
          <md-radio v-model="type" value="qr" class='md-primary'>Quick replies</md-radio>
          <md-radio v-model="type" value="json" class='md-primary'>JSON</md-radio>
        </div>
        <div class="message-creator__column">
          <md-field v-show="type === 'json'" class="no-margin-top message-creator__json">
            <label>JSON</label>
            <md-textarea v-model="message_json" class="message-creator__json"></md-textarea>
          </md-field>

          <md-field v-show="type !== 'json'" class="no-margin-top">
            <label>Message text</label>
            <md-textarea v-model="message.text"></md-textarea>
          </md-field>
          <div class="message-creator__replies" v-show="type === 'qr'">
            <div class="message-creator__reply-row" v-for="(qr, i) in qrs" :key="i">
              <md-field class="message-creator__reply-input">
                <label>Text</label>
                <md-input v-model="qr.title"></md-input>
              </md-field>

              <i class="material-icons">keyboard_arrow_right</i>

              <md-field class="message-creator__reply-input">
                <label>Payload</label>
                <md-input v-model="qr.payload"></md-input>
              </md-field>
            </div>
            <div class="message-creator__add-reply-wrapper">
              <md-button class="md-icon-button" @click="addReply()">
                <md-icon>add</md-icon>
              </md-button>
            </div>
          </div>
        </div>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="$emit('close')">Close</md-button>
      <md-button class="md-primary" @click="create()">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
export default {
  props: ['active'],
  data() {
    return {
      type: 'text',
      name: '',
      description: '',
      message: {
        text: ''
      },
      message_json: null,
      qrs: [{
        content_type: 'text',
        title: '',
        payload: ''
      }]
    }
  },
  created() {

  },
  methods: {
    addReply() {
      const o = {
        content_type: 'text',
        title: '',
        payload: ''
      }
      this.qrs.push(o)
    },

    create() {
      let message = {}
      switch (this.type) {
        case 'text':
          message.text = this.message.text
          break

        case 'qr':
          message.quick_replies = this.qrs
          message.text = this.message.text
          break

        case 'json':
          message = JSON.parse(this.message_json)
          break
      }

      const o = {
        name: this.name,
        description: this.description,
        message
      }

      this.$emit('create', o)
    }
  }
}
</script>

<style lang="scss">
.message-creator {
    min-width: 55vw;

    &__columns {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
    }

    &__column {
        width: 45%;
    }

    &__json {
        height: 100%;
    }

    &__reply-input {
        width: 45%;
        margin-top: 2%;
        margin-bottom: 2%;
    }

    &__reply-row {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    &__add-reply-wrapper {
        width: 100%;
        text-align: center;
    }
}

.no-margin-top {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
</style>
