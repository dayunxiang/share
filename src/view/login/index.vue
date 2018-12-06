<template>
  <div class="login-wrap">
    <div class="logo">
      <div class="cell">
        <img :src="loginLogoUrl"/>
        <span >江西省水利数据共享系统</span>
      </div>
    </div>
    <div class="login-con">
      <div class="cell">
        <div class="login-header">
          <img :src="logoUrl">
          <span>江西省水利数据共享系统</span>
        </div>
        <div class="title">
          账号登录
        </div>
        <div class="login-box">
          <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item prop="userName">
                <i class="fa fa-user"></i>
                <el-input v-model="ruleForm.userName" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item prop="passWord">
                <i class="fa fa-unlock-alt"></i>
                <el-input v-model="ruleForm.passWord" type="password" placeholder="密码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" >登录</el-button>
              </el-form-item>
              <el-form-item>
                <a href="http://10.136.6.59:8080/HR/f/anon/resetPswd" class="link" target="_blank"><span>忘记密码？</span></a>
              </el-form-item>
            </el-form>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { postLogin } from '@/api/login/index';
  import { setCity, setToken, setUser } from '@/utils/auth';

  export default {
    name: 'login',
    data() {
      return {
        numberBtn: 0,
        login: true,
        imgUrl: '',
        logoUrl: require('@/assets/images/logo.png'),
        loginLogoUrl: require('@/assets/images/login-logo.png'),
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
      };
    },
    methods: {
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              const loading = this.$loading({
                lock: true,
                text: '登录中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
              });
              this.axios({
                url: '/manage/login',
                method: 'post',
                data: this.ruleForm
              }).then(res => {
                if (res.data.code == 200) {
                  loading.close()
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
                  localStorage.setItem('user', obj.user)
                  localStorage.setItem('token', obj.token)
                  setToken(obj.token)

                  setUser(obj.user)

                  this.$router.push({path: '/'});
                } else {
                  loading.close()
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
              }).catch( error => {
                loading.close()
                console.log(error)
              })
            } else {
              loading.close()
              return false;
            }
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .app{
    min-width: 961px !important;
  }
  body{
    width: 800px;
  }
</style>

