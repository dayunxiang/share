<template>
  <div class="app" :class="{'hide-scroll': loginFlag}">
    <router-view v-if="isRouterAlive"></router-view>
    <div class="shade" v-show="loginFlag">
      <div class="login-container">
        <span class="login-cancel" @click="closeLogin">
          <i class="el-icon-close"></i>
        </span>
        <div class="title">账号登录</div>
        <div class="user-info">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="userName">
              <el-input v-model="ruleForm.userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="passWord">           
              <el-input v-model="ruleForm.passWord" type="password" placeholder="密码" @keyup.enter.native="submitForm()"></el-input>
            </el-form-item>
            <el-form-item class="mar-b-16">
              <el-button type="primary" @click="submitForm()" class="login-btn" size="small">登录</el-button>
            </el-form-item>            
          </el-form>
          <div class="find-password">
            <a href="#">忘记密码？</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*编写方法*/
  import axios from 'axios'
  import { setCity, setToken, setUser,setMenus } from '@/utils/auth'
  import {fetchTree, getUserMenu} from '@/api/system/menu/index';
  export default {
    name: 'App',
    data () {
      return {
        isRouterAlive: true,
        myVal: '',
        ruleForm: {
          userName: '',
          passWord: ''
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          passWord: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      //this.init()
      //this.getMenus()
    },
    computed: {
      loginFlag() {
        return this.$store.state.app.loginFlag
      }
    },
    methods: {
      getMenus() {
        getUserMenu().then(resp => {
          this.menus = resp.data
          this.$store.state.app.menus = resp.data
        })
      },
      closeLogin() {
        this.$store.state.app.loginFlag = false
      },
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.axios({
              url: '/manage/login',
              method: 'post',
              data: this.ruleForm
            }).then(res => {
              if (res.data.code == 200) {
                this.$store.state.app.loginFlag = false
                let cookie = decodeURIComponent(document.cookie)
                let arr = cookie.split(';')
                let obj = {}
                arr.forEach(v => {
                  if (v.indexOf('token') > -1) {
                    obj['token'] = v.split('=')[1]
                  }
                  if (v.indexOf('user') > -1) {
                    obj['user'] = v.split('=')[1]
                  }
                })
                setToken(obj.token)
                setUser(obj.user)
                this.isRouterAlive = false;
                this.$nextTick(function(){
                  this.isRouterAlive = true;
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            })
          } else {
            return false;
          }
        })
      },
      init() {
        let cookie = document.cookie
        if (cookie.indexOf('token') > -1 && cookie.indexOf('name') > -1) {
          //已登录
        } else {
          axios({
            url: 'http://192.168.5.190:8080/routing/manage/third_party_login',
            method: 'get',
            params: {} 
          }).then( resp => {
            let userCookie = decodeURIComponent(document.cookie)
            let arr = userCookie.split(';')
            let obj = {}
            arr.forEach(v => {
              if (v.indexOf('token') > -1) {
                obj['token'] = v.split('=')[1]
              }
              if (v.indexOf('user') > -1) {
                obj['user'] = v.split('=')[1]
              }
            })
            setToken(obj.token)
            setUser(obj.user)

          })
        }

      }
    }
  }
</script>

<style lang="less">
  @import './assets/scss/data.less';
  .app{
    height: 100%;
    min-width: 1000px;
  }
</style>
