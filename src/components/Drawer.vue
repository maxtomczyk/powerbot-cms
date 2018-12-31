<template>
<div class="drawer__component">
  <div class="drawer__container container">
    <div class="row">
      <div class="drawer col-md-4 col-lg-3 col-xs-9" :class="{'drawer--closed': !opened}">
        <div class="drawer__items">
          <drawer-item icon="home" target="/" @clicked="close()">dashboard</drawer-item>
          <drawer-item icon="comments" target="/messages" @clicked="close()">content</drawer-item>
          <drawer-item icon="user-clock" target="/chats" @clicked="close()">chat requests</drawer-item>
          <drawer-item icon="atlas" target="/keywords" @clicked="close()">keywords</drawer-item>
          <drawer-item icon="expand-arrows-alt" target="/postbacks" @clicked="close()">postbacks</drawer-item>
          <drawer-item icon="question" target="/unknown_phrases" @clicked="close()">new phrases</drawer-item>
          <drawer-item icon="broadcast-tower" target="/emissions" @clicked="close()">emissions</drawer-item>
          <drawer-item icon="user-shield" target="/admins" @clicked="close()">admins</drawer-item>
          <drawer-item icon="sign-out-alt" target="/logout" @clicked="close()">log out</drawer-item>
        </div>

        <div class="drawer__list">
          <drawer-list-item icon="home" target="/" @clicked="close()">dashboard</drawer-list-item>
          <drawer-list-item icon="comments" target="/messages" @clicked="close()">content</drawer-list-item>
          <drawer-list-item icon="user-clock" target="/chats" @clicked="close()">chat requests</drawer-list-item>
          <drawer-list-item icon="atlas" target="/keywords" @clicked="close()">keywords</drawer-list-item>
          <drawer-list-item icon="expand-arrows-alt" target="/postbacks" @clicked="close()">postbacks</drawer-list-item>
          <drawer-list-item icon="question" target="/unknown_phrases" @clicked="close()">new phrases</drawer-list-item>
          <drawer-list-item icon="broadcast-tower" target="/emissions" @clicked="close()">emissions</drawer-list-item>
          <drawer-list-item icon="user-shield" target="/admins" @clicked="close()">admins</drawer-list-item>
          <drawer-list-item icon="sign-out-alt" target="/logout" @clicked="close()">log out</drawer-list-item>
        </div>

        <div class="drawer__footer">
          <h2 class="drawer__footer-logo">incredbot cms</h2>
          <span class="drawer__footer-info">version 0.3.0</span>
        </div>
      </div>
      <div v-if="opened" class="drawer__overlay col-md-8 col-lg-9 col-xs-3" @click="close()"></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      opened: false
    }
  },

  methods: {
    open() {
      this.opened = true
      this.$emit('opened')
    },

    close() {
      this.opened = false
      this.$emit('closed')
    },

    toggle() {
      if (this.opened) this.close()
      else this.open()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.drawer {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: $bg-accent;
    z-index: 10;
    -webkit-box-shadow: 1px 1px 14px -2px rgba(0,0,0,0.75);
    -moz-box-shadow: 1px 1px 14px -2px rgba(0,0,0,0.75);
    box-shadow: 1px 1px 14px -2px rgba(0,0,0,0.75);
    left: 0;
    transition: left 0.5s ease;
    will-change: left;
    padding-top: 70px;
    padding-left: 0;
    padding-right: 0;

    &--closed {
        left: -100vw;
    }

    &__row {
        background-color: red;
    }

    &__overlay {
        position: fixed;
        height: 100vh;
        width: 100vw;
        right: 0;
        z-index: 10;
    }

    &__container {
        position: absolute;
        left: 8px;
        width: 100vw;
        padding: 0;
    }

    &__items {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-columns: 1fr;
        padding: 15px 12px;
        grid-row-gap: 40px;
        max-height: 86vh;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: $font-primary;
            border-radius: 2px;
        }

    }

    &__list {
        max-height: 90%;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: $font-primary;
            border-radius: 2px;
        }
    }

    &__footer {
        text-align: center;
        position: absolute;
        bottom: 2px;
        width: 100%;
    }

    &__footer-logo {
        font-family: 'Major Mono Display', monospace;
        font-size: 1.1em;
        color: #fff;
        margin-bottom: 0;
    }

    &__footer-info {
        color: $font-primary;
        display: block;
        font-family: 'Major Mono Display', monospace;
        font-size: 0.6em;
        font-style: italic;
        margin-top: -3px;
    }
}

@media only screen and (max-width: 768px) {
    .drawer__items {
        display: none;
    }
}

@media only screen and (min-width: 769px) {
    .drawer__list {
        display: none;
    }
}

@media only screen and (max-height: 800px) and (min-width: 700px) {
    .drawer__footer {
        display: none;
    }
}
</style>
