<template>
<div class="login">
  <notifier ref="notifier"></notifier>
  <div class="login__container container">
    <div class="row login__boxwrapper center-xs middle-xs">
      <div class="login__loginbox col-md-3 col-xs-12">
        <h1 class="login__logo">incredbot</h1>
        <input class="login__input input" placeholder="Login" type="text" v-model="user.login" @keyup="loginKeyUp($event)">
        <input class="login__input input" placeholder="Password" type="password" v-model="user.password" @keyup="loginKeyUp($event)">
        <div class="button login__button center" @click="auth()">Enter</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import store from '@/store'

export default {
  name: 'Login',
  data() {
    return {
      login_incorrect: false,
      user: {
        login: '',
        password: ''
      }
    }
  },

  methods: {
    async auth() {
      try {
        let auth = await axios.post('/api/auth', this.user)
        localStorage.setItem('token', auth.data.token)
        localStorage.setItem('user', auth.data.user)
        store.commit('LOGIN_USER')
        this.$emit('logged')
        router.push('/')
      } catch (e) {
        if (e.response.status === 401) {
          this.login_incorrect = true
          this.$refs.notifier.pushNotification('cannot login', 'Username and password combination is incorrect, please try again', 'warning')
          document.querySelector('.login__logo').classList.add('e401')
          setTimeout(() => {
            document.querySelector('.login__logo').classList.remove('e401')
          }, 850)
        } else {
          this.$refs.notifier.pushNotification('internal error', 'Internal error occured. Check dev console and/or contact maintainer.', 'error')
        }
      }
    },

    loginKeyUp(e) {
      if (e.key === 'Enter') this.auth()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.login {
    background-image: $dark-gradient;
    width: 100vw;
    height: 100vh;

    &__container {
        height: 100vh !important;
        width: 100%;
        padding: 0 !important;
    }

    &__boxwrapper {
        height: 100%;
        width: 100vw;
        margin: 0;
    }

    &__input {
        width: 72%;
        margin: 8px auto;
        font-size: 1.2em;
    }

    &__logo{
      font-family: 'Major Mono Display', monospace;
      color: white;
    }

    &__button{
      width: 72%;
      margin-top: 25px;
      background-color: $green;
      color: #FFF;
      font-weight: bold;

      &:hover{
        background-color: $green-hover;
      }
    }
}

.e401 {
    position: relative;
    animation-name: logo401;
    animation-duration: 0.8s;
}

@keyframes logo401 {
    41%,
    8% {
        -webkit-transform: translateX(-10px);
    }
    25%,
    58% {
        -webkit-transform: translateX(10px);
    }
    75% {
        -webkit-transform: translateX(-5px);
    }
    92% {
        -webkit-transform: translateX(5px);
    }
    0%,
    100% {
        -webkit-transform: translateX(0);
    }
}
</style>
