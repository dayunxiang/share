import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    visitedViews: [],
    userName: '', //用户名
    tagsList: [{
      name: 'shareCenter',
      path: '/share/center',
      meta: {
        title: '我的共享'
      },
    }],
    refresh: false, //刷新登录信息
    cacheList: ['shareCenter'],
    menus: [], //菜单
    loginFlag: false, //弹框登录标识
    refreshPage: true,//刷新当前页面标识
    routeParam: {}, //页面弹框登录前保存跳转参数
    routeType: 'name', //路由跳转方式，默认为通过name跳转，当值改变为path时，通过path跳转
    msgCount: 0, //消息数量
    refreshIndex: false,//首页模块切换标识
    refreshMenu: false,//刷新后台菜单标识
    searchApiName: '', //api首页查询条件
    searchDataName: '', //数据首页查询条件
    searchDocName: '', //文档首页查询条件
    tabCount: 1,//header默认选中位置
    lastLogin: {},//弹出登录框时点击的路由
    urlObj: {//54类图标路径
      imgBaadUrl: require('@/assets/images/BAAD.png'),  //流域片区
      imgRiunUrl: require('@/assets/images/RIUN.png'),  //涉水组织结构
      imgRiunUrl: require('@/assets/images/REA.png'),     //河段
      imgRvwkUrl: require('@/assets/images/RVWK.png'),    //治河工程
      imgWiuUrl: require('@/assets/images/WIU.png'),     //取用水户

      imgHystUrl: require('@/assets/images/HYST.png'),    //水电站
      imgChanUrl: require('@/assets/images/CHAN.png'),    //渠道
      imgReavUrl: require('@/assets/images/REAV.png'),    //河区
      imgWellUrl: require('@/assets/images/WELL.png'),    //地下水取水井
      imgWrzUrl: require('@/assets/images/WRZ.png'),     //水资源分区

      imgSwhsUrl: require('@/assets/images/SWHS.png'),    //地表水水源地
      imgFsdaUrl: require('@/assets/images/FSDA.png'),    //蓄滞洪区
      imgWsczUrl: require('@/assets/images/WSCZ.png'),    //水土保持区划
      imgMopoUrl: require('@/assets/images/MOPO.png'),    //监控点
      imgDpdsUrl: require('@/assets/images/DPDS.png'),    //险工险段

      imgResUrl: require('@/assets/images/RES.png'),     //水库
      imgLkUrl: require('@/assets/images/LK.png'),      //湖泊
      imgBridUrl: require('@/assets/images/BRID.png'),    //桥梁
      imgGuerUrl: require('@/assets/images/GUER.png'),    //侵蚀河道
      imgWscsUrl: require('@/assets/images/WSCS.png'),    //水土保持工程

      imgTrrUrl: require('@/assets/images/TRR.png'),     //灌区
      imgWadiUrl: require('@/assets/images/WADI.png'),    //引调水
      imgGwhsUrl: require('@/assets/images/GWHS.png'),    //地下水水源地
      imgRvUrl: require('@/assets/images/RV.png'),      //河流
      imgBasUrl: require('@/assets/images/BAS.png'),     //流域

      imgCulvUrl: require('@/assets/images/CULV.png'),    //涵洞
      imgEwcsUrl: require('@/assets/images/EWCS.png'),    //重点水事矛盾敏感区
      imgPondUrl: require('@/assets/images/POND.png'),    //塘坝
      imgObjUrl: require('@/assets/images/OBJ.png'),     //对象关系
      imgStpUrl: require('@/assets/images/STP.png'),     //污水处理厂

      imgWawoUrl: require('@/assets/images/WAWO.png'),    //自来水厂
      imgWainUrl: require('@/assets/images/WAIN.png'),    //取水口
      imgGwfzUrl: require('@/assets/images/GWFZ.png'),    //地下水功能区
      imgPipeUrl: require('@/assets/images/PIPE.png'),    //管线
      imgPersUrl: require('@/assets/images/PERS.png'),    //自然人

      imgDrhoUrl: require('@/assets/images/DRHO.png'),    //退排水户
      imgPdoUrl: require('@/assets/images/PDO.png'),     //退水排污口
      imgWfzUrl: require('@/assets/images/WFZ.png'),     //地表水功能区
      imgDamUrl: require('@/assets/images/DAM.png'),     //水库大坝
      imgFlumUrl: require('@/assets/images/FLUM.png'),    //渡槽

      imgRudaUrl: require('@/assets/images/RUDA.png'),    //橡胶坝
      imgCwsUrl: require('@/assets/images/CWS.png'),     //农村供水
      imgRiseUrl: require('@/assets/images/RISE.png'),    //河道断面
      imgPitsUrl: require('@/assets/images/PITS.png'),    //窖池
      imgStUrl: require('@/assets/images/ST.png'),      //测站

      imgSepUrl: require('@/assets/images/SEP.png'),     //采砂分区
      imgDikeUrl: require('@/assets/images/DIKE.png'),    //堤防
      imgSadUrl: require('@/assets/images/SAD.png'),     //淤地坝
      imgWagaUrl: require('@/assets/images/WAGA.png'),    //水闸
      imgCarrUrl: require('@/assets/images/CARR.png'),    //载体

      imgWiunUrl: require('@/assets/images/WIUN.png'),    //水利行业单位
      imgAdUrl: require('@/assets/images/AD.png'),      //行政区划
      imgEvUrl: require('@/assets/images/EV.png'),      //事件
      imgProjUrl: require('@/assets/images/PROJ.png'),  //项目
      imgMdUrl: require('@/assets/images/MD.png'),      //多媒体

      imgOtherUrl: require('@/assets/images/other.png')      //其他
    },
    urlObjArray: [//54类图标路径-名称对象
      {url: 'imgBaadUrl', name: '流域片区'},
      {url: 'imgRiunUrl', name: '涉水组织结构'},
      {url: 'imgRiunUrl', name: '河段'},
      {url: 'imgRvwkUrl', name: '治河工程'},
      {url: 'imgWiuUrl', name: '取用水户'},

      {url: 'imgHystUrl', name: '水电站'},
      {url: 'imgChanUrl', name: '渠道'},
      {url: 'imgReavUrl', name: '河区'},
      {url: 'imgWellUrl', name: '地下水取水井'},
      {url: 'imgWrzUrl', name: '水资源分区'},

      {url: 'imgSwhsUrl', name: '地表水水源地'},
      {url: 'imgFsdaUrl', name: '蓄滞洪区'},
      {url: 'imgWsczUrl', name: '水土保持区划'},
      {url: 'imgMopoUrl', name: '监控点'},
      {url: 'imgDpdsUrl', name: '险工险段'},

      {url: 'imgResUrl', name: '水库'},
      {url: 'imgLkUrl', name: '湖泊'},
      {url: 'imgBridUrl', name: '桥梁'},
      {url: 'imgGuerUrl', name: '侵蚀河道'},
      {url: 'imgWscsUrl', name: '水土保持工程'},

      {url: 'imgTrrUrl', name: '灌区'},
      {url: 'imgWadiUrl', name: '引调水'},
      {url: 'imgGwhsUrl', name: '地下水水源地'},
      {url: 'imgRvUrl', name: '河流'},
      {url: 'imgBasUrl', name: '流域'},

      {url: 'imgCulvUrl', name: '涵洞'},
      {url: 'imgEwcsUrl', name: '重点水事矛盾敏感区'},
      {url: 'imgPondUrl', name: '塘坝'},
      {url: 'imgObjUrl', name: '对象关系'},
      {url: 'imgStpUrl', name: '污水处理厂'},

      {url: 'imgWawoUrl', name: '自来水厂'},
      {url: 'imgWainUrl', name: '取水口'},
      {url: 'imgGwfzUrl', name: '地下水功能区'},
      {url: 'imgPipeUrl', name: '管线'},
      {url: 'imgPersUrl', name: '自然人'},

      {url: 'imgDrhoUrl', name: '退排水户'},
      {url: 'imgPdoUrl', name: '退水排污口'},
      {url: 'imgWfzUrl', name: '地表水功能区'},
      {url: 'imgDamUrl', name: '水库大坝'},
      {url: 'imgFlumUrl', name: '渡槽'},

      {url: 'imgRudaUrl', name: '橡胶坝'},
      {url: 'imgCwsUrl', name: '农村供水'},
      {url: 'imgRiseUrl', name: '河道断面'},
      {url: 'imgPitsUrl', name: '窖池'},
      {url: 'imgStUrl', name: '测站'},

      {url: 'imgSepUrl', name: '采砂分区'},
      {url: 'imgDikeUrl', name: '堤防'},
      {url: 'imgSadUrl', name: '淤地坝'},
      {url: 'imgWagaUrl', name: '水闸'},
      {url: 'imgCarrUrl', name: '载体'},

      {url: 'imgWiunUrl', name: '水利行业单位'},
      {url: 'imgAdUrl', name: '行政区划'},
      {url: 'imgEvUrl', name: '事件'},
      {url: 'imgProjUrl', name: '项目'},
      {url: 'imgMdUrl', name: '多媒体'},

      {url: 'imgOtherUrl', name: '其他'}
    ],
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({ name: view.name, path: view.path })
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    },
    closeTag: (state, name) => {
      let i = -1
      state.tagsList.forEach((v, index) => {
        if (v.name == name) {
          i = index
        }
      })
      state.tagsList.splice(i, 1)
      state.cacheList.splice(i, 1)
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews: ({ commit }, view) => {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews: ({ commit }, view) => {
      commit('DEL_VISITED_VIEWS', view)
    }
    
  }
};

export default app;
