import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLogged: !!localStorage.getItem('token')
}

const mutations = {
  LOGIN_USER (userState) {
    // eslint-disable-next-line
    userState.isLogged = true
  },

  LOGOUT_USER (userState) {
    // eslint-disable-next-line
    userState.isLogged = false
  }
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations
})
