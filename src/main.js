import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './main.css'
// 导入全局样式
import './assets/css/globle.css'
// 导入axios
import axios from 'axios'
// 第三方表格组件
import ZkTable from 'vue-table-with-tree-grid'
// 第三方富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
// 样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象 添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

// 配置表格
Vue.component('TreeTable', ZkTable)
Vue.config.productionTip = false

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

// 格式化日期
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
