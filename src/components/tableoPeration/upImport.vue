<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="问题类型" prop="region">
        <el-select v-model="ruleForm.region" placeholder="问题类型" size="small">
          <el-option label="年度" value="year"></el-option>
          <el-option label="专项" value="major"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间选择" prop="date">
        <el-date-picker type="year" placeholder="选择时间" v-model="ruleForm.date" size="small" style="width: 214px;"></el-date-picker>
      </el-form-item>
      <template v-if="ruleForm.region == 'major'">
        <el-form-item label="问题名称" prop="name">
          <el-input v-model="ruleForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="大类名称" prop="cateName">
          <el-input v-model="ruleForm.cateName" size="small"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="toLead">
      <div class="upData">
        <el-upload class="upload-demo"
                   ref="upload"
                   :action="importUrl"
                   :headers="importHeaders"
                   :on-preview="handlePreview"
                   :before-upload="beforeUpload"
                   :on-error="uploadFail"
                   :on-success="uploadSuccess"
                   :auto-upload="false"
                   with-credentials show-file-list accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :disabled="processing">
          <div class="el-row--flex">
            <el-button size="small" type="primary"plain>{{uploadTip}}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
          </div>
        </el-upload>
        <div class="download-template el-row--flex is-justify-end is-align-middle">
          <a class="btn-download" @click="download">
            <i class="el-icon-download"></i><span>下载模板</span>
          </a>
          <el-button type="primary" @click="" size="small">上传文件</el-button>
        </div>
      </div>
      <div v-if="errorVisible">
        <div class="failure-tips">
          <i class="el-icon-warning"></i>导入失败</div>
        <div class="failure-reason">
          <h4>失败原因</h4>
          <ul>
            <li v-for="(error,index) in errorResults" :key="index">第{{error.rowIdx + 1}}行，错误：{{error.column}},{{error.value}},{{error.errorInfo}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as scheduleApi from '@/api/system/schedule'
  export default {
    data() {
      return {
        ruleForm: {
          name:'',
          region: '',
          date:'',
          cateName: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入专项问题名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择问题类型', trigger: 'change' }
          ],
          date: [
            { type: 'year', required: true, message: '请选择日期', trigger: 'change' }
          ],
          cateName: [
            { required: true, message: '请选择大类名称', trigger: 'change' }
          ]
        },
        importUrl: 'https://jsonplaceholder.typicode.com/posts/',
        importHeaders:{
          enctype:'multipart/form-data'
        },
        processing: false,
        errorVisible: false,
        uploadTip:'选择文件',
        errorResults:[]
      }
    },
    methods: {
      handlePreview (file) {
        //可以通过 file.response 拿到服务端返回数据
      },
      beforeUpload(file){
        console.log(1);
        //上传前配置
        let excelfileExtend = ".xls,.xlsx"//设置文件格式
        let fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (excelfileExtend.indexOf(fileExtend) <= -1) {
          this.$message.error('文件格式错误')
          return false
        }
        this.uploadTip = '正在处理中...'
        this.processing = true
      },
      //上传错误
      uploadFail(err, file, fileList) {
        this.uploadTip = '点击上传'
        this.processing = false
        this.$message.error(err)
      },
      //上传成功
      uploadSuccess(response, file, fileList) {
        this.uploadTip = '点击上传'
        this.processing = false
        /*if(response.status == 200) {
              this.$emit('closeImportDialog')  //关闭弹框
            this.$message.info('导入成功')
            //刷新重载表格

          } else {
              this.errorVisible = true;
            this.errorResults = response.data
          }*/
      },
      clearFiles() {
        this.$refs.upload.clearFiles();
      },
      download () {
        scheduleApi.downloadTemplate();
      }
    }
  }
</script>

<style scoped>
  .toLead{
    padding: 0 20px;
  }
  .upData{
    padding-top: 30px;
    border-top: 1px solid #e5e5e5;
  }
  .btn-download {
    color: #2c79d8;
    padding-right:10px ;
  }
</style>
