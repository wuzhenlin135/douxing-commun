import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/signup', component: () => import('@/views/signup/index'), hidden: true },
  { path: '/forget', component: () => import('@/views/forget/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单列表', icon: 'table' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'user',

    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/user/index'),
        meta: { title: '账号设置', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/exchange',
    component: Layout,
    name: 'exchange',
    children: [
      {
        path: 'index',
        name: 'exchange',
        component: () => import('@/views/exchange/index'),
        meta: { title: '兑换商品', icon: 'form' }
      }
    ]
  },
  //  test begin
  {
    path: '/act1',
    component: Layout,
    name: 'act1',
    children: [
      {
        path: 'index',
        name: 'act1',
        component: () => import('@/views/exchange/index'),
        meta: { title: '在线社区', icon: 'form' }
      }
    ]
  },
  {
    path: '/act2',
    component: Layout,
    name: 'act2',
    children: [
      {
        path: 'index',
        name: 'act2',
        component: () => import('@/views/exchange/index'),
        meta: { title: '物业管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/act3',
    component: Layout,
    name: 'act3',
    children: [
      {
        path: 'index',
        name: 'act3',
        component: () => import('@/views/exchange/index'),
        meta: { title: '人才输入', icon: 'form' }
      }
    ]
  },
  {
    path: '/act4',
    component: Layout,
    name: 'act4',
    children: [
      {
        path: 'index',
        name: 'act4',
        component: () => import('@/views/exchange/index'),
        meta: { title: '房屋租赁', icon: 'form' }
      }
    ]
  },
  {
    path: '/act5',
    component: Layout,
    name: 'act5',
    children: [
      {
        path: 'index',
        name: 'act5',
        component: () => import('@/views/exchange/index'),
        meta: { title: '法律援助', icon: 'form' }
      }
    ]
  },
  {
    path: '/act6',
    component: Layout,
    name: 'act6',
    children: [
      {
        path: 'index',
        name: 'act6',
        component: () => import('@/views/exchange/index'),
        meta: { title: '酒店耗材', icon: 'form' }
      }
    ]
  },
  {
    path: '/act7',
    component: Layout,
    name: 'act7',
    children: [
      {
        path: 'index',
        name: 'act7',
        component: () => import('@/views/exchange/index'),
        meta: { title: '汽车租赁', icon: 'form' }
      }
    ]
  },
  {
    path: '/act8',
    component: Layout,
    name: 'act8',
    children: [
      {
        path: 'index',
        name: 'act8',
        component: () => import('@/views/exchange/index'),
        meta: { title: '广告设计', icon: 'form' }
      }
    ]
  },
  {
    path: '/act9',
    component: Layout,
    name: 'act9',
    children: [
      {
        path: 'index',
        name: 'act9',
        component: () => import('@/views/exchange/index'),
        meta: { title: '失误招领', icon: 'form' }
      }
    ]
  },
  //  test end
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

