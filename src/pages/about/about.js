import Vue from 'vue'
import App from './about.vue'

import iView from 'iview'
import api from '@/api'
Vue.use(api)
Vue.use(iView)

new Vue({
  render: h => h(App)
}).$mount('#app')
