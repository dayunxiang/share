<template>
  <div class="open">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-row>
        <el-col :md="12" :lg="8" :xl="8">
          <el-form-item label="问题类型" prop="name">
            <el-select v-model="ruleForm.name" placeholder="请选择" size="small">
              <el-option label="问题1" value="wt1"></el-option>
              <el-option label="问题2" value="wt2"></el-option>
              <el-option label="问题3" value="wt3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8" :xl="8">
          <el-form-item label="责任单位" prop="issue">
            <el-select v-model="ruleForm.issue" placeholder="请选择" size="small">
              <el-option label="单位1" value="tw1"></el-option>
              <el-option label="单位2" value="tw2"></el-option>
              <el-option label="单位3" value="tw3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8" :xl="8">
          <el-form-item label="业务部门" prop="duty">
            <el-select v-model="ruleForm.duty" placeholder="请选择" size="small">
              <el-option label="部门1" value="bm1"></el-option>
              <el-option label="部门2" value="bm2"></el-option>
              <el-option label="部门3" value="bm3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8" :xl="8">
          <el-form-item label="分管领导">
            <el-select v-model="ruleForm.leader" placeholder="请选择" size="small">
              <el-option label="领导1" value="bm1"></el-option>
              <el-option label="领导2" value="bm2"></el-option>
              <el-option label="领导3" value="bm3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8" :xl="8">
          <el-form-item label="问题大类" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择" size="small">
              <el-option label="年度" value="bm1"></el-option>
              <el-option label="专项" value="bm2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8" :xl="8">
          <el-form-item label="归属时间" prop="typeTime">
            <el-date-picker type="year" placeholder="请选择" v-model="ruleForm.typeTime" size="small" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="大类标题" prop="title">
        <el-input type="textarea" v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="监事会意见建议" prop="idea">
        <el-input type="textarea" v-model="ruleForm.idea"></el-input>
      </el-form-item>
      <el-form-item label="问题描述" prop="describe">
        <el-input type="textarea" v-model="ruleForm.describe"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="ruleForm.desc" placeholder="请填写备注信息"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitClose('ruleForm')">保存关闭</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存继续录入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props:{
      dataRow:{
        type: Object,
        default:{
          describe: '',
          name: '',//问题类型
          issue: '',
          duty: '',
          typeTime:'', //归属时间
          leader:'',
          type: '',//问题大类
          title: '', //大类标题
          advice:'',
          desc: ''
        }
      }
    },
    created(){
      this.ruleForm = this.dataRow
    },
    data(){
      return {
        ruleForm: {
          describe: '',
          name: '',//问题类型
          issue: '',
          duty: '',
          typeTime:'', //归属时间
          leader:'',
          type: '',//问题大类
          title: '', //大类标题
          idea:'',
          desc: ''
        },
        rules: {
          describe: [
            { required: true, message: '请输入问题描述', trigger: 'blur' },
            { min: 3, max: 2000, message: '字符数3-2000', trigger: 'blur' }
          ],
           idea: [
            { required: true, message: '请输入监事会意见建议', trigger: 'blur' },
            { min: 3, max: 2000, message: '字符数3-2000', trigger: 'blur' }
          ],
           title: [
            { required: true, message: '请输入大类标题', trigger: 'blur' },
            { min: 3, max: 2000, message: '字符数3-2000', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请选择问题类型', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请选择问题大类', trigger: 'change' }
          ],
          issue: [
            { required: true, message: '请选择责任单位', trigger: 'change' }
          ],
          duty: [
            { required: true, message: '请选择业务部门', trigger: 'change' }
          ],
          typeTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.describe = '';
            this.ruleForm.desc = '';

            //this.$emit('on-from');
            //alert('submit!');
          } else {
            //console.log('error submit!!');
            return false;
          }
        });
      },
      submitClose(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('on-from');
            //alert('submit!');
          } else {

            //console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .puFraming .el-row{
    margin-bottom: 0;
  }
</style>


