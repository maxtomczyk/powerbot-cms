<template>
<div class="dialog__wrapper" v-show="active">
  <div class="dialog__overlay" :class="{'dialog__overlay--hiding': hiding}" @click="closeDialog()">
    <div class="dialog" @click="$event.stopPropagation()">
      <div class="dialog__header">
        <slot name="custom-dialog-header" class="dialog__header"></slot>
      </div>
      <div class="dialog__content">
        <slot name="custom-dialog-content"></slot>
      </div>
      <div class="dialog__buttons">
        <div class="dialog__button" @click="closeDialog">
          CLOSE
        </div>
        <slot name="custom-dialog-buttons"></slot>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      hiding: true
    }
  },

  methods: {
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    async closeDialog() {
      document.querySelector('body').classList.remove('noscroll')
      this.hiding = true
      await this.delay(300)
      this.active = false
      this.$emit('closed')
    },

    async openDialog() {
      document.querySelector('body').classList.add('noscroll')
      this.active = true
      await this.delay(20)
      this.hiding = false
      this.$emit('opened')
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.dialog {
    background-color: $bg-primary;
    color: $font-primary;
    padding: 0.5% 2% 1%;
    -webkit-box-shadow: 3px 3px 12px -7px rgba(0,0,0,0.75);
    -moz-box-shadow: 3px 3px 12px -7px rgba(0,0,0,0.75);
    box-shadow: 3px 3px 12px -7px rgba(0,0,0,0.75);

    &--no-header-margin {
        .dialog__header {
            margin-bottom: 0;
        }
    }

    &--no-overflow {
        .dialog__content {
            overflow-y: hidden;
        }
    }

    &__header {
        margin-bottom: 32px;
    }

    &__wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 100;
    }

    &__title {
        font-size: 2em !important;
        color: white;
    }

    &__overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .45);
        transition: opacity 0.2s ease;
        will-change: opacity;
        opacity: 1;

        &--hiding {
            opacity: 0;
        }
    }

    &__content {
        overflow-x: hidden;
        overflow-y: scroll;
        // max-height: 80vh;

        &::-webkit-scrollbar {
            width: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: $font-primary;
            border-radius: 2px;
        }
    }

    &__buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 20px;
        padding-bottom: 3px;
    }

    &__button {
        font-weight: 700;
        font-size: 1.1em;
        margin-left: 20px;
        cursor: pointer;

        &--blue {
            color: $blue;
        }

        &--orange {
            color: $orange;
        }

        &--green {
            color: $green;
        }
    }
}

@media only screen and (max-width: 768px) {
    .dialog {
        height: 100vh;
        width: 100vw;

        &--no-overflow {
            .dialog__content {
                overflow-y: scroll;
            }
        }

        &__buttons {
            position: absolute;
            width: calc(100% - 10px);
            bottom: 20px;
            padding-right: 10px;
        }

        &__content {
            max-height: 78vh;
        }
    }
}
</style>
