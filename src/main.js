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
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象 添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
Vue.component('TreeTable', ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
