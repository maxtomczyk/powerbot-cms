<template>
<div class="message-creator__wrapper">
  <custom-dialog ref="messageDialog" class="dialog--no-header-margin dialog--no-overflow">
    <div slot="custom-dialog-header">
      <h1>Edit message</h1>
      <span class="md-body-1" style="display: block">{{ name }}</span>
    </div>
    <div slot="custom-dialog-content">
      <div class="container" style="width: 90vw; min-width: 1100px">
        <tabs style="width: 100%; margin-bottom: 0;" @change="tabsChange($event)">
          <div v-for="(langMessage, lang) in message" :id="lang" :key="lang">{{ langNames[lang].toUpperCase() }}</div>
        </tabs>
        <div class="message-creator__type">
          <radio :actual="type" v-model="type" val="text">Text</radio>
          <radio :actual="type" v-model="type" val="buttons">Buttons</radio>
          <radio :actual="type" v-model="type" val="quick_replies">Quick replies</radio>
          <radio :actual="type" v-model="type" val="raw">Raw JSON</radio>
        </div>
        <div v-show="activeLang === lang" v-for="(langMessage, lang) in message" :key="`${lang}-row`">
          <div class="row" v-if="type === 'text'">
            <div class="col-xs-12 col-lg-8">
              <div class="message-creator__column">
                <h3>Text variants</h3>
                <div v-for="(text, i) in langMessage.texts" :key="`${lang}${i}`" class="message-creator__text-variant">
                    <label class="label label--centered">Variant {{ i + 1 }} <span class="message-creator__variant-remove" @click="deleteText(i)" v-tooltip.top-center="'Remove text variant.'">remove</span>
                      <textarea v-model="langMessage.texts[i]" class="message-creator__textarea textarea input" style="width: 100%;" rows="3"></textarea>
                    </label>
                </div>
                <div style="text-align: center">
                  <font-awesome-icon @click="addText()" icon="plus" size="lg" class="message-creator__icon" v-tooltip.top-center="'Add new text variant.'" />
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-lg-4">

            </div>
          </div>
          <div class="row" v-if="type === 'buttons' || type === 'quick_replies'" style="width: 100%;">
            <div class="col-xs-12 col-lg-4">
              <div class="message-creator__column">
                <h3>Text variants</h3>
                  <div v-for="(text, i) in langMessage.texts" :key="`${lang}${i}`" class="message-creator__text-variant">
                    <label class="label label--centered">Variant {{ i + 1 }} <span class="message-creator__variant-remove" @click="deleteText(i)" v-tooltip.top-center="'Remove text variant.'">remove</span>
                      <textarea v-model="langMessage.texts[i]" class="message-creator__textarea textarea input" style="width: 100%;" rows="3"></textarea>
                    </label>
                  </div>
                  <div style="text-align: center">
                    <font-awesome-icon @click="addText()" icon="plus" size="lg" class="message-creator__icon" v-tooltip.top-center="'Add new text variant.'" />
                  </div>
              </div>
            </div>
            <div class="col-xs-12 col-lg-4">
              <div v-if="type === 'quick_replies'" class="message-creator__column">
                <h3>Quick Replies</h3>
                <div class="message-creator__qr-row-wrapper" v-for="(qr, i) in langMessage.quick_replies" :key="hash(createHashString(i+1, 'qr'))">
                  <div class="label">Reply {{ i + 1 }}
                    <span class="message-creator__variant-remove" @click="deleteQr(i)" v-tooltip.top-center="'Remove quick reply.'">remove</span>
                  </div>
                  <div class="message-creator__qr-row">
                    <label class="label label--centered">Title
                      <input type="text" v-model="qr.title" class="input">
                    </label>
                    <label class="label label--centered">Payload
                      <input type="text" v-model="qr.payload" class="input">
                    </label>
                  </div>
                </div>
                <div style="text-align: center">
                  <font-awesome-icon @click="addQr()" icon="plus" size="lg" class="message-creator__icon" v-tooltip.top-center="'Add quick reply.'" />
                </div>
              </div>
              <div v-if="type === 'buttons'" class="message-creator__column">
                <h3>Buttons</h3>
                <div class="message-creator__qr-row-wrapper" v-for="(btn, i) in langMessage.buttons" :key="hash(createHashString(i+1, 'qr'))">
                  <div class="label">Button {{ i + 1 }}
                    <span class="message-creator__variant-remove" @click="deleteBtn(i)" v-tooltip.top-center="'Remove button.'">remove</span>
                  </div>
                  <div class="message-creator__qr-row">
                    <label class="label label--centered">Title
                      <input type="text" v-model="btn.title" class="input">
                    </label>
                    <label class="label label--centered">Payload / URL
                      <input type="text" v-model="btn.payload" class="input">
                    </label>
                  </div>
                </div>
                <div style="text-align: center">
                  <font-awesome-icon @click="addButton()" icon="plus" size="lg" class="message-creator__icon" v-tooltip.top-center="'Add button.'" />
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-lg-4">

            </div>
          </div>
          <div v-if="type === 'raw'" style="width: 100%;">
            <div class="col-xs-12">
              <div class="message-creator__column">
                <h3>JSON</h3>
                <label class="label label--centered">
                  <textarea v-model="langMessage.raw" class="message-creator__textarea textarea textarea--bordered input" style="width: 100%;" rows="12"></textarea>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--blue" @click="create">
        SAVE
      </div>
    </div>
  </custom-dialog>

  <md-dialog :md-active.sync="active" :md-close-on-esc="false" :md-click-outside-to-close="false" class="message-creator">
    <!-- <md-dialog-title>Edit message
      <span class="md-body-1" style="display: block">{{ name }}</span>
    </md-dialog-title>

    <md-dialog-content>
      <div class="message-creator__type">
        <md-radio v-model="type" value="text" class='md-primary'>Text</md-radio>
        <md-radio v-model="type" value="buttons" class='md-primary'>Buttons</md-radio>
        <md-radio v-model="type" value="quick_replies" class='md-primary'>Quick replies</md-radio>
        <md-radio v-model="type" value="raw" class='md-primary'>Raw JSON</md-radio>
      </div> -->

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
                  <div class="message-creator__qr-row-wrapper" v-for="(qr, i) in langMessage.quick_replies" :key="hash(createHashString(i+1, 'qr'))">
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
                  <div class="message-creator__qr-row-wrapper" v-for="(btn, i) in langMessage.buttons" :key="hash(createHashString(i+1, 'btn'))">
                    <span class="md-caption">Button {{ i + 1 }}</span>
                    <div class="message-creator__qr-row">
                      <md-field class="message-creator__qr-input">
                        <label>Title</label>
                        <md-input v-model="btn.title"></md-input>
                      </md-field>
                      <md-field class="message-creator__qr-input">
                        <label>Payload / URL</label>
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
import hash from 'object-hash'

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
      hash: null,
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
    openDialog(){
      this.$refs.messageDialog.openDialog()
    },

    tabsChange(e){
      this.activeLang = e
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
        this.message[lang].quick_replies.push(Object.assign({}, this.elements.quick_reply))
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
    },

    createHashString(i, c){
      let els = []
      for (let o = 0; o < i; o++){
        els.push(c)
      }
      els.push(i)
      return els.join('')
    },

    setProps(){
      for (let lang in this.message) {
        if (!this.message[lang].quick_replies) this.message[lang].quick_replies = [Object.assign({}, this.elements.quick_reply), Object.assign({}, this.elements.quick_reply)]
        if (!this.message[lang].buttons) this.message[lang].buttons = [Object.assign({}, this.elements.button)]
        if (!this.message[lang].raw) this.message[lang].raw = ''
        if (!this.message[lang].texts) this.message[lang].texts = ['']
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
    }
    this.activeLang = this.langs[0].locale
    this.hash = hash
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.message-creator{
  &__wrapper{

  }

  &__column{
    overflow-y: scroll;
    height: 45vh;

    &::-webkit-scrollbar {
        width: 2px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: $font-primary;
        border-radius: 2px;
    }
  }

  &__textarea{
    resize: vertical;
  }

  &__type{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
  }

  &__text-variant{

  }

  &__variant-remove{
    color: $orange;
    position: relative;
    width: 100%;
    margin-left: 6px;
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
    font-size: .9em;

    &:hover{
      color: $orange-hover;
    }
  }

  &__qr-row{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    label{
      width: 45%;
    }
  }

  &__icon{
    color: $blue;
    cursor: pointer;

    &:hover{
      color: $blue-hover;
    }
  }
}
</style>
