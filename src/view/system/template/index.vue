<template>
  <div class="puFraming">
    <div class="el-row--flex is-justify-space-between puCommand">
      <!-- <div class="btnList">
        
          <el-button type="primary" size="small" @click="flag && handleDownload()">下载 <a href="javascript:;"  ref="downloadLink"></a><i class="fa fa-download"></i></el-button>  
      </div> -->
    </div>
        <el-table :data="list"  fit border>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="模板名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="版本号">
            <template slot-scope="scope">{{ scope.row.version }}</template>
          </el-table-column>
          <el-table-column  label="更新上传时间">
            <template slot-scope="scope">{{ scope.row.updateTime }}</template>
          </el-table-column>
          <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <el-button  class="pu-button-mini button-green" size="mini" @click="handleDownload(scope.row)">下载 <a href="http://office.mmais.com.cn/Download/Get/102218"  ref="downloadLink"></a></el-button>  
              <el-button size="mini" class="pu-button-mini button-blue" @click="importData(scope.row)">上传</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="更新模板" :visible.sync="importDialogVisible" @close="closeImportDialog" width="40%">
          <upload-template ref="importExcel" @cancel="cancel" @upload="upload" :templateName="templateName"></upload-template>
        </el-dialog> 
  </div>
</template>

<script>
  import uploadTemplate from './upload'
  import {getTemplate, uploadModel} from '@/api/system/index'
  export default {
    components: {
      uploadTemplate
    },
    data() {
      return {
        importDialogVisible: false,
        listQuery: {
          page: 1,
          limit: 10
        },
        list: null,
        total: null,
        rowId: 1,
        row: {},
        flag: true,
        templateName: ''
      }
    },
    mounted(){
      this.getList()
    },
    methods: {
      getList() {
        getTemplate().then((resp) => {
          this.list = resp.data
        })
      },
      importData(row) {
        this.importDialogVisible = true
        this.templateName = row.name
      },
      cancel() {
        this.importDialogVisible = false
      },
      upload (form) {
        let formData = new FormData()
        formData.append('name', form.name)
        formData.append('file', form.file)
        uploadModel(formData).then((resp) => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.importDialogVisible = false
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      closeImportDialog() {
        
      },
      handleDownload(row) {
        window.location.href = '/api/model/downloadModel?name=' + encodeURI(row.name) 
      }

    }
  }
</script>

<style scoped>

</style>

