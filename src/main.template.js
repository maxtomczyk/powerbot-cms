// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// eslint-disable-next-line
import regeneratorRuntime from 'babel-regenerator-runtime'
import App from './App'
import router from './vue_router'
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
  MdCheckbox
} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import BotTextRow from '@/components/BotTextRow'
import BotTextField from '@/components/BotTextField'
import BotTextLine from '@/components/BotTextLine'
import CustomMessageCreator from '@/components/CustomMessageCreator'

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

Vue.component('bot-text-row', BotTextRow)
Vue.component('bot-text-field', BotTextField)
Vue.component('bot-text-line', BotTextLine)
Vue.component('message-creator', CustomMessageCreator)

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
