<template>

  <div class="userinfo-edit">
    <p class="page-tab">
      <span :class="!isEditPassword ? 'active' : ''" @click="changeTab(1)">个人信息</span>
      <span :class="isEditPassword ? 'active' : ''" @click="changeTab(2)">修改密码</span>
    </p>
    <div v-show="!isEditPassword">
      <el-form :model="userForm" :rules="userRules" label-position="left" size="small" label-width="95px" ref="userForm">
        <el-form-item label="用户名：">
          {{userInfo.userName}}
        </el-form-item>
        <el-form-item label="姓名：">
          {{userInfo.userName}}
        </el-form-item>
        <el-form-item label="邮箱：" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="请输入邮箱" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="userTel">
          <el-input v-model="userForm.userTel" placeholder="请输入电话" ></el-input>
        </el-form-item>
        <el-form-item label="所属部门：">
          {{userInfo.userDept}}
        </el-form-item>
        <el-form-item label="行政区划：">
          {{userInfo.areaName}}
        </el-form-item>
      </el-form>
      <div class="button-con">
        <el-button type="primary" size="small" class="padding-20" @click="saveUserInfo">保存</el-button>
      </div>
    </div>

    <div v-show="isEditPassword">
      <el-form :model="passwordForm" :rules="passwordRule" label-position="left" size="small" label-width="95px" ref="passwordForm">
        <el-form-item label="原密码：" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" maxlength="18" placeholder="请输入原密码" ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" maxlength="18" placeholder="请输入新密码" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="newConfirmPassword">
          <el-input type="password" v-model="passwordForm.newConfirmPassword" maxlength="18" placeholder="请再次输入新密码"  ></el-input>
        </el-form-item>
      </el-form>
      <div class="button-con">
        <el-button type="primary" size="small" class="padding-20" @click="savePassword">保存</el-button>
      </div>
    </div>
  </div>

</template>

<script>
  import {getHistory} from '@/utils/auth'
  import {getUserInfo, saveUser, updatePassword} from '@/api/index/index';
  export default {
    mounted() {
      this.getUser();
      if(this.$route.params.id==1){
        this.isEditPassword = true
      }else {
        this.isEditPassword = false
      }
    },
    data() {
      return {
        isEditPassword: false,
        userForm: {
          userTel: '',
          userEmail: ''
        },
        passwordForm: {},
        userInfo: {},
        userRules: {
          userEmail: [
             { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          userTel: [
             { validator: this.validPhone, trigger: 'blur' }
            
          ]
        },
        passwordRule: {
          oldPassword: [
             { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          newPassword: [
             { required: true, min: 6, message: '请输入6到18位的新密码', trigger: 'blur' }
          ],
          newConfirmPassword: [
             { required: true, min: 6, message: '请再次输入新密码', trigger: 'blur' },
             { validator: this.checkPass, trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      getUser() {
        getUserInfo().then((resp) => {
          this.userInfo = resp.data[0]
          this.userForm.userTel = this.userInfo.userTel
          this.userForm.userEmail = this.userInfo.userEmail
        })
      },
      changeTab(flag) {
        if (flag == 1) {
          this.isEditPassword = false
        } else {
          this.isEditPassword = true
        }
      },
      validPhone(rule, value, callback) {
        if (value == null || value == '' || value == undefined) {
          callback()
        } else if (!/^1[3,4,5,7,8,9]\d{9}$/.test(value)) {
          callback(new Error('电话格式错误'))
        } else {
          callback()
        }
      },
      saveUserInfo() {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            saveUser(this.userForm).then((resp) => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          } else {
            return false
          }
        })
      },
      savePassword() {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            updatePassword(this.passwordForm).then((resp) => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          } else {
            return false
          }
        })
      },
      checkPass(rule, value, callback) {
        if (value != this.passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一样'))
        } else {
          callback()
        }
      }
    }
  }
</script>

<style scoped>

</style>


