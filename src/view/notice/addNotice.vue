<template>
  <div>
    <div class="main-container">
    
      <div class="tab-container" >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" >
          <el-form-item label="标题：" prop="name" class="font-right" >
            <el-input size="mini" class="form-input" v-model="form.name" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="正文：" prop="text" class="font-right" >
            <text-editor ref="addEditor" @content="getContent"  ></text-editor>
            <el-input size="mini" class="form-input" v-model="form.text" style="display:none"></el-input>
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
  import {addNotice} from '@/api/notice/index'
  import textEditor from './addEditor'
  export default {
    name: 'addNotice',
    components: {
      textEditor
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
          name: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          text: [
             {required: true, message: '请输入正文', trigger: 'blur'}
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
        this.$refs.addEditor.getContent()
      },
 
      back() {
        // this.$refs.form.resetFields()
        // this.$router.push({
        //   name: 'noticeManager',
        //   params: {
        //     type: 'init'
        //   }
        // })
        // this.$store.commit('closeTag', 'addNotice')
        this.$emit('cancel')
      },
  
      getContent(content) {
        this.form.text = content
        this.$refs.form.validate(valid => {
          if (valid) {
            addNotice(this.form).then(resp => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.$emit('init')
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          }
        })
      }
 
    }
  }
</script>

<style scoped>
 
  .btn-group{
    text-align: right;
  }
  
</style>

