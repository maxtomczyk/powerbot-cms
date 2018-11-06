<template>
<div class="message-creator__wrapper">
  <md-dialog :md-active.sync="active" class="message-creator">
    <md-dialog-title>New custom message</md-dialog-title>
    <md-dialog-content>
      <div class="message-creator__type">
        <md-radio v-model="type" value="text" class='md-primary' @change="typeChange">Text</md-radio>
        <md-radio v-model="type" value="buttons" class='md-primary' @change="typeChange">Buttons</md-radio>
        <md-radio v-model="type" value="quick_replies" class='md-primary' @change="typeChange">Quick replies</md-radio>
        <md-radio v-model="type" value="raw" class='md-primary' @change="typeChange">Raw JSON</md-radio>
      </div>

      <md-tabs :md-active-tab="activeLang" @md-changed="langChange" md-alignment="centered" class="message-creator__tabs">
        <md-tab v-for="(langMessage, lang) in message" :id="lang" :md-label="langNames[lang]" :key="message[lang]">
          <div class="message-creator__columns">
            <div class="message-creator__column">
              <div v-if="['raw'].indexOf(type) === -1">
                <span class="md-subheading">Text variants</span>
                <md-field class="" v-for="(text, i) in langMessage.texts" :key="Math.random()">
                  <label>JSON</label>
                  <md-textarea v-model="langMessage.texts[i]" class="message-creator__json"></md-textarea>
                </md-field>
              </div>
            </div>
            <div class="message-creator__column">

            </div>
          </div>
        </md-tab>
      </md-tabs>
      <!-- <div class="message-creator__columns">
        <div class="message-creator__column">
          <md-field>
            <label>Name</label>
            <md-input v-model="name"></md-input>
          </md-field>

          <md-field>
            <label>Description</label>
            <md-textarea md-autogrow v-model="description"></md-textarea>
          </md-field>

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
      </div> -->
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
  props: ['active', 'langs', 'message', 'type'],
  data() {
    return {
      activeLang: null,
      langNames: {},
      elements: {
        button: {
          type: 'web_url',
          url: '',
          payload: '',
          title: ''
        },
        quick_reply: {
          type: 'text',
          title: '',
          payload: ''
        }
      },
      templates: {
        text: {
          texts: ['']
        },
        buttons: {
          texts: [''],
          addQuickReplies: false,
          buttons: [{
            type: 'web_url',
            url: '',
            payload: '',
            title: ''
          }],
          quick_replies: [{
            type: 'text',
            title: '',
            payload: ''
          }]
        },
        quick_replies: {
          texts: [''],
          quick_replies: [{
            type: 'text',
            title: '',
            payload: ''
          }]
        },
        raw: {
          json: {}
        }
      }
    }
  },
  created() {
    for(let lang of this.langs){
      this.langNames[lang.locale] = lang.name
    }
    this.activeLang = this.langs[0].locale
    console.log(this.message);
  },
  methods: {
    langChange() {

    },

    typeChange(){
      for(let lang in this.message){
        this.message[lang] = this.templates[this.type]
      }
    },

    create() {
      this.$emit('create', o)
    }
  }
}
</script>

<style lang="scss">
.message-creator {
    min-width: 98vw;
    min-height: 90vh;

    &__type {
        margin: 0 auto;
        text-align: center;
    }

    &__columns{
      display: flex;
      justify-content: space-between;
    }

    &__column{
      width: 49%;
    }
}

.no-margin-top {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
</style>
