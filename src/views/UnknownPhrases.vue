<template>
<div class="unknown-words view-with-navbar">
  <notifier ref="notifier"></notifier>

  <table class="unknown-words__table table">
    <tr>
      <th>Phrase</th>
    </tr>
    <tr v-for="phrase in phrases" :key="phrase.id">
      <td>{{ phrase.phrase }}</td>
    </tr>
  </table>
</div>
</template>

<script>
import axios from 'axios'
import {EventBus} from '../event-bus'

export default {
  data() {
    return {
      phrases: [],
      loadError: false
    }
  },

  methods: {

  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const phrases = await axios.get('/api/phrases')
      this.phrases = phrases.data
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load', `Error occured during data load. Error code: ${e.response.status}`)
    }
  },
  mounted(){
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },
  destroyed(){
    EventBus.$off('token_refresh')
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

  .unknown-words{
    &__table{
      width: 90%;
      margin: 0 auto;
    }
  }
</style>
