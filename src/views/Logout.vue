<template>
<div></div>
</template>

<script>
import router from '@/router'
import store from '@/store'
import axios from 'axios'

export default {
  name: 'Logout',
  mounted() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    store.commit('LOGOUT_USER')
    this.$emit('loggedOut')
    axios.defaults.headers.common['Authorization'] = null
    router.push('login')
  }
}
</script>

<style lang="css">
</style>
