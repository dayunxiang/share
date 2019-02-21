<template>
  <div  class="scroll-hide-outer">
    <div class="logo" @click="goIndex">
      <img :src="logoUrl">
      <span>江西省水利数据共享系统</span>
    </div>
    <div class="menu-title" @click="shareCenter">
      <i class="iconfont icon-wodegongxiang_huaban shareicon"></i>
      <!-- <img :src="homeUrl"> -->
      <span  >我的共享</span>
    </div>
    <div class="scroll-hide">
      <el-menu  :default-active="$route.path" :default-openeds="defaultOpened" class="el-menu-vertical-demo " @open="handleOpen" @close="handleClose" @select="handleSelect" :collapse="isCollapse">
        <template v-for="(item,key) in menus">
          <template v-if="item.children.length == 0">
            <router-link :to="item.href" >
              <el-menu-item :index="item.href" :key="item.href" class="no-child">
                  <i :class="item.icon" class="iconfont"></i>
                  <span slot="title">{{item.title}}</span>
              </el-menu-item>
            </router-link>
          </template>
          <template v-else-if="item.children.length > 0">
            <el-submenu :index="'' + key">
              <template slot="title">
                <i :class="item.icon" class="iconfont"></i>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="(child, unn) in item.children">
                  <router-link :to="child.href" v-if="child.title !== '修改密码'">
                    <el-menu-item  :index="child.href" :key="child.href" >{{child.title}}</el-menu-item>
                  </router-link>
                  <!-- class="target_link" -->
                  <a :href="child.href" target="_blank" v-if="child.title == '修改密码'">
                    <li class="el-menu-item pl40">
                      <span>{{child.title}}</span>
                    </li>
                  </a>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </template>
      </el-menu>    
    </div>
  </div>
</template>

<script>

  export default {
    props:{
      isCollapse:{
        type:Boolean
      }
    },
    data() {
      return {
        isSelectKey:'0',
        logoUrl: require('@/assets/images/logo.png'),
        homeUrl: require('@/assets/images/home.png'),
        menuList:[],
          iconName: 'el-icon-document',
          homeIcon: 'el-icon-location'
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        
      },
      handleClose(key, keyPath) {
        
      },
      handleSelect(key){
        this.isSelectKey = key
      },
      sideShrink(){
        this.$emit('onIsCollapse')
      },
      shareCenter() {
        this.$router.push({
          name: 'shareCenter'
        })
      },
      goIndex() {
        this.$router.push({
          path: '/index'
        })
      }
    },
    computed: {
      menus() {
        return this.$store.state.app.menus
        // return [
        //   {
        //     href: 'api/cener',
        //     title: 'API中心',
        //     iconName: 'iconfont icon-icon_api',
        //     children: [
        //       {
        //         href: 'api/myApi',
        //         title: '我的API'
        //       },
        //       {
        //         href: 'api/collect',
        //         title: '我的收藏'
        //       }
        //     ]
        //   },
        //   {
        //     href: 'market/myData',
        //     title: '数据中心',
        //     iconName: 'iconfont icon-shujushichang_huaban',
        //     children: [
        //       {
        //         href: 'market/myData',
        //         title: '我的数据'
        //       },
        //       {
        //         href: 'market/myCollect',
        //         title: '我的收藏'
        //       }
        //     ]
        //   },
        //   {
        //     href: 'market/myData',
        //     title: '文档中心',
        //     iconName: 'iconfont icon-shujushichang_huaban',
        //     children: [
        //       {
        //         href: 'doc/myDoc',
        //         title: '我的文档'
        //       },
        //       {
        //         href: 'doc/myDocCollect',
        //         title: '我的收藏'
        //       }
        //     ]
        //   },
        //   {
        //     href: 'api/ipWhiteList',
        //     title: '安全中心',
        //     iconName: 'iconfont icon-anquanzhongxin_huaban',
        //     children: [
        //       {
        //         href: 'api/ipWhiteList',
        //         title: 'IP白名单'
        //       }
        //     ]
        //   },
        //   {
        //     href: 'api/cener',
        //     title: '系统管理',
        //     iconName: 'iconfont icon-xitongguanli_huaban',
        //     children: [
        //       {
        //         href: 'api/center',
        //         title: 'API管理'
        //       },
        //       {
        //         href: 'data/center',
        //         title: '数据管理'
        //       },
        //       {
        //         href: 'doc/center',
        //         title: '文档管理'
        //       },
        //       {
        //         href: 'dict/index',
        //         title: '数据字典'
        //       },
        //       {
        //         href: 'order/manage',
        //         title: '工单受理'
        //       },
        //       {
        //         href: 'notice/manage',
        //         title: '公告管理'
        //       },
        //       {
        //         href: 'money/index',
        //         title: '水利币管理'
        //       },
        //       {
        //         href: 'common/manage',
        //         title: '公共设置'
        //       },
        //       {
        //         href: 'system/menu',
        //         title: '菜单管理'
        //       },
        //       {
        //         href: 'system/user',
        //         title: '用户管理'
        //       },
        //       {
        //         href: 'system/authority',
        //         title: '角色管理'
        //       }
        //     ]
        //   },
        //   {
        //     href: 'share/money',
        //     title: '我的水利币',
        //     iconName: 'iconfont icon-wodexiaofeijilu-',
        //     children: []
        //   },
        //   {
        //     href: 'share/recharge',
        //     title: '我的充值记录',
        //     iconName: 'iconfont icon-wodexiaofeijilu-',
        //     children: []
        //   },
        //   {
        //     href: 'share/consume',
        //     title: '我的消费记录',
        //     iconName: 'iconfont icon-wodexiaofeijilu-',
        //     children: []
        //   },
        //   {
        //     href: 'order/index',
        //     title: '我的工单',
        //     iconName: 'iconfont icon-wodegongdan_huaban',
        //     children: []
        //   },
        //   {
        //     href: 'userInfo',
        //     title: '用户信息',
        //     iconName: 'iconfont icon-wodexiaofeijilu-',
        //     children: [
        //       {
        //         href: 'user/account',
        //         title: '账户信息'
        //       },
        //       {
        //         href: 'http://10.136.6.59:8080/HR/a?login',
        //         title: '修改密码',
        //         target: '_blank'
        //       },
        //     ]
        //   },
        //   {
        //     href: 'serial/index',
        //     title: '账户流水',
        //     iconName: 'iconfont icon-wodegongdan_huaban',
        //     children: []
        //   },
         
         
         
        // ]
      },
      defaultAction() {
        let firstPath =  this.$route.path.split('/')[1]
        if (this.menus instanceof Array && this.menus.length > 0) {
          let path = this.menus.filter((v) => {
            if (v.children && v.children.length > 0) {
              let result = false
              v.children.forEach((val) => {
                if (val.href.indexOf(firstPath) > -1) {
                  result = true
                }
              })
              return result
            } else {
              return v.href.indexOf(firstPath) > -1 
            }
          })
          if (path.length > 0) {
            return '/' + path[0].href
          } else {
            return this.$route.path
          }
        } else {
          return this.$route.path
        }
      },
      defaultOpened() {
        let path =  this.$route.path.substring(1)
        if (this.menus instanceof Array && this.menus.length > 0) {
          let result = []
          this.menus.forEach((v, index) => {
            if (v.children.length > 0) {
              v.children.forEach(val => {
                if (val.href.indexOf(path) > -1) {
                  result = [index + '']
                }
              })
            } 
          })
          return result
        } 
      }
      
    }
  }
</script>

<style scoped>
 .shareicon {
  display: inline-block;
  width: 14px;
  height: 14px;
 }
 .target_link {
   margin-left: 40px;
   color: #A6AEBB;
   text-decoration: none;
   line-height: 50px;
   background: #19233C !important;
 }
 .target_link:hover, .target_link:active {
   background: #121A2C !important
 }

</style>
