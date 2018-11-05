<template>
<div class="">

</div>
</template>

<script>
import axios from 'axios'

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
  }
}
</script>

<style lang="scss">
</style>
