<template>
  <div>
    <div>
      <el-row>
        <el-col :span="6" align="right">
          <span>模板名称</span>
        </el-col>
        <el-col :span="13" :offset="1">
          <!--<el-select v-model="name" size="small">
            <el-option v-for="(item, index) in nameArray" :key="index" :value="item" :label="item"></el-option>
          </el-select>-->
          <span>{{templateName}}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px;">
        <el-col :span="6" align="right">
          <span>附件</span>
        </el-col>
        <el-col :span="16" :offset="1">
          <el-upload class="upload-demo"
            ref="uploadFile"
            action=""
            :file-list="fileList"
            :limit="1"
            :on-change="onChange"
            :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
            <span slot="tip" class="el-upload__tip">只能上传excel文件</span>
          </el-upload>
        </el-col>
      </el-row>
			<el-row style="margin-top:25px;">
        <el-col :span="24" align="right">
          <el-button type="primary" size="small" @click="upload">确定</el-button>
          <el-button  size="small" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
		</div>
	
  </div>
</template>

<script>
  import miniShot from '@/components/tableoPeration/miniShot'
  import {getTemplate} from '@/api/system/index'
  export default {
    components: {
      'miniShot': miniShot
    },
    props: {
      templateName: String
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
        fileList: [],
        file: '',
        rowId: 1,
        row: {},
        flag: true,
        name: '',
        nameArray: ['606号文模板', '73号文模板', '环保厅模板']
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
      importData() {
        this.importDialogVisible = true
      },
      closeImportDialog() {
        
      },
      handleDownload(row) {
        window.location.href = '/api/model/downloadModel?name=' + row.name 
      },
      onChange (file, fileList) {
        this.file = file
        if (fileList.length > 0) {
          let type = file.name.substring(file.name.lastIndexOf('.') + 1)
          if (type != 'xlsx' && type != 'xls') {
            this.$message({
              type: 'warning',
              message: '只能上传excel文件'
            })
            this.$nextTick(() => {
              this.$refs.uploadFile.clearFiles()
            })
          }
        }
      },
      upload() {
        let form = {
          name: this.templateName,
          file: this.file.raw
        }
        this.$emit('upload', form)
      },
      cancel() {
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped>

</style>

