import Vue from 'vue'
import Router from 'vue-router'
// 登录组件
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// 首页组件
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// 欢迎组件
// import Welcome from '@/components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')

// 用户列表组件
// import User from '@/components/User/User'
const User = () => import(/* webpackChunkName: "user_role_rights" */ '@/components/User/User')
// 角色列表组件
// import Role from '@/components/power/Role'
const Role = () => import(/* webpackChunkName: "user_role_rights" */ '@/components/power/Role')
// 权限列表组件
// import Rights from '@/components/power/Rights'
const Rights = () => import(/* webpackChunkName: "user_role_rights" */ '@/components/power/Rights')

// 商品分类组件
// import GoodsCate from '@/components/goods/Goods_cate'
const GoodsCate = () => import(/* webpackChunkName: "goodsCate_goodsParams" */ '@/components/goods/Goods_cate')
// 分类参数组件
// import GoodsParams from '@/components/goods/Goods_params'
const GoodsParams = () => import(/* webpackChunkName: "goodsCate_goodsParams" */ '@/components/goods/Goods_params')

// 商品列表组件
// import GoodsList from '@/components/goods/Goods_list'
const GoodsList = () => import(/* webpackChunkName: "goodsList_goodsAddgoods" */ '@/components/goods/Goods_list')
// 添加商品信息组件
// import GoodsAddgoods from '@/components/goods/Goods_addgoods'
const GoodsAddgoods = () => import(/* webpackChunkName: "goodsList_goodsAddgoods" */ '@/components/goods/Goods_addgoods')

// 订单列表组件
// import Order from '@/components/order/order'
const Order = () => import(/* webpackChunkName: "order_report" */ '@/components/order/order')
// 数据报表组件
// import Report from '@/components/report/report'
const Report = () => import(/* webpackChunkName: "order_report" */ '@/components/report/report')

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

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
        { path: '/categories', component: GoodsCate },
        { path: '/params', component: GoodsParams },
        { path: '/goods', component: GoodsList },
        { path: '/goods/addgoods', component: GoodsAddgoods },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
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
