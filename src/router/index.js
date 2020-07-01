import Vue from 'vue'
import Router from 'vue-router'
// 登录组件
import Login from '../components/Login.vue'
// 首页组件
import Home from '../components/Home.vue'
// 欢迎组件
import Welcome from '@/components/Welcome'
// 用户列表组件
import User from '@/components/User/User'
// 角色列表组件
import Role from '@/components/power/Role'
// 权限列表组件
import Rights from '@/components/power/Rights'
// 商品分类组件
import GoodsCate from '@/components/goods/Goods_cate'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Role },
        { path: '/categories', component: GoodsCate }
      ]
    }
  ]
})

// 挂载路由导航卫士
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
