// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// eslint-disable-next-line
import regeneratorRuntime from 'babel-regenerator-runtime'

import {
  library
} from '../node_modules/incredbot-cms/node_modules/@fortawesome/fontawesome-svg-core'

import {
  fas
} from '../node_modules/incredbot-cms/node_modules/@fortawesome/free-solid-svg-icons'

import {
  FontAwesomeIcon
} from '../node_modules/incredbot-cms/node_modules/@fortawesome/vue-fontawesome'

import App from '../node_modules/incredbot-cms/src/App.vue'
import router from './vue_router'
import VTooltip from '../node_modules/incredbot-cms/node_modules/v-tooltip'

import {
  MdField,
  MdButton,
  MdContent,
  MdTabs,
  MdCard,
  MdApp,
  MdSnackbar,
  MdDrawer,
  MdToolbar,
  MdList,
  MdTable,
  MdSpeedDial,
  MdDialog,
  MdAvatar,
  MdRipple,
  MdEmptyState,
  MdMenu,
  MdRadio,
  MdCheckbox,
  MdDivider
} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import BotTextRow from '@/components/BotTextRow'
import BotTextField from '@/components/BotTextField'
import BotTextLine from '@/components/BotTextLine'
import CustomMessageCreator from '@/components/CustomMessageCreator'
import UserDefinedViewsLinks from '@/components/UserDefinedViewsLinks'
import Notifier from '@/components/Notifier'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import DrawerItem from '@/components/DrawerItem'
import DrawerListItem from '@/components/DrawerListItem'

library.add(fas)

Vue.use(VTooltip)
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
Vue.use(MdCard)
Vue.use(MdField)
Vue.use(MdApp)
Vue.use(MdSnackbar)
Vue.use(MdDrawer)
Vue.use(MdToolbar)
Vue.use(MdList)
Vue.use(MdTable)
Vue.use(MdSpeedDial)
Vue.use(MdDialog)
Vue.use(MdAvatar)
Vue.use(MdRipple)
Vue.use(MdEmptyState)
Vue.use(MdMenu)
Vue.use(MdRadio)
Vue.use(MdCheckbox)
Vue.use(MdDivider)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('bot-text-row', BotTextRow)
Vue.component('bot-text-field', BotTextField)
Vue.component('bot-text-line', BotTextLine)
Vue.component('message-creator', CustomMessageCreator)
Vue.component('custom-links', UserDefinedViewsLinks)
Vue.component('notifier', Notifier)
Vue.component('navbar', Navbar)
Vue.component('drawer', Drawer)
Vue.component('drawer-item', DrawerItem)
Vue.component('drawer-list-item', DrawerListItem)

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
