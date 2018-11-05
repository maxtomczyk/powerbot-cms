import Vue from 'vue'
import Router from 'vue-router'
import Guard from '../node_modules/incredbot-cms/src/auth-guard/middleware'
import Login from '@/views/Login'
import Logout from '@/views/Logout'
import Dashboard from '@/views/Dashboard'
import Admins from '@/views/Admins'
import ChatRequests from '@/views/ChatRequests'
import Messages from '@/views/Messages'
import CustomPostbacks from '@/views/CustomPostbacks'
import UnknownPhrases from '@/views/UnknownPhrases'
import Emissions from '@/views/Emissions'
import Keywords from '@/views/Keywords'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: Guard.guest
  }, {
    path: '/logout',
    name: 'Logout',
    component: Logout
  }, {
    path: '/admins',
    name: 'Admins',
    component: Admins,
    beforeEnter: Guard.auth
  }, {
    path: '/chats',
    name: 'Chat Requests',
    component: ChatRequests,
    beforeEnter: Guard.auth
  }, {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    beforeEnter: Guard.auth
  }, {
    path: '/postbacks',
    name: 'Custom Postbacks',
    component: CustomPostbacks,
    beforeEnter: Guard.auth
  }, {
    path: '/unknown_phrases',
    name: 'Unknown phrases',
    component: UnknownPhrases,
    beforeEnter: Guard.auth
  }, {
    path: '/emissions',
    name: 'Message broadcast',
    component: Emissions,
    beforeEnter: Guard.auth
  }, {
    path: '/keywords',
    name: 'Custom keywords',
    component: Keywords,
    beforeEnter: Guard.auth
  }, {
    path: '*',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: Guard.auth
  }]
})
