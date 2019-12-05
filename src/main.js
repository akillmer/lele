import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import {
  faClipboardCheck,
  faExclamation
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

axios.defaults.baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://lele.to'
    : 'http://localhost:9000'

Vue.prototype.$http = axios

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faGithub, faLinkedinIn, faCopy, faClipboardCheck, faExclamation)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
