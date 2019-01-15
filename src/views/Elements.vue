<template>
<div class="elements view-with-navbar">
  <notifier ref="notifier"></notifier>
  <div class="view-actions">
    <div class="button button--blue" @click="saveAll">
      <span>Save all</span>
      <font-awesome-icon icon="save" class="button__icon" />
    </div>
    <div class="button button--blue" :class="(unsyncedN) ? '' : 'button--disabled'" @click="syncAll">
      <span>Sync all</span>
      <font-awesome-icon icon="sync-alt" class="button__icon" />
    </div>
  </div>
  <div class="elements__wrapper">
    <div class="container" style="width: 100%; height: 100%;">
      <div class="row" style="height: 100%;">
        <div class="col-xs-12 col-md-6">
          <div class="elements__card" style="height: 100%;">
            <div class="elements__card-header">
              <h3>BOT MENU</h3>
              <div class="elements__card-check" :class="(menu.force_update) ? 'elements__card-check--orange' : 'elements__card-check--green'"></div>
            </div>
            <textarea class="textarea textarea--bordered input" v-model="menu.json"></textarea>
          </div>
        </div>
        <div class="col-xs-12 col-md-6">
          <div class="elements__card">
            <div class="elements__card-header">
              <h3>GET STARTED BUTTON</h3>
              <div class="elements__card-check" :class="(getStartedPayload.force_update) ? 'elements__card-check--orange' : 'elements__card-check--green'"></div>
            </div>
            <label class="label" style="width: 70%; margin-left: 6px; font-size: 1em;">Button payload
              <input type="text" class="input" v-model="getStartedPayload.value">
            </label>
          </div>
          <div class="elements__card">
            <div class="elements__card-header">
              <h3>GREETING TEXT</h3>
              <div class="elements__card-check" :class="(greeting.force_update) ? 'elements__card-check--orange' : 'elements__card-check--green'"></div>
            </div>
            <textarea class="textarea textarea--bordered input" v-model="greeting.value" style="height: 75px;"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {
  EventBus
} from '../event-bus'

export default {
  data() {
    return {
      menu: {
        json: '',
        force_update: false
      },
      getStartedPayload: {
        value: '',
        force_update: false
      },
      greeting: {
        value: '',
        force_update: false
      },
      unsyncedN: 0
    }
  },

  methods: {
    async syncAll() {
      try {
        await axios.post('/api/elements/sync')
        this.menu.force_update = false
        this.getStartedPayload.force_update = false
        this.greeting.force_update = false
        this.unsyncedN = 0
        this.$refs.notifier.pushNotification(`syced!`, 'All static elements are now synced!', 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during sync. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async saveAll() {
      try {
        const updated = await axios.post('/api/elements/save', {
          menu: this.menu,
          getStartedPayload: this.getStartedPayload,
          greeting: this.greeting
        })

        for (let element of updated.data) {
          if (element.force_update) this.unsyncedN++

          if (element.name === 'menu') this.menu = element
          else if (element.name === 'get_started_payload') this.getStartedPayload = element
          else if (element.name === 'hello') this.greeting = element
        }

        this.menu.json = JSON.stringify(this.menu.json, null, 4)
        this.$refs.notifier.pushNotification(`saved!`, 'All changes has been saved!', 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during save. Error code: ${e.response.status}`, 'error', 10000)
      }
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const elements = await axios.get('/api/elements/list')

      for (let element of elements.data) {
        if (element.force_update) this.unsyncedN++

        if (element.name === 'menu') this.menu = element
        else if (element.name === 'get_started_payload') this.getStartedPayload = element
        else if (element.name === 'hello') this.greeting = element
      }

      this.menu.json = JSON.stringify(this.menu.json, null, 4)
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `An error occured during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  },
  mounted() {
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },
  destroyed() {
    EventBus.$off('token_refresh')
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.elements {
    height: 80vh;
    color: $font-primary;

    &__wrapper {
        width: 90%;
        height: 100%;
        margin: 0 auto;
    }

    &__card {
        background-color: $bg-accent;
        padding: 20px;
        margin-bottom: 15px;
        -webkit-box-shadow: 0 1px 11px -2px rgba(0,0,0,0.75);
        -moz-box-shadow: 0 1px 11px -2px rgba(0,0,0,0.75);
        box-shadow: 0 1px 11px -2px rgba(0,0,0,0.75);

        h3 {
            color: $font-primary;
            margin: 0 15px 0 0;
        }

        textarea {
            height: 90%;
            resize: none;

            &::-webkit-scrollbar {
                width: 2px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: $font-primary;
                border-radius: 2px;
            }
        }
    }

    &__card-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 15px;
    }

    &__card-check {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &--orange {
            background-color: $error;
        }

        &--green {
            background-color: $success;
        }
    }
}
</style>
