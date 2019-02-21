<template>
  <div>
    <span class="to-home" @click="toHome">
      <i class="back-icon"></i><span>返回前台</span>
    </span>
    <div class="icon-container">
      <span class="message-outer"  @click="messageManage">
        
          <img :src="messageUrl"/>
          <el-badge is-dot class="dot-item" v-if="messageCount > 0">
          </el-badge>
          <span class="count">未读消息({{messageCount}})</span>
       
        
        
      </span>
      <span class="puUser" @mouseover="showIcon" @mouseout="hideIcon">
        <span class="vertical-line"></span>
        <span class="username">{{userName}}</span>
        <span class="vertical-line"></span>
      </span>
      <span @click="logout" class="out-span">退出</span>
    </div>
  </div>
</template>

<script>
  import {userLogout} from '@/api/index/index'
  import {removeToken, getUser, setHistory,  removeLoginFlag} from '@/utils/auth'
  import {getMessageCount} from '@/api/message/index';
  import store from '../../store/index'
  var timer = ''
  export default {
    created() {    
      this.userName = JSON.parse(getUser()).name
      //this.userName = '张三'
    },
    data() {
      return {
        //messageCount: 0,
        userName:'',
        logo: require('@/assets/images/logo.png'),
        messageUrl: require('@/assets/images/message.png')
      };
    },
    computed: {
      messageCount() {
        return this.$store.state.app.msgCount
      }
    },
    methods: {
      toHome() {
        this.$router.push({
          name: 'index'
        })
      },
      onCollapse(){
        this.isCollapse = true;
      },
      onIsCollapse(){
        this.isCollapse = !this.isCollapse;
      },
     
      logout() {
        this.$confirm('确认退出登录？', '提示', {
            cancelButtonClass: 'btn-custom-cancel',
            type: 'info'
          }).then(() => {
            userLogout().then((resp) => {
              removeToken()
              removeLoginFlag()
              sessionStorage.removeItem('menu')
              sessionStorage.removeItem('isFirst')
              this.$store.state.user.menus = []
              this.$store.state.app.msgCount = 0
              
              this.$store.state.app.refresh = false
              this.$store.state.app.loginFlag = false
              this.$store.state.app.refreshPage = true
              this.$store.state.app.lastLogin = {}
              if (resp.data) {
                window.location.href = resp.data
              } else {
                this.$router.push({
                  path: '/login'
                })
              }
            })
          }).catch((error) => {
            console.log(error)
          })
        
      },
      showIcon() {
        document.getElementById('userInfo').style.display = 'inline-block'
        clearTimeout(timer)
      },
      hideIcon() {
        timer = setTimeout(function() {
          document.getElementById('userInfo').style.display = 'none'
        }, 300)
      },
      getMessage() {
        getMessageCount().then(res => {
          store.state.app.msgCount = res.data
          //this.messageCount = res.data
        })
      },
      center(unm) {
        let route = this.$route.path
        setHistory(route);
        this.$router.push({
          path: `/home/center/${unm}`
        })
      },
      goHome() {
        this.$router.push({
          path: '/home/comptroller'
        })
      },
      messageManage() {
        this.$router.push({
          name: 'messageManage'
        })
      }
    },
    mounted () {
      this.getMessage()
    }
  }
</script>

<style lang="less">
  @import '../../assets/scss/style.less';
  .to-home {
    cursor: pointer;
    display: inline-block;
    margin-left: 16px;
    margin-top: 20px;
    color: #666;
    &:hover {
      .back-icon {
        background: url('../../assets/images/back-hover.png') no-repeat;
      }
    }
    i, span {
      vertical-align: middle;
      line-height: 20px;
    }
  }
  .back-icon {
    display: inline-block;
    width: 16px;
    height: 14px;
    margin-right: 8px;
    background: url('../../assets/images/back.png') no-repeat;
  }
</style>
<style scoped>
  .logout {
    display: inline-block;
    padding-left: 22px;
    border-left: 1px solid #fff;
  }
  
</style>
