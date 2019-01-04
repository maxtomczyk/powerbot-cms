// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// eslint-disable-next-line
import regeneratorRuntime from 'babel-regenerator-runtime'

import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import 'flexboxgrid/dist/flexboxgrid.min.css'

import App from '../node_modules/incredbot-cms/src/App.vue'
import router from './vue_router'
import VTooltip from 'v-tooltip'

import CustomMessageCreator from '@/components/CustomMessageCreator'
import UserDefinedViewsLinks from '@/components/UserDefinedViewsLinks'
import Notifier from '@/components/Notifier'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import DrawerItem from '@/components/DrawerItem'
import DrawerListItem from '@/components/DrawerListItem'
import Dialog from '@/components/Dialog'
import CreationButton from '@/components/CreationButton'
import EmptyState from '@/components/EmptyState'
import Tabs from '@/components/Tabs'
import Radio from '@/components/Radio'
import MessagePreview from '@/components/MessagePreview'
import Checkbox from '@/components/Checkbox'

library.add(fas)

Vue.use(VTooltip)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('message-creator', CustomMessageCreator)
Vue.component('custom-links', UserDefinedViewsLinks)
Vue.component('notifier', Notifier)
Vue.component('navbar', Navbar)
Vue.component('drawer', Drawer)
Vue.component('drawer-item', DrawerItem)
Vue.component('drawer-list-item', DrawerListItem)
Vue.component('custom-dialog', Dialog)
Vue.component('creation-button', CreationButton)
Vue.component('empty-state', EmptyState)
Vue.component('tabs', Tabs)
Vue.component('radio', Radio)
Vue.component('message-preview', MessagePreview)
Vue.component('checkbox', Checkbox)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
