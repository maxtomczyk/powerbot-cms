<template>
<div class="md-layout md-gutter md-alignment-center-center loginscreen">
  <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="login_incorrect">
    <span>User credentials incorrect! Please, try again.</span>
    <md-button class="md-primary" @click="login_incorrect = false">close</md-button>
  </md-snackbar>

  <md-card class="md-layout-item md-size-30 md-xsmall-size-100  loginscreen__box">
    <md-card-header class="loginbox__header">
      <img class="loginbox__logo" alt="logo" src="../assets/logo.jpg">
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
  </md-card>
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
.loginscreen {
    width: 97vw;
    height: calc(100vh - 64px);
    // overflow: hidden;

    &__box {
        padding-bottom: 1%;
        margin: 0;
    }
}

.loginbox {
    &__logo {
        width: 60%;
        display: block;
        transition: all 0.3s ease-out;
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 0;
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

@media only screen and (max-width: 600px) {
    .md-layout.md-gutter {
        margin: 0;
    }

    .loginscreen {
        width: 95vw;
        &__box {
            box-shadow: none;
        }
    }
}
</style>
