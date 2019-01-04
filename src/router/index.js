import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import { getToken, checkRouter, getMenu } from '../utils/auth.js';
/*路由跳转页面*/
Vue.use(Router)

/*页面加载方法*/
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/view/login/index'),
  hidden: true
}, {
  path: '/error',
  component: () => import('@/view/error/404'),
  meta: {
    access: 1
  },
  hidden: true
},
{//前台
  path: '/',
  name: 'main',
  component: () => import('@/view/front/main'),
  redirect: '/index',
  meta: {
    access: 1
  },
  hidden: true,
  children: [
    {//默认加载页面
      path: 'index',
      name: 'index',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/index')
    }, 
    {//api首页
      path: 'api',
      name: 'api',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/api/index')
    }, 
    {//api首页-更多
      path: 'api/more',
      name: 'moreApi',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/api/more')
    }, 
    //第三方登录
    {
      path: '/third',
      name: 'third',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/index')
    },
    {
      path: 'api/detail',
      name: 'apiDetail',
      meta: { 
        access: 1
      },
      component: () => import('@/view/front/api/detail')
    }, {
      path: 'api/commonBasic',
      name: 'commonBasic',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/api/commonBasicDetail')
    },
    //数据
    {
      path: 'data',
      name: 'data',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/data/data')
    },
    //数据-更多
    {
      path: 'data/more',
      name: 'moreData',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/data/more')
    },
    //文库
    {
      path: 'doc',
      name: 'doc',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/doc/index')
    },
    //文库-更多
    {
      path: 'doc/more',
      name: 'moreDoc',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/doc/more')
    },
    {
      path: 'doc/detail',
      name: 'docDetail',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/doc/detail')
    },
     //基础api定制
    {
      path: 'data/addBaseData',
      name: 'addBaseData',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/data/addBaseData')
    }, { //个人基础数据定制详情
      path: 'data/personBase',
      name: 'personBaseDetail',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/data/personBaseDetail')
    }, {
      path: 'data/detail',
      name: 'dataDetail',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/data/dataDetail')
    }, {
      path: 'api/basic',
      name: 'basicApi',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/api/basic')
    }, {
      path: 'api/basicDetail',
      name: 'basicDetail',
      meta: {
        access: 1
      },
      component: () => import('@/view/front/api/basicDetail')
    }
  ]
 }, {//后台
  path: '',
  name: 'indexLayout',
  component: () => import('@/components/layout/indexLayout'),
  hidden: true,
  children: [
    //api管理
    {
      path: '/api/center',
      name: 'apiCenter',
      meta: {
        title: 'API管理'
      },
      component: () => import('@/view/api/index')
    }, {
      path: '/api/add',
      name: 'addApi',
      meta: {
        title: '发布业务API'
      },
      component: () => import('@/view/api/addApi')
    }, {
      path: '/api/addBasic',
      name: 'addBasicApi',
      meta: {
        title: '创建基础API'
      },
      component: () => import('@/view/api/addBasicApi')
    }, {
      path: '/api/editBasic',
      name: 'editBasicApi',
      meta: {
        title: '修改基础API'
      },
      component: () => import('@/view/api/editBasicApi')
    }, {
      path: '/api/edit',
      name: 'editApi',
      meta: {
        title: '修改业务API'
      },
      component: () => import('@/view/api/editApi')
    },
    //api中心
    {
      path: '/api/myApi',
      name: 'myApi',
      meta: {
        title: '我的API'
      },
      component: () => import('@/view/myapi/index')
    },  
    {
      path: '/api/test',
      name: 'apiTest',
      meta: {
        title: 'API测试'
      },
      component: () => import('@/view/myapi/test')
    },  
    {
      path: '/api/collect',
      name: 'apiCollect',
      meta: {
        title: 'API收藏'
      },
      component: () => import('@/view/share/collect')
    }, {
      path: '/api/statistics',
      name: 'apiStatistics',
      meta: {
        title: 'API统计'
      },
      component: () => import('@/view/myapi/statistics')
    }, {
      path: '/api/ipWhiteList',
      name: 'ipWhiteList',
      meta: {
        title: 'IP白名单'
      },
      component: () => import('@/view/share/ipWhiteList')
    }, {
      path: '/api/warning',
      name: 'myWarning',
      meta: {
        title: '预警号码管理'
      },
      component: () => import('@/view/share/warning')
    }, {
      path: '/share/center',
      name: 'shareCenter',
      meta: {
        title: '我的共享'
      },
      component: () => import('@/view/share/index')
    },
    {
      path: '/share/money',
      name: 'shareMoney',
      meta: {
        title: '我的水利币'
      },
      component: () => import('@/view/share/money')
    }, 
    {
      path: '/share/recharge',
      name: 'shareRecharge',
      meta: {
        title: '我的充值记录'
      },
      component: () => import('@/view/share/recharge')
    }, {
      path: '/share/consume',
      name: 'shareConsume',
      meta: {
        title: '我的消费记录'
      },
      component: () => import('@/view/share/consume')
    }, {
      path: '/serial/index',
      name: 'serialList',
      meta: {
        title: '账户流水'
      },
      component: () => import('@/view/share/serial')
    },
    //数据中心
    {
      path: '/market/myData',
      name: 'myData',
      meta: {
        title: '我的数据'
      },
      component: () => import('@/view/market/myData')
    }, {
      path: '/market/myCollect',
      name: 'myCollect',
      meta: {
        title: '数据收藏'
      },
      component: () => import('@/view/market/myCollect')
    },
    //数据管理
    {
      path: '/data/center',
      name: 'dataCenter',
      meta: {
        title: '数据管理'
      },
      component: () => import('@/view/data/index')
    }, {
      path: '/data/addBiz',
      name: 'addBiz',
      meta: {
        title: '发布业务数据'
      },
      component: () => import('@/view/data/addBiz')
    },{
      path: '/data/editBiz',
      name: 'editBiz',
      meta: {
        title: '修改业务数据'
      },
      component: () => import('@/view/data/editBiz')
    }, {
      path: '/data/addBase',
      name: 'addBase',
      meta: {
        title: '发布基础数据'
      },
      component: () => import('@/view/data/addBase')
    }, {
      path: '/data/editBase',
      name: 'editBase',
      meta: {
        title: '修改基础数据'
      },
      component: () => import('@/view/data/editBase')
    },
    //文档管理
    {
      path: '/doc/center',
      name: 'docCenter',
      meta: {
        title: '文档管理'
      },
      component: () => import('@/view/doc/index')
    },
    {
      path: '/doc/addDoc',
      name: 'addDoc',
      meta: {
        title: '文档发布'
      },
      component: () => import('@/view/doc/addDoc')
    },
    {
      path: '/doc/editDoc',
      name: 'editDoc',
      meta: {
        title: '文档修改'
      },
      component: () => import('@/view/doc/editDoc')
    },
     //文档中心
     {
      path: '/doc/myDoc',
      name: 'myDoc',
      meta: {
        title: '我的文档'
      },
      component: () => import('@/view/docMarket/myDoc')
    }, {
      path: '/doc/myDocCollect',
      name: 'myDocCollect',
      meta: {
        title: '文档收藏'
      },
      component: () => import('@/view/docMarket/myCollect')
    },
    //我的工单
    {
      path: '/order/index',
      name: 'myOrder',
      meta: {
        title: '我的工单'
      },
      component: () => import('@/view/order/index')
    },
    {
      path: '/order/manage',
      name: 'orderManage',
      meta: {
        title: '工单受理'
      },
      component: () => import('@/view/order/manager')
    },
    {
      path: '/order/addOrder',
      name: 'addOrder',
      meta: {
        title: '新建工单'
      },
      component: () => import('@/view/order/addOrder')
    },
    {
      path: '/order/orderDetail',
      name: 'orderDetail',
      meta: {
        title: '工单详情'
      },
      component: () => import('@/view/order/orderDetail')
    },
    //水利币管理
    {
      path: '/money/index',
      name: 'moneyManager',
      meta: {
        title: '水利币管理'
      },
      component: () => import('@/view/money/index')
    },
    //数据字典
    {
      path: '/dict/index',
      name: 'dictManager',
      meta: {
        title: '数据字典'
      },
      component: () => import('@/view/dictionary/index')
    },
    //公告管理
    {
      path: '/notice/manage',
      name: 'noticeManager',
      meta: {
        title: '公告管理'
      },
      component: () => import('@/view/notice/index')
    },
    //消息管理
    {
      path: '/message/index',
      name: 'messageManage',
      meta: {
        title: '消息提醒'
      },
      component: () => import('@/view/home/message/index')
    },
    //用户信息
    {
      path: '/user/account',
      name: 'userAccount',
      meta: {
        title: '账户信息'
      },
      component: () => import('@/view/user/index')
    },
    //空白页面
    {
      path: '/ ',
      name: 'empty',
      component: () => import('@/view/home/empty'),
      hidden: true
    },
    

    {//系统管理
      path: '/system/user',
      name: 'userManager',
      meta: {
        title: '用户管理'
      },
      component: () => import('@/view/system/user/index')
    }, 
    {//公共设置
      path: '/common/manage',
      name: 'commonManage',
      meta: {
        title: '公共设置'
      },
      component: () => import('@/view/system/common/index')
    },
    {
      path: '/system/unit',
      component: () => import('@/view/system/unit/index')
    }, {
      path: '/system/authority',
      name: 'roleManager',
      meta: {
        title: '角色管理'
      },
      component: () => import('@/view/system/authority/index')
    }, {
      path: '/system/menu',
      name: 'menuManager',
      meta: {
        title: '菜单管理'
      },
      component: () => import('@/view/system/menu/index')
    },  {
      path: '/system/log',
      name: 'systemLog',
      meta: {
        title: '系统记录'
      },
      component: () => import('@/view/system/log/index')
    }, {
      path: '/api/authority',
      name: 'apiAuthority',
      meta: {
        title: '权限设置'
      },
      component: () => import('@/view/system/log/authority')
    }]
}]


export const router = new Router({
  routes: constantRouterMap
});

// export default new Router({
//   routes: constantRouterMap,
//   //mode: 'history'
// });

export const asyncRouterMap =[{

}]

router.beforeEach((to, from, next) => {
  //title
  if (to.meta.title) {
    let result = false

    store.state.app.tagsList.forEach((v) => {
      if (v.path == to.path) {
        result = true
      }
    })
    if (!result) {
      store.state.app.tagsList.forEach((v) => {
        v.meta.active = false
      })
      to.meta.active = true
      store.state.app.cacheList.push(to.name)
      store.state.app.tagsList.push(to)
    } else {
      let index = -1
      let route = {}
      store.state.app.tagsList.forEach((v, i) => {
        if (v.path == to.path) {
          index = i
          route = v
          route.meta.active = true
        } else {
          v.meta.active = false
        }
      })
      store.state.app.tagsList.splice(index, 1, route)
    }
  }

  if (to.meta.access == '1') {//部分路由根据定义字段access判断
    next()
  } else {
    if (getToken() != '' && getToken() != null && getToken() != undefined) {//登录状态
      next()
    } else {
      if (to.path == '/login') {
        next()
      } else {
        //next('/login')
        store.state.app.loginFlag = true
        store.state.app.lastLogin = to
        next(from)
      }
    }
  }
})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
 // const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
   //router.replace(targetPath);
   window.location.reload()
  }
 });

