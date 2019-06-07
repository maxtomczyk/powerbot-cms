<template>
  <div class="message-preview">
    <h3>Preview</h3>
    <div class="message-preview__wrapper">
      <div
        class="message-preview__wrapper-overlay"
        v-show="type === 'carousel' && message.cards.length > 1"
      >
        <div class="message-preview__wrapper-overlay-side" @click="swipeCarousel(1)">
          <font-awesome-icon
            class="message-preview__wrapper-overlay-icon"
            icon="chevron-left"
            size="3x"
          />
        </div>
        <div class="message-preview__wrapper-overlay-divider"></div>
        <div class="message-preview__wrapper-overlay-side" @click="swipeCarousel(-1)">
          <font-awesome-icon
            class="message-preview__wrapper-overlay-icon"
            icon="chevron-right"
            size="3x"
          />
        </div>
      </div>
      <div class="message-preview__message-wrapper" v-if="type === 'carousel'" style="width: 100%;">
        <div class="message-preview__carousel" ref="carousel">
          <div
            class="message-preview__carousel-card"
            v-for="(card, i) in message.cards"
            :key="`${card.title}${i}`"
          >
            <div class="message-preview__card-image-wrapper" v-show="card.image_type !== 'empty'">
              <div
                class="message-preview__card-image"
                :class="{'message-preview__card-image--square': message.settings.aspect_ratio === 'square'}"
                :style="`background: url(${card.image_url})`"
              ></div>
            </div>
            <div class="message-preview__card-texts">
              <div class="message-preview__card-title" v-show="card.title.length">{{ card.title }}</div>
              <div
                class="message-preview__card-subtitle"
                v-show="card.subtitle.length"
              >{{ card.subtitle }}</div>
            </div>
            <div class="message-preview__buttons">
              <div
                class="message-preview__button"
                v-if="card.buttons[0]"
                :class="{
          'message-preview__button--only-one': card.buttons.length === 1,
          'message-preview__button--first': card.buttons.length !== 1,
        }"
              >{{ card.buttons[0].title }}</div>
              <div
                class="message-preview__button"
                v-if="card.buttons[1]"
                :class="{
          'message-preview__button--mid': card.buttons.length === 3,
          'message-preview__button--last': card.buttons.length === 2,
        }"
              >{{ card.buttons[1].title }}</div>
              <div
                class="message-preview__button message-preview__button--last"
                v-if="card.buttons[2]"
              >{{ card.buttons[2].title }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="message-preview__message-wrapper" v-else>
        <div
          class="message-preview__bubble"
          :class="(type === 'buttons') ? 'message-preview__bubble--buttons' : ''"
        >{{ message.texts[0] }}</div>
        <div class="message-preview__buttons" v-show="type === 'buttons'">
          <div
            class="message-preview__button"
            v-if="message.buttons[0]"
            :class="{
          'message-preview__button--only-one': message.buttons.length === 1,
          'message-preview__button--first': message.buttons.length !== 1,
        }"
          >{{ message.buttons[0].title }}</div>
          <div
            class="message-preview__button"
            v-if="message.buttons[1]"
            :class="{
          'message-preview__button--mid': message.buttons.length === 3,
          'message-preview__button--last': message.buttons.length === 2,
        }"
          >{{ message.buttons[1].title }}</div>
          <div
            class="message-preview__button message-preview__button--last"
            v-if="message.buttons[2]"
          >{{ message.buttons[2].title }}</div>
        </div>
        <div class="message-preview__quick-replies" v-show="type === 'quick_replies'">
          <div
            class="message-preview__qr"
            v-for="(qr, i) in message.quick_replies"
            :key="i"
          >{{qr.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message', 'type'],
  methods: {
    refresh () {
      this.$forceUpdate()
    },

    swipeCarousel (n) {
      const carousel = this.$refs.carousel
      const min = 0
      const max = this.message.cards.length * -103 + 103
      carousel.style.marginLeft = (carousel.style.marginLeft === '') ? '0%' : carousel.style.marginLeft
      if (parseInt(carousel.style.marginLeft.replace('%', '')) === min && n > 0) return
      if (parseInt(carousel.style.marginLeft.replace('%', '')) === max && n < 0) return
      carousel.style.marginLeft = `${parseInt(carousel.style.marginLeft.replace('%', '')) + 103 * n}%`
    }
  }
}
</script>

<style lang="scss">
.message-preview {
  &__wrapper {
    position: relative;
    margin: 30px auto;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 70%;
    padding: 30px 0;
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
    -webkit-box-shadow: 3px 3px 12px -7px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 3px 3px 12px -7px rgba(0, 0, 0, 0.75);
    box-shadow: 3px 3px 12px -7px rgba(0, 0, 0, 0.75);
  }

  &__wrapper-overlay {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-around;

    &:hover {
      opacity: 1;
    }
  }

  &__wrapper-overlay-icon {
    display: block;
    color: #fff;
  }

  &__wrapper-overlay-divider {
    height: 100%;
    width: 1px;
    background: #fff;
  }

  &__wrapper-overlay-side {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__message-wrapper {
    max-width: 75%;
  }

  &__bubble {
    position: relative;
    background-color: #f1f0f0;
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
    min-width: 210px;
  }

  &__button {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    text-align: center;
    font-size: 16px;
    font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
    font-weight: 500;
    color: #0084ff;
    padding: 4px;
    background-color: #fff;

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

  &__quick-replies {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
    flex-wrap: wrap;
  }

  &__qr {
    font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
    font-size: 16px;
    color: #0084ff;
    padding: 4px 12px;
    border: 1px solid #0084ff;
    border-radius: 1.3em;
    margin: 2px 4px;
  }

  &__card-image {
    width: 100%;
    padding-bottom: 52.36%;
    background-position: center !important;
    background-size: cover !important;
    border-top-left-radius: 1.3em;
    border-top-right-radius: 1.3em;

    &--square{
      padding-bottom: 100%;
    }
  }

  &__card-image-wrapper {
    border: 1px solid #e5e5e5;
    border-bottom: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &__card-texts {
    font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
    border: 1px solid #e5e5e5;
    padding: 6px 12px 15px 12px;
    min-height: 70px;
    font-size: 16px;
  }

  &__card-title {
    font-weight: 600;
    color: black;
  }

  &__carousel {
    display: flex;
    align-items: center;
    width: 100%;
    margin-left: 0px;
    transition: margin-left .2s ease;
  }

  &__carousel-card {
    width: 100%;
    flex-shrink: 0;
    margin-right: 3%;

    .message-preview__button {
      padding: 6px 0;
      border-radius: 0;

      &--only-one {
        border-top: none;
        border-radius: 0 0 4px 4px;
      }

      &--first {
        border-top: none;
      }

      &--last {
        border-radius: 0 0 4px 4px;
      }
    }
  }
}
</style>
