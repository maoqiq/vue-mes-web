import Vue from 'vue'
import Router from 'vue-router'

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
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/YCboard',
    name: 'board',
    meta: {title: '看板', icon: 'home'},
    children: [{
      path: 'YCboard',
      name: 'YCboard',
      component: () => import('@/views/board/ycboard'),
      meta: {title: '电清切疵总数(YC)'}
    },
    {
      path: 'PIboard',
      name: 'PIboard',
      component: () => import('@/views/board/piboard'),
      meta: {title: '接头数(PI)'}
    },
    {
      path: 'EFFboard',
      name: 'EFFboard',
      component: () => import('@/views/board/effboard'),
      meta: {title: '效率(EFF)'}
    },
    {
      path: 'SHboard',
      name: 'SHboard',
      component: () => import('@/views/board/shboard'),
      meta: {title: '异常班次(SH)'}
    },
    {
      path: 'SSboard',
      name: 'SSboard',
      component: () => import('@/views/board/ssboard'),
      meta: {title: '停止纱锭(STOP SP)'}
    },
  ]
  }
]

export const asyncRouterMap = [
  {
    path: '/quality',
    component: Layout,
    redirect: '/quality/machine',
    name: 'quality',
    meta: {title: '质量控制', icon: 'product'},
    children: [
    //   {
    //   path: 'home',
    //   name: 'home',
    //   component: () => import('@/views/quality/home'),
    //   meta: {title: '主页', icon: 'product'},
    // },
    {
      path: 'machine',
      name: 'machine',
      component: () => import('@/views/quality/machine/index'),
      meta: {title: '气流纺机列表', icon: 'product-list'}
    },
      {
        path: 'spindle',
        name: 'spindle',
        component: () => import('@/views/quality/spindle/index'),
        meta: {title: '纱锭列表', icon: 'product-list'}
      },
      {
        path: 'spindleDetail',
        name: 'spindleDetail',
        component: () => import('@/views/quality/spindle/detail'),
        meta: {title: '纱锭详情'},
      },
      {
        path: 'warning',
        name: 'warning',
        component: () => import('@/views/quality/warning/index'),
        meta: {title: '预警', icon: 'product-cate'}
      },
      {
        path: 'sourceData',
        name: 'sourceData',
        component: () => import('@/views/quality/sourceData/index'),
        meta: {title: '原数据展示', icon: 'order-return'},
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/quality/warning/index'),
        meta: {title: '指标配置', icon: 'order-setting'},
      },
      {
        path: 'repair',
        name: 'repair',
        component: () => import('@/views/quality/repair/index'),
        meta: {title: '维修信息', icon: 'order-return-reason'}
      },
      {
        path: 'repairCreate',
        name: 'repairCreate',
        component: () => import('@/views/quality/repair/create'),
        meta: {title: '新建维修单'}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

