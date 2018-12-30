<template>
<div class="login">
  <div class="login__container container">
    <div class="row login__boxwrapper center-xs middle-xs">
      <div class="login__loginbox col-md-3 col-xs-12">
        <h1 class="login__logo">incredibot</h1>
        <input class="login__input input" placeholder="Login" type="text" v-model="user.login" @keyup="loginKeyUp($event)">
        <input class="login__input input" placeholder="Password" type="password" v-model="user.password" @keyup="loginKeyUp($event)">
        <div class="button login__button center" @click="auth()">Enter</div>
      </div>
    </div>
  </div>
  <!-- <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="login_incorrect">
    <span>User credentials incorrect! Please, try again.</span>
    <md-button class="md-primary" @click="login_incorrect = false">close</md-button>
  </md-snackbar>

  <md-card class="md-layout-item md-size-30 md-xsmall-size-100  loginscreen__box">
    <md-card-header class="loginbox__header">

    </md-card-header>
    <md-card-content>
      <md-field>
        <label>Login</label>
        <md-input v-model="user.login" @keyup="loginKeyUp($event)"></md-input>
      </md-field>
      <md-field>
        <label>Password</label>
        <md-input type="password" v-model="user.password" @keyup="loginKeyUp($event)"></md-input>
      </md-field>
    </md-card-content>
    <md-card-actions>
      <md-button class="md-raised md-primary" @click="auth()">Log in</md-button>
    </md-card-actions>
  </md-card> -->

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
          document.querySelector('.loginbox__logo').classList.add('e401')
          setTimeout(() => {
            document.querySelector('.loginbox__logo').classList.remove('e401')
          }, 850)
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
        margin: 8px 0;
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
</style>
