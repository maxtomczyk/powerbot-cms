<template>
<div class="message-preview">
  <h3>Preview</h3>
  <!-- {{ JSON.stringify(message) }} -->
  <div class="message-preview__wrapper">
    <div class="message-preview__message-wrapper">
      <div class="message-preview__bubble" :class="(type === 'buttons') ? 'message-preview__bubble--buttons' : ''">
        {{ message.texts[0] }}
      </div>
      <div class="message-preview__buttons" v-show="type === 'buttons'">
        <div class="message-preview__button" v-if="message.buttons[0]" :class="{
          'message-preview__button--only-one': message.buttons.length === 1,
          'message-preview__button--first': message.buttons.length !== 1,
        }">
          {{ message.buttons[0].title }}
        </div>
        <div class="message-preview__button" v-if="message.buttons[1]" :class="{
          'message-preview__button--mid': message.buttons.length === 3,
          'message-preview__button--last': message.buttons.length === 2,
        }">
          {{ message.buttons[1].title }}
        </div>
        <div class="message-preview__button message-preview__button--last" v-if="message.buttons[2]">
          {{ message.buttons[2].title }}
        </div>
      </div>
      <div class="message-preview__quick-replies" v-show="type === 'quick_replies'">
        <div class="message-preview__qr" v-for="(qr, i) in message.quick_replies" :key="i">
          {{qr.title}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['message', 'type'],
  methods: {
    refresh() {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
.message-preview {
    // background-color: white;

    &__wrapper {
        position: relative;
        margin: 30px auto;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        width: 70%;
        padding: 30px 0;
        border-radius: 5px;
        background-color: #FFF;
        -webkit-box-shadow: 3px 3px 12px -7px rgba(0,0,0,0.75);
        -moz-box-shadow: 3px 3px 12px -7px rgba(0,0,0,0.75);
        box-shadow: 3px 3px 12px -7px rgba(0,0,0,0.75);
    }

    &__message-wrapper {
        max-width: 75%;
    }

    &__bubble {
        position: relative;
        background-color: #F1F0F0;
        padding: 6px 12px;
        max-width: 100%;
        color: #000;
        font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
        font-size: 16px;
        border-radius: 1.3em;

        &--buttons {
            border-bottom-left-radius: 4px;
            margin-bottom: 3px;
        }
    }

    &__buttons {
        min-width: 250px;
    }

    &__button {
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
        font-weight: 500;
        color: #0084FF;
        padding: 4px;
        background-color: #FFF;

        &--only-one {
            border-radius: 1.3em;
            border-top-left-radius: 4px;

        }

        &--first {
            border-top-right-radius: 1.3em;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }

        &--mid {
            border-top: none;
            border-radius: 0;
        }

        &--last {
            border-bottom-right-radius: 1.3em;
            border-bottom-left-radius: 1.3em;
            border-top-right-radius: 0;
            border-top-left-radius: 0;
            border-top: none;
        }
    }

    &__quick-replies{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      width: 100%;
      flex-wrap: wrap;
    }

    &__qr{
      font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #0084ff;
      padding: 4px 12px;
      border: 1px solid #0084ff;
      border-radius: 1.3em;
      margin: 2px 4px;
    }
}
</style>
