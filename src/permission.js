import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单

const RouteMenu = [
  {
    createTime: "2020-02-02T06:50:36.000+00:00",
    hidden: 0,
    icon: "product",
    id: 1,
    level: 0,
    name: "quality",
    parentId: 0,
    sort: 0,
    title: "质量控制"
  },
  {
    createTime: "2020-02-02T06:50:36.000+00:00",
    hidden: 1,
    icon: "product",
    id: 1,
    level: 1,
    name: "home",
    parentId: 0,
    sort: 0,
    title: "主页"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 0,
    icon: "product-list",
    id: 2,
    level: 1,
    name: "machine",
    parentId: 1,
    sort: 0,
    title: "气流纺机列表"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 0,
    icon: "product-list",
    id: 3,
    level: 1,
    name: "spindle",
    parentId: 1,
    sort: 0,
    title: "纱锭列表"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 1,
    icon: "",
    id: 4,
    level: 1,
    name: "spindleDetail",
    parentId: 1,
    sort: 0,
    title: "纱锭详情"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 0,
    icon: "product-cate",
    id: 5,
    level: 1,
    name: "warning",
    parentId: 1,
    sort: 0,
    title: "预警"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 0,
    icon: "order-return",
    id: 6,
    level: 1,
    name: "sourceData",
    parentId: 1,
    sort: 0,
    title: "原数据展示"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 0,
    icon: "order-setting",
    id: 7,
    level: 1,
    name: "setting",
    parentId: 1,
    sort: 0,
    title: "指标配置"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 0,
    icon: "order-return-reason",
    id: 7,
    level: 1,
    name: "repair",
    parentId: 1,
    sort: 0,
    title: "维修信息"
  },
  {
    createTime: "2020-02-02T06:51:50.000+00:00",
    hidden: 1,
    icon: "",
    id: 7,
    level: 1,
    name: "repairCreate",
    parentId: 1,
    sort: 0,
    title: "新建维修单"
  }
]

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          console.log(res)
          let menus = RouteMenu;
          let username='admin';
          store.dispatch('GenerateRoutes', { menus,username }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        // }).catch((err) => {
        //   store.dispatch('FedLogOut').then(() => {
        //     Message.error(err || 'Verification failed, please login again')
        //     next({ path: '/' })
        //   })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
