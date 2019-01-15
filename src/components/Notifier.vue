<template>
<div class="notifier">
  <div class="notifier__container container">
    <div class="row end-md center-xs notifier__row">
      <div class="notifier__wrapper col-md-12 col-xs-12">
        <div @click="removeNotification(n.timestamp)" class="notification" :class="[`notification--${n.type}`, (n.removing) ? 'notification--removing' : '', (n.justCreated) ? 'notification--fresh' : '']" v-for="n in notifications" :key="n.timestamp">
          <div class="notification__content">
            <h3 class="notification__title">{{ n.title.toUpperCase() }}</h3>
            <p class="notification__text">{{ n.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      notifications: []
    }
  },

  methods: {
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    async pushNotification(title, text, type, time) {
      const timestamp = +new Date()
      time = time || 8000

      let notification = {
        type,
        title,
        text,
        timestamp,
        removing: false,
        justCreated: true
      }

      this.notifications.push(notification)
      await this.delay(200)

      this.notifications.map((not, i) => {
        if (not.timestamp === timestamp) not.justCreated = false
      })
      await this.delay(time - 700)
      this.removeNotification(timestamp)
    },

    async removeNotification(ts) {
      this.notifications.map((not, i) => {
        if (not.timestamp === ts) not.removing = true
      })
      await this.delay(500)
      this.notifications.map((not, i) => {
        if (not.timestamp === ts) this.notifications.splice(i, 1)
      })
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.notifier {
    position: fixed;
    top: 0;
    max-height: 0;
    width: 100vw;
    z-index: 200;

    &__row {
        position: fixed;
        right: 40px;
        width: 20%;
    }

    &__container {
        position: absolute;
        right: 8px;
        width: calc(100% - 16px);
        padding: 0;
        height: 0;
        max-height: 0;
    }

    &__wrapper {
        display: flex;
        flex-direction: column-reverse;
    }
}

.notification {
    background-color: $error;
    text-align: left;
    padding: 1px 15px;
    margin: 10px auto 2px 0;
    transition: opacity 0.25s ease, margin-left 0.4s ease, margin-top 0.4s ease;
    will-change: opacity, margin-left, margin-top;
    border-radius: 8px;
    opacity: 0.6;
    width: 100%;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }

    &__content {
        color: white;
        will-change: opacity;
    }

    &__title {
        // font-family: 'Major Mono Display', monospace;
        font-size: 1.4em;
        margin-bottom: 0;
    }

    &__text {}

    &--removing {
        margin-left: 200%;
    }

    &--fresh {
        margin-top: -130px;
        margin-bottom: 20px;
    }

    &--error {
        background-color: $error;
    }

    &--warning {
        background-color: $warning;
    }

    &--info {
        background-color: $info;
    }

    &--success {
        background-color: $success;
    }
}

@media only screen and (max-width: 768px) {
    .notifier {
        &__row{
          width: calc(100% - 16px);
          position: static;
          margin-top: -40px;
        }
    }

    .notification:last-of-type{
      margin-top: 50px;
    }
}
</style>
