<template>
<div class="dashboard view-with-navbar">
  <notifier ref="notifier"></notifier>

</div>
</template>

<script>
import axios from 'axios'
import {EventBus} from '../event-bus'

export default {
  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `An error occured during data load. Error code: ${e.response.status}`, 'error', 10000)
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
</style>
