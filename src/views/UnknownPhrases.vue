<template>
<div class="unknown-words view-with-navbar">
  <notifier ref="notifier"></notifier>
  <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="loadError">
    <span>Error occured during data load. Please refresh site or contact an administrator.</span>
    <md-button class="md-primary" @click="loadError = false">close</md-button>
  </md-snackbar>

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
