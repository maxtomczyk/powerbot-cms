<template>
  <div class="message-creator__wrapper">
    <notifier ref="notifier"></notifier>
    <custom-dialog ref="messageDialog" class="dialog--no-header-margin dialog--no-overflow">
      <div slot="custom-dialog-header">
        <h1>Edit message</h1>
        <span style="display: block">{{ name }}</span>
      </div>
      <div slot="custom-dialog-content">
        <div class="container message-creator__dialog-container">
          <tabs style="width: 100%; margin-bottom: 0;" @change="tabsChange($event)">
            <div
              v-for="(langMessage, lang) in message"
              :id="lang"
              :key="lang"
            >{{ langNames[lang].toUpperCase() }}</div>
          </tabs>
          <div class="message-creator__type">
            <radio :actual="type" v-model="type" val="text">Text</radio>
            <radio :actual="type" v-model="type" val="buttons">Buttons</radio>
            <radio :actual="type" v-model="type" val="quick_replies">Quick replies</radio>
            <radio :actual="type" v-model="type" val="carousel">Carousel</radio>
            <radio :actual="type" v-model="type" val="raw">Raw JSON</radio>
          </div>
          <div
            v-show="activeLang === lang"
            v-for="(langMessage, lang) in message"
            :key="`${lang}-row`"
          >
            <div class="row" v-if="type === 'text'">
              <div class="col-xs-12 col-lg-8">
                <div class="message-creator__column">
                  <h3>Text variants</h3>
                  <div
                    v-for="(text, i) in langMessage.texts"
                    :key="`${lang}${i}`"
                    class="message-creator__text-variant"
                  >
                    <label class="label label--centered">
                      Variant {{ i + 1 }}
                      <span
                        class="message-creator__variant-remove"
                        @click="deleteText(i)"
                        v-tooltip.top-center="'Remove text variant.'"
                      >remove</span>
                      <textarea
                        v-model="langMessage.texts[i]"
                        class="message-creator__textarea textarea input"
                        style="width: 100%;"
                        rows="3"
                      ></textarea>
                    </label>
                  </div>
                  <div style="text-align: center">
                    <font-awesome-icon
                      @click="addText()"
                      icon="plus"
                      size="lg"
                      class="message-creator__icon"
                      v-tooltip.top-center="'Add new text variant.'"
                    />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-lg-4">
                <div class="message-creator__column">
                  <message-preview :message="langMessage" ref="mPreview1" :type="type"></message-preview>
                </div>
              </div>
            </div>
            <div
              class="row"
              v-if="type === 'buttons' || type === 'quick_replies'"
              style="width: 100%;"
            >
              <div class="col-xs-12 col-lg-4">
                <div class="message-creator__column">
                  <h3>Text variants</h3>
                  <div
                    v-for="(text, i) in langMessage.texts"
                    :key="`${lang}${i}`"
                    class="message-creator__text-variant"
                  >
                    <label class="label label--centered">
                      Variant {{ i + 1 }}
                      <span
                        class="message-creator__variant-remove"
                        @click="deleteText(i)"
                        v-tooltip.top-center="'Remove text variant.'"
                      >remove</span>
                      <textarea
                        v-model="langMessage.texts[i]"
                        class="message-creator__textarea textarea input"
                        style="width: 100%;"
                        rows="3"
                      ></textarea>
                    </label>
                  </div>
                  <div style="text-align: center">
                    <font-awesome-icon
                      @click="addText()"
                      icon="plus"
                      size="lg"
                      class="message-creator__icon"
                      v-tooltip.top-center="'Add new text variant.'"
                    />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-lg-4">
                <div v-if="type === 'quick_replies'" class="message-creator__column">
                  <h3>Quick Replies</h3>
                  <div
                    class="message-creator__qr-row-wrapper"
                    v-for="(qr, i) in langMessage.quick_replies"
                    :key="hash(createHashString(i+1, 'qr'))"
                  >
                    <div class="label message-creator__label">
                      <div class="message-creator__label-title">Reply {{ i + 1 }}</div>
                      <div class="message-creator__sort-icons">
                        <font-awesome-icon
                          :class="{ 'sort-icon--disabled': (i === 0) }"
                          icon="sort-up"
                          size="lg"
                          @click="sortBtnOrQr('up', i, langMessage.quick_replies)"
                        />
                        <font-awesome-icon
                          :class="{ 'sort-icon--disabled': (i === langMessage.quick_replies.length - 1) }"
                          icon="sort-down"
                          size="lg"
                          @click="sortBtnOrQr('down', i, langMessage.quick_replies)"
                        />
                      </div>
                      <span
                        class="message-creator__variant-remove"
                        @click="deleteQr(i)"
                        v-tooltip.top-center="'Remove quick reply.'"
                      >remove</span>
                    </div>
                    <div class="message-creator__qr-row">
                      <label class="label label--centered">
                        Title
                        <input
                          type="text"
                          v-model="qr.title"
                          class="input"
                          @keyup="QrOrBtnInput(qr)"
                        >
                      </label>
                      <label class="label label--centered">
                        Payload
                        <input type="text" v-model="qr.payload" class="input">
                      </label>
                    </div>
                  </div>
                  <div style="text-align: center">
                    <font-awesome-icon
                      v-if="langMessage.quick_replies.length < 10"
                      @click="addQr()"
                      icon="plus"
                      size="lg"
                      class="message-creator__icon"
                      v-tooltip.top-center="'Add quick reply.'"
                    />
                  </div>
                </div>
                <div v-if="type === 'buttons'" class="message-creator__column">
                  <h3>Buttons</h3>
                  <div
                    class="message-creator__qr-row-wrapper"
                    v-for="(btn, i) in langMessage.buttons"
                    :key="hash(createHashString(i+1, 'qr'))"
                  >
                    <div class="label message-creator__label">
                      <div class="message-creator__label-title">Button {{ i + 1 }}</div>
                      <div class="message-creator__sort-icons">
                        <font-awesome-icon
                          :class="{ 'sort-icon--disabled': (i === 0) }"
                          icon="sort-up"
                          size="lg"
                          @click="sortBtnOrQr('up', i, langMessage.buttons)"
                        />
                        <font-awesome-icon
                          :class="{ 'sort-icon--disabled': (i === langMessage.buttons.length - 1) }"
                          icon="sort-down"
                          size="lg"
                          @click="sortBtnOrQr('down', i, langMessage.buttons)"
                        />
                      </div>
                      <span
                        class="message-creator__variant-remove"
                        @click="deleteBtn(i)"
                        v-tooltip.top-center="'Remove button.'"
                      >remove</span>
                    </div>
                    <div class="message-creator__qr-row">
                      <label class="label label--centered">
                        Title
                        <input
                          type="text"
                          v-model="btn.title"
                          class="input"
                          @keyup="QrOrBtnInput(btn)"
                        >
                      </label>
                      <label class="label label--centered">
                        <div>
                          <span>Payload / URL</span>
                          <font-awesome-icon
                            :class="{ 'message-creator__link-convert--hidden': (!isUrl(btn.payload)) }"
                            class="message-creator__link-convert"
                            icon="link"
                            size="sm"
                            @click="convertLink(btn)"
                          />
                        </div>
                        <input
                          type="text"
                          v-model="btn.payload"
                          class="input"
                          data-prev-value
                          @focus="btnFocusHandler"
                          @input="btnInputHandler"
                        >
                      </label>
                    </div>
                  </div>
                  <div style="text-align: center">
                    <font-awesome-icon
                      v-if="langMessage.buttons.length < 3"
                      @click="addButton()"
                      icon="plus"
                      size="lg"
                      class="message-creator__icon"
                      v-tooltip.top-center="'Add button.'"
                    />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-lg-4">
                <div class="message-creator__column">
                  <message-preview ref="mPreview2" :message="langMessage" :type="type"></message-preview>
                </div>
              </div>
            </div>
            <div v-if="type === 'carousel'" style="width: 100%; display: flex;">
              <div class="col-xs-8">
                <div class="message-creator__column">
                  <h3>
                    Cards
                    <font-awesome-icon
                      v-if="langMessage.cards.length < 10"
                      @click="addCard()"
                      icon="plus"
                      size="xs"
                      class="message-creator__icon"
                      v-tooltip.top-center="'Add card.'"
                      style="margin-left: 3px; font-size: 1em;"
                    />
                  </h3>

                  <div
                    v-for="(card, i) in langMessage.cards"
                    :key="hash(createHashString(i+1, 'card'))"
                    class="message-creator__card"
                  >
                    <div class="label message-creator__label">
                      <div class="message-creator__label-title">Card {{ i + 1 }}</div>
                      <div class="message-creator__sort-icons">
                        <font-awesome-icon
                          :class="{ 'sort-icon--disabled': (i === 0) }"
                          icon="sort-up"
                          size="lg"
                          @click="sortBtnOrQr('up', i, langMessage.cards)"
                        />
                        <font-awesome-icon
                          :class="{ 'sort-icon--disabled': (i === langMessage.cards.length - 1) }"
                          icon="sort-down"
                          size="lg"
                          @click="sortBtnOrQr('down', i, langMessage.cards)"
                        />
                      </div>
                      <span
                        class="message-creator__variant-remove"
                        @click="deleteCard(i)"
                        v-tooltip.top-center="'Remove card.'"
                      >remove</span>
                    </div>

                    <div style="display: flex;">
                      <div style="width: 50%">
                        <label class="label label--centered">
                          Title
                          <input
                            type="text"
                            v-model="card.title"
                            class="input"
                            @keyup="cardCopyInput(card, 'title')"
                          >
                        </label>
                        <label class="label label--centered">
                          Subtitle
                          <input
                            type="text"
                            v-model="card.subtitle"
                            class="input"
                            @keyup="cardCopyInput(card, 'subtitle')"
                          >
                        </label>
                        <label class="label label--centered">
                          Image
                          <div class="message-creator__image-types">
                            <radio
                              :actual="card.image_type"
                              v-model="card.image_type"
                              val="empty"
                              @click="$forceUpdate(); refreshPreview()"
                            >Empty</radio>
                            <radio
                              :actual="card.image_type"
                              v-model="card.image_type"
                              val="remote"
                              @click="$forceUpdate(); refreshPreview()"
                            >Remote</radio>
                            <radio
                              :actual="card.image_type"
                              v-model="card.image_type"
                              val="upload"
                              @click="$forceUpdate(); refreshPreview(); cardImageFile(`.image-file-input-${i}`, card)"
                            >Upload</radio>
                          </div>
                          <div v-show="card.image_type === 'remote'">
                            <label
                              class="label label--centered"
                              style="font-size: .85em; margin-top: 8px;"
                            >
                              Image URL
                              <input
                                type="text"
                                v-model="card.image_url"
                                class="input"
                                @change="cardImageUrlChange()"
                              >
                            </label>
                          </div>
                          <div v-show="card.image_type === 'upload'">
                            <div style="display: flex; text-align: center;">
                              <checkbox
                                style="margin-top: 4px; font-size: .8em; text-align: center;"
                                v-model="card.fetch_image"
                                :val="card.fetch_image"
                                @click="$forceUpdate()"
                              >Fetch from URL</checkbox>
                              <checkbox
                                style="margin-top: 4px; font-size: .8em; text-align: center;"
                                v-model="card.resize_image"
                                :val="card.resize_image"
                                @click="$forceUpdate()"
                              >Resize</checkbox>
                            </div>
                            <div v-show="card.fetch_image">
                              <label
                                class="label label--centered"
                                style="font-size: .85em; margin-top: 8px;"
                              >
                                Image URL
                                <input
                                  type="text"
                                  v-model="card.image_url"
                                  class="input"
                                  @change="cardImageUrlChange()"
                                >
                              </label>
                            </div>
                            <div v-show="!card.fetch_image">
                              <label
                                class="label label--centered"
                                style="font-size: .85em; margin-top: 8px;"
                              >
                                File
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  class="input"
                                  :class="`image-file-input-${i}`"
                                  @change="cardImageFile(`.image-file-input-${i}`, card)"
                                >
                              </label>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div style="width: 50%">
                        <label class="label label--centered">
                          Buttons
                          <font-awesome-icon
                            v-if="card.buttons.length < 3"
                            @click="addCardBtn(i)"
                            icon="plus"
                            size="xs"
                            class="message-creator__icon"
                            v-tooltip.top-center="'Add button.'"
                            style="margin-left: 3px; font-size: 1em;"
                          />
                          <div
                            class="message-creator__qr-row-wrapper"
                            v-for="(btn, o) in card.buttons"
                            :key="hash(createHashString(o+1, 'card-btn'))"
                          >
                            <div class="label message-creator__label" style="font-size: 0.85em;">
                              <div class="message-creator__label-title">Button {{ o + 1 }}</div>
                              <div class="message-creator__sort-icons">
                                <font-awesome-icon
                                  :class="{ 'sort-icon--disabled': (o === 0) }"
                                  icon="sort-up"
                                  size="lg"
                                  @click="sortBtnOrQr('up', o, card.buttons)"
                                />
                                <font-awesome-icon
                                  :class="{ 'sort-icon--disabled': (o === card.buttons.length - 1) }"
                                  icon="sort-down"
                                  size="lg"
                                  @click="sortBtnOrQr('down', o, card.buttons)"
                                />
                              </div>
                              <span
                                class="message-creator__variant-remove"
                                @click="deleteCardBtn(i, o)"
                                v-tooltip.top-center="'Remove button.'"
                              >remove</span>
                            </div>
                            <div class="message-creator__qr-row" style="font-size: 0.85em;">
                              <label class="label label--centered">
                                Title
                                <input
                                  type="text"
                                  v-model="btn.title"
                                  class="input"
                                  @keyup="QrOrBtnInput(btn)"
                                  @click.prevent
                                >
                              </label>
                              <label class="label label--centered">
                                <div>
                                  <span>Payload / URL</span>
                                  <font-awesome-icon
                                    :class="{ 'message-creator__link-convert--hidden': (!isUrl(btn.payload)) }"
                                    class="message-creator__link-convert"
                                    icon="link"
                                    size="sm"
                                    @click="convertLink(btn)"
                                  />
                                </div>
                                <input
                                  type="text"
                                  v-model="btn.payload"
                                  class="input"
                                  data-prev-value
                                  @focus="btnFocusHandler"
                                  @input="btnInputHandler"
                                  @click.prevent
                                >
                              </label>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xs-4">
                <message-preview :message="langMessage" ref="mCarouselPreview" :type="type"></message-preview>
              </div>
            </div>
            <div v-if="type === 'raw'" style="width: 100%;">
              <div class="col-xs-12">
                <div class="message-creator__column">
                  <h3>JSON</h3>
                  <label class="label label--centered">
                    <textarea
                      v-model="langMessage.raw"
                      class="message-creator__textarea textarea textarea--bordered input"
                      style="width: 100%;"
                      rows="12"
                    ></textarea>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--blue" @click="create">SAVE</div>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import hash from 'object-hash'
import { setTimeout } from 'timers'

export default {
  props: ['active', 'langs', 'message', 'mType', 'id', 'name'],
  data () {
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
          title: 'Button'
        },
        quick_reply: {
          content_type: 'text',
          title: 'QR',
          payload: ''
        },
        card: {
          title: 'Card title',
          subtitle: 'Card subtitle',
          image_type: 'upload',
          fetch_image: false,
          resize_image: false,
          image_url: '',
          image_display_url: '',
          buttons: [{
            type: 'postback',
            payload: '',
            title: 'Button'
          }]
        }
      }
    }
  },

  methods: {
    openDialog () {
      this.$refs.messageDialog.openDialog()
    },

    tabsChange (e) {
      this.activeLang = e
    },

    addButton () {
      for (let lang in this.message) {
        this.message[lang].buttons.push(Object.assign({}, this.elements.button))
      }

      this.$forceUpdate()
      this.refreshPreview()
    },

    deleteBtn (i) {
      for (let lang in this.message) {
        this.message[lang].buttons.splice(i, 1)
      }
      this.$forceUpdate()
      this.refreshPreview()
    },

    addQr () {
      for (let lang in this.message) {
        this.message[lang].quick_replies.push(Object.assign({}, this.elements.quick_reply))
      }

      this.$forceUpdate()
      this.refreshPreview()
    },

    deleteCard (i) {
      for (let lang in this.message) {
        this.message[lang].cards.splice(i, 1)
      }
      this.$forceUpdate()
      this.refreshPreview()
    },

    deleteCardBtn (i, o) {
      for (let lang in this.message) {
        this.message[lang].cards[i].buttons.splice(o, 1)
      }
      this.$forceUpdate()
      this.refreshPreview()
    },

    addCard () {
      for (let lang in this.message) {
        this.message[lang].cards.push(JSON.parse(JSON.stringify(this.elements.card)))
      }

      this.$forceUpdate()
      this.refreshPreview()
    },

    addCardBtn (i) {
      for (let lang in this.message) {
        this.message[lang].cards[i].buttons.push({
          type: 'postback',
          payload: '',
          title: 'Button'
        })
      }
      this.refreshPreview()
      this.$forceUpdate()
    },

    deleteQr (i) {
      for (let lang in this.message) {
        this.message[lang].quick_replies.splice(i, 1)
      }
      this.$forceUpdate()
      this.refreshPreview()
    },

    refreshPreview () {
      if (this.$refs.mPreview2 && this.$refs.mPreview2[0]) this.$refs.mPreview2[0].refresh()
      if (this.$refs.mCarouselPreview && this.$refs.mCarouselPreview[0]) this.$refs.mCarouselPreview[0].refresh()
    },

    addText () {
      for (let lang in this.message) {
        this.message[lang].texts.push('')
      }
      this.$forceUpdate()
    },

    deleteText (i) {
      for (let lang in this.message) {
        this.message[lang].texts.splice(i, 1)
      }
      this.$forceUpdate()
    },

    async create () {
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
        this.$refs.messageDialog.closeDialog()
      } catch (e) {
        this.$refs.messageDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot save!', `An error occured durinig message change request. Error code: ${e.response.status}`, 'error')
      }
    },

    isUrl (str) {
      // eslint-disable-next-line
      const pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/gmi
      return pattern.test(str)
    },

    createHashString (i, c) {
      let els = []
      for (let o = 0; o < i; o++) {
        els.push(c)
      }
      els.push(i)
      return els.join('')
    },

    setProps () {
      for (let lang in this.message) {
        if (!this.message[lang].quick_replies) this.message[lang].quick_replies = [Object.assign({}, this.elements.quick_reply), Object.assign({}, this.elements.quick_reply)]
        if (!this.message[lang].buttons) this.message[lang].buttons = [Object.assign({}, this.elements.button)]
        if (!this.message[lang].raw) this.message[lang].raw = ''
        if (!this.message[lang].texts) this.message[lang].texts = ['']
      }
    },

    QrOrBtnInput (o) {
      const valid = o.title.length < 20
      if (!valid) {
        o.title = o.title.substring(0, 20)
      }
      this.refreshPreview()
      this.$forceUpdate()
    },

    sortBtnOrQr (direction, index, arr) {
      const swapIndex = (direction === 'up') ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex > arr.length - 1) return
      [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]]
      this.$forceUpdate()
      this.refreshPreview()
    },

    btnInputHandler (e) {
      const prev = e.target.dataset.prevValue
      const actual = e.target.value
      e.target.dataset.prevValue = actual
      if (this.isUrl(prev) !== this.isUrl(actual)) this.$forceUpdate()
    },

    btnFocusHandler (e) {
      e.target.dataset.prevValue = e.target.value
    },

    convertLink (btn) {
      if (/\/api\/open_url\?url=.*/.test(btn.payload.replace(window.location.origin, ''))) {
        btn.payload = btn.payload.replace(/^.*\/api\/open_url\?url=/, '')
        this.$forceUpdate()
        return
      }
      btn.payload = `${window.location.origin}/api/open_url?url=${btn.payload}`
      this.$forceUpdate()
    },

    focusTarget (e) { // Safari walk-around
      console.log(e)
      setTimeout(() => {
        e.target.focus()
      }, 1)
    },

    cardImageFile (selector, card) {
      card.image_url = URL.createObjectURL(document.querySelector(selector).files[0])
      this.refreshPreview()
    },

    cardImageUrlChange () {
      this.refreshPreview()
    },

    cardCopyInput (o, key) {
      const valid = o[key].length < 80
      if (!valid) {
        o[key] = o[key].substring(0, 80)
      }
      this.refreshPreview()
      this.$forceUpdate()
    }
  },

  computed: {
    previewData () {
      return {
        type: this.type,
        elements: this.elements
      }
    }
  },

  created () {
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
      if (!this.message[lang].cards) this.message[lang].cards = [Object.assign({}, this.elements.card)]
    }
    this.activeLang = this.langs[0].locale
    this.hash = hash
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.message-creator {
  &__column {
    overflow-y: scroll;
    height: 50vh;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $font-primary;
      border-radius: 2px;
    }
  }

  &__label {
    display: flex;
    align-items: center;

    > .message-creator__label-title {
      white-space: nowrap;
      display: flex;
      align-items: center;
      margin-right: 5px;
    }
  }

  &__textarea {
    resize: vertical;
  }

  &__type {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
  }

  &__variant-remove {
    color: $orange;
    position: relative;
    margin-left: 6px;
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.9em;

    &:hover {
      color: $orange-hover;
    }
  }

  &__sort-icons {
    display: inline-flex;
    margin-left: 5px;
    margin-right: -14px;
    color: $blue;
    cursor: pointer;

    & > * {
      font-size: 28px;

      &:hover {
        color: $blue-hover;
      }
      &:last-child {
        margin-left: -50%;
        margin-top: 2px;
      }
    }

    & > .sort-icon--disabled {
      color: $borders-focus;
    }
  }

  &__qr-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    label {
      width: 45%;
    }
  }

  &__icon {
    color: $blue;
    cursor: pointer;

    &:hover {
      color: $blue-hover;
    }
  }

  &__dialog-container {
    width: 90vw;
    min-width: 1100px;
  }

  &__link-convert {
    color: $blue;
    cursor: pointer;
    margin-left: 4px;
    &--hidden {
      opacity: 0;
      pointer-events: none;
      cursor: default;
    }
  }

  &__image-types {
    display: flex;
    justify-content: center;
    font-size: 0.8em;
    margin-top: 5px;
  }

  &__card {
    padding: 15px 0 10px 0;
    border-bottom: 1px solid $borders-focus;
  }
}

@media only screen and (max-width: 768px) {
  .message-creator {
    &__dialog-container {
      width: 100vw;
      min-width: 0;
    }

    &__column {
      max-height: 65vh;
      width: 95vw;
      margin-bottom: 40px;
    }
  }
}
</style>
