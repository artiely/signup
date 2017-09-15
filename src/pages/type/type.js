import Vue from 'vue'
import App from './type.vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'   // 使用 CSS
import '@/assets/style/cover.less'
import VueI18n from 'vue-i18n'
import Locales from '@/i18n'
import zhLocale from 'iview/dist/locale/zh-CN'
import enLocale from 'iview/dist/locale/en-US'
import api from '@/api'

Vue.use(api)
Vue.use(VueI18n)
Vue.use(iView)
// 设置语言
let lang = window.localStorage.getItem('fwlang')
if (lang && (lang !== 'null' || lang !== 'undefined')) {
  if (lang === 'zh') {
    lang = 'zh-CN'
  } else if (lang === 'en') {
    lang = 'en-US'
  } else {
    lang = 'zh-TW'
  }
} else {
  lang = 'zh-CN'
}
Vue.config.lang = lang

// 多语言配置
const locales = Locales
const mergeZH = Object.assign(zhLocale, locales['zh-CN'])
const mergeEN = Object.assign(enLocale, locales['en-US'])
Vue.locale('zh-CN', mergeZH)
Vue.locale('en-US', mergeEN)

new Vue({
  render: h => h(App)
}).$mount('#app')
