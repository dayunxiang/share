<template>
  <div class="puFraming">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div class="title">
            <span>基本信息</span>
          </div>
          <ul class="pu-dialog-detail" :model="form">
            <li class="el-row--flex"><span class="th">用户名：</span><span class="td">{{form.nickname}}</span></li>
            <li class="el-row--flex"><span class="th">真实姓名：</span><span class="td">{{form.name}}</span></li>
            <li class="el-row--flex"><span class="th">性别：</span><span class="td">{{form.sex}}</span></li>
            <li class="el-row--flex"><span class="th">联系方式：</span><span class="td">{{form.tel}}</span></li>
            <li class="el-row--flex"><span class="th">邮箱：</span><span class="td">{{form.email}}</span></li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div class="title">
            <span>消息提示设置</span>
          </div>
          <div>
            <span>接收方式：</span>
            <el-form>
              <el-form-item>
                <el-checkbox-group v-model="checkList" @change="checkboxChange">
                 <!--  <el-checkbox label="系统内部通知" :disabled="checkFormEdit"></el-checkbox> -->
                  <el-checkbox label="水投之家"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkFormEdit: true,
        sexOptions: ['男', '女'],
        form: {
          nickname: 'username',
          name: '张三',
          sex: '男',
          tel: '13767359876',
          email: '1786543897@qq.com'
        },
        checkList: ['水投之家']
      }
    },
    methods: {
      checkboxChange(val) {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: '2000'
        });
      }
    }
  }
</script>

<style scoped>
  .title {
    margin-bottom: 20px;
  }
  .title span {
    font-size: 16px;
    font-weight: bold;
    margin-right: 30px;
  }
  .title+div>span {
    display: inline-block;
    font-size: 14px;
    margin-bottom: 16px;
  }
  .box-card {
    height: 100%;
  }
</style>
