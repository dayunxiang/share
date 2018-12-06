<template>
  <div>
    <p class="page-title">新建工单</p>
    <div class="main-container">
    
      <div class="tab-container" >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" >
          <el-form-item label="标题：" prop="title" class="font-right" >
            <el-input size="mini" class="form-input" v-model="form.title" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone" class="font-right" >
            <el-input size="mini" class="form-input" v-model="form.phone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="咨询模块：" class="font-right" >
            <el-select v-model="form.queryModule" size="mini" class="form-input" >
              <el-option v-for="(item, index) in questionTypeArray" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述：" prop="question" class="font-right" >
            <el-input type="textarea" size="mini" class="radius" v-model="form.question" maxlength="400"></el-input>
          </el-form-item>
        </el-form>
      
      </div>


      <div class="btn-group">
        <el-button type="primary" size="mini" @click="save" >提交</el-button>
        <el-button size="mini" @click="back" >返回</el-button>
      </div>
    
    
    </div>
  </div>
</template>

<script>
  import {addOrder} from '@/api/order/index'
  export default {
    name: 'addOrder',
    components: {
      
    },
    props: {
      
    },
 
    mounted() {

    },
    data() {
      return {
        questionTypeArray: [
          {value: '1', label: '数据下载'},
          {value: '2', label: '充值付费'},
          {value: '3', label: '账户设置'}
        ],
        form: {
          queryModule: ''
        },
       
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          phone: [
            {validator: this.checkPhone, trigger: 'blur'}
          ],
          question: [
            {required: true, message: '请输入问题描述', trigger: 'blur'}
          ],
        },
        
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
    
      save() {
        addOrder(this.form).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.$router.push({
              name: 'myOrder',
              params: {
                type: 'init'
              }
            })
            this.$store.commit('closeTag', 'addOrder')
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
 
      back() {
        this.$refs.form.resetFields()
        this.$router.push({
          name: 'myOrder',
          params: {
            type: 'init'
          }
        })
        this.$store.commit('closeTag', 'addOrder')
      },
      checkPhone(rule, value, callback) {
        if (value == '' || value == null || value == undefined) {
          callback()
        } else if (!/1[3,4,5,7,8,9]\d{9}/.test(value)) {
          callback(new Error('手机格式错误'))
        } else {
          callback()
        }
      }
 
    }
  }
</script>

<style scoped>
  button a {
    color: #606266;
  }
  button:hover a {
    color: #3a8ee6;
  }
  .box-outer{
    table-layout: fixed;
  }
  .search-box{
    width: 100%
  }
  .btn-box{
    vertical-align: top;
    height: 100%;
  }
  .btnhide{
    position: absolute;
    right: 0;
    height: 0;
    bottom: 0;
  }
  .btnhide{
    width: 0;
  }
  
</style>

