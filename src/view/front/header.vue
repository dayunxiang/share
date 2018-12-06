<template>
  <div >
   <div class="front-header">
       <div class="container">
          <span class="logo">
            <img :src="logoUrl"/>
            <span>江西省水利数据共享系统</span>
          </span>
          <span class="user-info">
            <span class="message" @click="messageManage" @mouseover="changeIcon" @mouseout="returnIcon">
              <el-badge is-dot class="dot-item" v-if="messageCount > 0"></el-badge>
                <img :src="messageUrl" v-if="!messageIcon"/>
                <img :src="messageUrl2" v-if="messageIcon"/>
              
              <span class="headerfont-color">未读消息({{messageCount}})</span>
            </span>
            <template v-if="isLogin">
              <span class="name-color">欢迎您，{{userName}}</span>
              <span class="headerfont-color" @click="logout">[退出]</span>
            </template>
            <span class="name-color" v-if="!isLogin" @click="login">登录</span>
          </span>
       </div>
      <!--  <div class="user-btn" v-show="showUserBtn" @mouseover="showIcon" @mouseout="hideIcon">
          <span @click="userCenter">个人中心</span>
          <span @click="logout">退出</span>
       </div> -->
    </div>

    <div class="nav-container">
      <div class="nav-bar">
        <span class="nav" @click="goIndex" >
          <span :class="tabNum == 1 ? 'active' : ''">首页</span>
        </span>
        <span class="nav" @click="goApi" >
          <span :class="tabNum == 2 ? 'active' : ''">API</span>
        </span>
        <span class="nav" @click="goData" >
          <span :class="tabNum == 3 ? 'active' : ''">数据</span>
        </span>
        <span class="nav" @click="goDoc"  >
          <span :class="tabNum == 4 ? 'active' : ''">文库</span>
        </span>
        <span class="nav" @click="goCenter"  >
          <span :class="tabNum == 5 ? 'active' : ''">个人中心</span>
        </span>

        <span class="nav-search" >
          <el-input  size="small" suffix-icon="el-icon-search"> 
            <el-select v-model="searchType" slot="prepend" style="width:80px;" size="small">
              <el-option label="API" value="1"></el-option>
              <el-option label="数据" value="2"></el-option>
              <el-option label="文档" value="3"></el-option>
            </el-select>
          </el-input>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUser, getToken, removeToken } from '@/utils/auth'
  import {userLogout} from '@/api/index/index'
  import {getMessageCount} from '@/api/message/index'
  import store from '../../store/index'
  export default {
    compontents: {
     
    },
    mounted() {
      if(getUser() && getToken()) {
        this.getMessage()
        this.userName = JSON.parse(getUser()).name
        this.isLogin = true
      } else {
        this.isLogin = false
      }
      if (sessionStorage.getItem('tabNum')) {
        this.tabNum = parseInt(sessionStorage.getItem('tabNum'))
      }
      let route = this.$route.path
      if (route == '/index') {
        this.tabNum = 1
      } else if (route == '/api') {
        this.tabNum = 2
      } else if (route == '/data') {
        this.tabNum = 3
      }  else if (route == '/doc') {
        this.tabNum = 4
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.app.userName
      },
      messageCount() {
        return this.$store.state.app.msgCount
      }
    },
    watch: {
      userInfo(val) {
        if (val) {
          this.userName = val
          this.isLogin = true
        }
      }
    },
    data() {
      return {
        //messageCount: 0,
        isLogin: false,
        userName:'',
        showUserBtn: false,
        searchType: '1',
        tabNum: 1,
        timer: '',
        messageIcon: false,
        logoUrl: require('@/assets/images/logo.png'),
        messageUrl: require('@/assets/images/api-message.png'),
        messageUrl2: require('@/assets/images/api-message2.png'),
      }
    },
    methods: {
      goIndex() {
        this.tabNum = 1
        sessionStorage.setItem('tabNum', 1)
        this.$router.push({
          path: '/index'
        })
      },
      goApi() {
        this.tabNum = 2
        sessionStorage.setItem('tabNum', 2)
        this.$router.push({
          path: '/api'
        })
      },
      goCenter() {
        this.$router.push({
          path: '/share/center'
        })
      },
      goData() {
        this.tabNum = 3
        sessionStorage.setItem('tabNum', 3)
        this.$router.push({
          path: '/data'
        })
      },
      goDoc() {
        this.tabNum = 4
        sessionStorage.setItem('tabNum', 4)
        this.$router.push({
          path: '/doc'
        })
      },
      showIcon() {
        //document.getElementById('userInfo').style.display = 'inline-block'
        this.showUserBtn = true
        clearTimeout(this.timer)
      },
      hideIcon() {
        let _this = this
        this.timer = setTimeout(function() {
          _this.showUserBtn = false
        }, 300)
      },
      changeIcon() {
        this.messageIcon = true
      },
      returnIcon() {
        this.messageIcon = false
      },
      userCenter() {
        this.$router.push({
          path: '/share/center'
        })
      },
      login() {
        this.$router.push({
          path: '/login'
        })
      },
      logout() {
        this.$confirm('确认退出登录？', '提示', {
          cancelButtonClass: 'btn-custom-cancel',
          type: 'info'
        }).then(() => {
          userLogout().then((resp) => {
            removeToken()
            // sessionStorage.removeItem('menu')
            // sessionStorage.removeItem('isFirst')
            // this.$store.state.user.menus = []
            this.$router.push({
              path: '/login'
            })
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      messageManage() {
        this.$router.push({
          name: 'messageManage'
        })
      },
      getMessage() {
        getMessageCount().then(res => {
          store.state.app.msgCount = res.data
          //this.messageCount = res.data
        })
      }
      
    }
  }
</script>

<style scoped >
</style>


