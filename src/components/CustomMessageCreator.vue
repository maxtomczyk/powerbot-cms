<template>
<div class="message-creator__wrapper">
  <md-dialog :md-active.sync="active" class="message-creator">
    <md-dialog-title>New custom message</md-dialog-title>
    <md-dialog-content>
      <div class="message-creator__type">
        <md-radio v-model="type" value="text" class='md-primary'>Text</md-radio>
        <md-radio v-model="type" value="buttons" class='md-primary'>Buttons</md-radio>
        <md-radio v-model="type" value="quick_replies" class='md-primary'>Quick replies</md-radio>
        <md-radio v-model="type" value="raw" class='md-primary'>Raw JSON</md-radio>
      </div>

      <md-tabs :md-active-tab="activeLang" @md-changed="langChange" md-alignment="centered" class="message-creator__tabs">
        <md-tab v-for="(langMessage, lang) in message" :id="lang" :md-label="langNames[lang]" :key="lang">
          <div class="message-creator__columns" v-if="['raw'].indexOf(type) === -1">
            <div class="message-creator__column" style="text-align: center;">
              <div style="text-align: left;">
                <span class="md-subheading">Text variants</span>
                <div class="" v-for="(text, i) in langMessage.texts" :key="`${lang}${i}`" class="message-creator__text">
                  <md-field class="">
                    <label>Variant {{ i + 1 }}</label>
                    <md-textarea v-model="langMessage.texts[i]" class="message-creator__json" @change="change($event)"></md-textarea>
                  </md-field>
                  <md-button class="md-icon-button message-creator__qr-icon" @click="deleteText(i)">
                    <md-icon>delete</md-icon>
                  </md-button>
                </div>
              </div>
              <md-button class="md-icon-button message-creator__add-icon" @click="addText()">
                <md-icon>add</md-icon>
              </md-button>
            </div>
            <div class="message-creator__column">
              <div v-if="type === 'quick_replies'" style="text-align: center;">
                <span class="md-subheading">Quick replies</span>
                <div class="message-creator__qr-row-wrapper" v-for="(qr, i) in langMessage.quick_replies" :key="`${i}-${Math.random()}`">
                  <span class="md-caption">Reply {{ i + 1 }}</span>
                  <div class="message-creator__qr-row">
                    <md-field class="message-creator__qr-input">
                      <label>Title</label>
                      <md-input v-model="qr.title"></md-input>
                    </md-field>
                    <md-field class="message-creator__qr-input">
                      <label>Payload</label>
                      <md-input v-model="qr.payload"></md-input>
                    </md-field>
                    <md-button class="md-icon-button message-creator__qr-icon" @click="deleteQr(i)">
                      <md-icon>delete</md-icon>
                    </md-button>
                  </div>
                  <md-divider></md-divider>
                </div>
                <md-button class="md-icon-button message-creator__add-icon" @click="addQr()">
                  <md-icon>add</md-icon>
                </md-button>
              </div>

              <div v-if="type === 'buttons'" style="text-align: center;">
                <span class="md-subheading"></span>
                <div class="message-creator__qr-row-wrapper" v-for="(btn, i) in langMessage.buttons" :key="`${i}-${Math.random()}`">
                  <span class="md-caption">Button {{ i + 1 }}</span>
                  <div class="message-creator__qr-row">
                    <md-field class="message-creator__qr-input">
                      <label>Title</label>
                      <md-input v-model="btn.title"></md-input>
                    </md-field>
                    <md-field class="message-creator__qr-input">
                      <label>Payload</label>
                      <md-input v-model="btn.payload"></md-input>
                    </md-field>
                    <md-button class="md-icon-button message-creator__qr-icon" @click="deleteBtn(i)">
                      <md-icon>delete</md-icon>
                    </md-button>
                  </div>
                  <md-divider></md-divider>
                </div>
                <md-button class="md-icon-button message-creator__add-icon" @click="addButton()">
                  <md-icon>add</md-icon>
                </md-button>
              </div>
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
  props: ['active', 'langs', 'message'],
  data() {
    return {
      activeLang: null,
      langNames: {},
      type: 'text',
      temp: {

      },
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
      }
      // templates: {
      //   text: {
      //     texts: ['']
      //   },
      //   buttons: {
      //     texts: [''],
      //     addQuickReplies: false,
      //     buttons: [{
      //       type: 'web_url',
      //       url: '',
      //       payload: '',
      //       title: ''
      //     }],
      //     quick_replies: [{
      //       type: 'text',
      //       title: '',
      //       payload: ''
      //     }]
      //   },
      //   quick_replies: {
      //     texts: [''],
      //     quick_replies: [{
      //       type: 'text',
      //       title: '',
      //       payload: ''
      //     }]
      //   },
      //   raw: {
      //     json: {}
      //   }
      // }
    }
  },
  created() {
    for (let lang of this.langs) {
      this.langNames[lang.locale] = lang.name
      this.temp[lang.locale] = {}
    }

    for (let lang in this.message) {
      if (!this.message[lang].quick_replies) this.message[lang].quick_replies = [Object.assign({}, this.elements.quick_reply), Object.assign({}, this.elements.quick_reply)]
      if (!this.message[lang].buttons) this.message[lang].buttons = [Object.assign({}, this.elements.button)]
    }
    this.activeLang = this.langs[0].locale
  },

  mounted() {
    const type = this.type
    this.type = 'quick_replies'
    this.activeLang = this.langs[1].locale

    this.type = type
    this.activeLang = this.langs[0].locale
  },

  methods: {
    langChange() {
      for (let langMessage in this.message) {

      }
    },

    create() {
      // this.$emit('create')
    },

    addButton() {
      for (let lang in this.message) {
        this.message[lang].buttons.push(Object.assign({}, this.elements.button))
      }

      this.$forceUpdate()
    },

    deleteBtn(i) {
      for (let lang in this.message) {
        this.message[lang].buttons.splice(i, 1)
      }
      this.$forceUpdate()
    },

    addQr() {
      for (let lang in this.message) {
        this.message[lang].quick_replies.push(Object.assign({}, this.elements.button))
      }

      this.$forceUpdate()
    },

    deleteQr(i) {
      for (let lang in this.message) {
        this.message[lang].quick_replies.splice(i, 1)
      }
      this.$forceUpdate()
    },

    addText() {
      for (let lang in this.message) {
        this.message[lang].texts.push('Another text variant')
      }
      this.$forceUpdate()
    },

    deleteText(i) {
      for (let lang in this.message) {
        this.message[lang].texts.splice(i, 1)
      }
      this.$forceUpdate()
    },
    change(e) {
      console.log(this.message);
    }
  },

  watch: {
    type(changed, old) {

      console.log(this.message);
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

    &__columns {
        display: flex;
        justify-content: space-between;
    }

    &__column {
        width: 49%;
    }

    &__qr-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__qr-row-wrapper {
        text-align: left;
        padding-top: 10px;

    }
    &__qr-input {
        width: 42%;
        margin-bottom: 20px;
    }

    &__qr-icon {}

    &__add-icon {
        text-align: center;
        margin-top: 15px;
    }

    &__text {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.md-tabs-content {
    height: 100% !important;
}

.md-tabs {
    height: 100%;
}

.md-dialog-content {
    height: 100%;
}

.md-dialog-container {
    width: 100%;
}

.no-margin-top {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
</style>
