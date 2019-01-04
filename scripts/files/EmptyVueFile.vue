<template>
<div class="">

</div>
</template>

<script>
import axios from 'axios'
import {EventBus} from '../event-bus'

export default {
  data() {
    return {

    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

    } catch (e) {

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
</style>
