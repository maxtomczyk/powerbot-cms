import Vue from 'vue'
import Router from 'vue-router'
import Guard from '../node_modules/powerbot-cms/src/auth-guard/middleware'
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
import Attachments from '@/views/Attachments'
import Elements from '@/views/Elements'
import Clicks from '@/views/Clicks'

import axios from 'axios'

Vue.use(Router)

let router = new Router({
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
    path: '/attachments',
    name: 'Attachments',
    component: Attachments,
    beforeEnter: Guard.auth
  }, {
    path: '/elements',
    name: 'Bot Elements',
    component: Elements,
    beforeEnter: Guard.auth
  }, {
    path: '/clicks',
    name: 'Clicks',
    component: Clicks,
    beforeEnter: Guard.auth
  }, {
    path: '*',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: Guard.auth
  }]
})

router.beforeEach(async (to, from, next) => {
  try {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    const basics = ['Login', 'Logout', 'Dashboard', 'Admins']
    if (basics.indexOf(to.name) !== -1) return next()
    const adminViewsReq = await axios.get('/api/admins/views')
    const adminViews = adminViewsReq.data
    if (adminViews.indexOf(to.name) === -1) return next(from.path)
    next()
  } catch (e) {
    console.error(e)
  }
})

export default router
