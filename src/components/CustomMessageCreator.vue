<template>
<div class="message-creator__wrapper">
  <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="error">
    <span>Request ended with error!</span>
    <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
  </md-snackbar>

  <md-dialog :md-active.sync="active" :md-close-on-esc="false" :md-click-outside-to-close="false" class="message-creator">
    <md-dialog-title>Edit message
      <span class="md-body-1" style="display: block">{{ name }}</span>
    </md-dialog-title>

    <md-dialog-content>
      <div class="message-creator__type">
        <md-radio v-model="type" value="text" class='md-primary'>Text</md-radio>
        <md-radio v-model="type" value="buttons" class='md-primary'>Buttons</md-radio>
        <md-radio v-model="type" value="quick_replies" class='md-primary'>Quick replies</md-radio>
        <md-radio v-model="type" value="raw" class='md-primary'>Raw JSON</md-radio>
      </div>

      <md-tabs :md-active-tab="activeLang" md-alignment="centered" class="message-creator__tabs">
        <md-tab v-for="(langMessage, lang) in message" :id="lang" :md-label="langNames[lang]" :key="lang">
          <div class="message-creator__columns" v-if="['raw'].indexOf(type) === -1">
            <div class="message-creator__column" style="text-align: center;">
              <div style="text-align: left;">
                <span class="md-subheading">Text variants</span>
                <div v-for="(text, i) in langMessage.texts" :key="`${lang}${i}`" class="message-creator__text">
                  <md-field class="">
                    <label>Variant {{ i + 1 }}</label>
                    <md-textarea v-model="langMessage.texts[i]" class="message-creator__json"></md-textarea>
                  </md-field>
                  <md-button class="md-icon-button message-creator__qr-icon message-creator__text-icon" @click="deleteText(i)">
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
                <div style="text-align: left;">
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
                </div>
                <md-button class="md-icon-button message-creator__add-icon" @click="addQr()">
                  <md-icon>add</md-icon>
                </md-button>
              </div>

              <div v-if="type === 'buttons'" style="text-align: center;">
                <div style="text-align: left;">
                  <span class="md-subheading">Buttons</span>
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
                </div>
                <md-button class="md-icon-button message-creator__add-icon" @click="addButton()">
                  <md-icon>add</md-icon>
                </md-button>
              </div>
            </div>
          </div>
          <div v-if="type === 'raw'" style="text-align: center;">
            <md-field class="">
              <label>JSON</label>
              <md-textarea v-model="langMessage.raw" class="message-creator__json" style="min-height: 38vh;"></md-textarea>
            </md-field>
          </div>
        </md-tab>
      </md-tabs>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="$emit('close')">Close</md-button>
      <md-button class="md-primary" @click="create">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['active', 'langs', 'message', 'mType', 'id', 'name'],
  data() {
    return {
      activeLang: null,
      error: false,
      langNames: {},
      type: 'text',
      temp: {

      },
      elements: {
        button: {
          type: 'postback',
          payload: '',
          title: ''
        },
        quick_reply: {
          content_type: 'text',
          title: '',
          payload: ''
        }
      }
    }
  },

  methods: {
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
        this.message[lang].texts.push('')
      }
      this.$forceUpdate()
    },

    deleteText(i) {
      for (let lang in this.message) {
        this.message[lang].texts.splice(i, 1)
      }
      this.$forceUpdate()
    },

    async create() {
      try {
        switch (this.type) {
          case 'text':
            for (let lang in this.message) {
              delete this.message[lang].quick_replies
              delete this.message[lang].buttons
              delete this.message[lang].raw
            }
            break

          case 'quick_replies':
            for (let lang in this.message) {
              delete this.message[lang].buttons
              delete this.message[lang].raw
            }
            break

          case 'buttons':
            for (let lang in this.message) {
              delete this.message[lang].quick_replies
              delete this.message[lang].raw
              this.message[lang].buttons.map(button => {
                if (this.isUrl(button.payload)) {
                  button.type = 'web_url'
                  button.url = button.payload
                  delete button.payload
                } else {
                  button.type = 'postback'
                  delete button.url
                }
              })
            }
            break

          case 'raw':
            for (let lang in this.message) {
              delete this.message[lang].quick_replies
              delete this.message[lang].buttons
              delete this.message[lang].texts
            }
            break
        }

        const updated = await axios.put('/api/messages', {
          json: this.message,
          type: this.type,
          id: this.id
        })

        if (this.type === 'buttons') {
          for (let lang in updated.data.json) {
            updated.data.json[lang].buttons.map(btn => {
              // if (btn.type === 'web_url') {
              //   // btn.payload = btn.url
              //   // delete btn.url
              // }
              if(!btn.payload) btn.payload = ''
            })
          }
          this.$forceUpdate()
        }

        this.$emit('saved', updated.data)
      } catch (e) {
        this.error = true
        console.error(e)
      }
    },
    isUrl(str) {
      // eslint-disable-next-line
      const pattern = new RegExp('^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$', 'i');

      if (!pattern.test(str)) {
        return false
      } else {
        return true
      }
    }
  },

  created() {
    for (let lang of this.langs) {
      this.langNames[lang.locale] = lang.name
      this.temp[lang.locale] = {}
    }

    this.type = this.mType

    for (let lang in this.message) {
      if (!this.message[lang].quick_replies) this.message[lang].quick_replies = [Object.assign({}, this.elements.quick_reply), Object.assign({}, this.elements.quick_reply)]
      if (!this.message[lang].buttons) this.message[lang].buttons = [Object.assign({}, this.elements.button)]
      if (!this.message[lang].raw) this.message[lang].raw = ''
      if (!this.message[lang].texts) this.message[lang].texts = ['']

      this.message[lang].buttons.map(btn => {
        if (btn.type === 'web_url') {
          btn.payload = btn.url
          delete btn.url
        }
      })
    }
    this.activeLang = this.langs[0].locale
  }
}
</script>

<style lang="scss">
.message-creator {
    min-width: 98vw;
    min-height: 90vh;
    & > .md-dialog-container > .md-dialog-content {
        overflow: hidden !important;

    }

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
        height: 46vh;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 2px;
            background-color: #f5f5f5;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #a8a8a8;
        }

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

    &__text-icon {
        margin-top: -3%;
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
