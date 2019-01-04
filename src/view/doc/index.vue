<template>
  <div>
    <div class="page-title">文档管理</div>
    <div class="main-container pt-oneline">
      
      <el-row class="searchBar">
        <div>
          <el-row :gutter="15">
            <el-col :span="8" >
              <span class="form-label">文档名称</span>
              <el-input v-model="form.name" size="mini" class="form-input" placeholder="请输入文档名称" maxlength="50"></el-input>
            </el-col>
            <el-col :span="8" class="height-28" >
              <span class="form-label">发布时间</span>
              <el-date-picker
                v-model="createTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeCreateTime"
                value-format="yyyy-MM-dd HH:mm:ss" size="mini"
                class="form-input">
              </el-date-picker>
            </el-col>
            <el-col :span="8" >
              <span class="form-label">状态</span>
              <el-select v-model="form.status" size="mini"  class="form-input">
                <el-option v-for="(item, index) in statusArray" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
           
          </el-row>
        </div>
        <div class=" box right-btn-box search-box">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div> 
      </el-row>

      <div class=" box left-btn-box search-box">
        <el-button size="mini"  class="operateBtn" @click="addDoc" ><i class="iconfont icon-wendangfabu_huaban_huaban"></i> 发布</el-button>
        <el-button size="mini" class="operateBtn" @click="removeDoc"><i class="iconfont icon-shanchu_huaban"></i> 删除</el-button>
      </div>

      <el-table :data="list" @selection-change="selectChange"  border >
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="文档名称" prop="name"  :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="作者" prop="author"  width="140"></el-table-column>  
        <el-table-column label="创建时间" prop="createTime"  width="180"></el-table-column>
        <el-table-column label="文件格式" prop="docType"  width="180"></el-table-column>
        <el-table-column label="状态" prop="status"  width="100">
          <template slot-scope="scope">
            <span class="status-success" v-if="scope.row.status == 1">草稿</span>
            <span class="status-error" v-if="scope.row.status == 2">上架</span>
            <span class="status-disabled" v-if="scope.row.status == 3">下架</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"  width="160" >
          <template slot-scope="scope">
              <a  @click="editDoc(scope.row)">修改<span class="btn-space"></span></a>
              <a  @click="submitDoc(scope.row)" v-if="scope.row.status == '1'">提交<span class="btn-space"></span></a>
              <a  @click="onlineDoc(scope.row)"  v-if="scope.row.status == '3'">上架<span class="btn-space"></span></a>
              <a  @click="offlineDoc(scope.row)"  v-if="scope.row.status == '2'">下架<span class="btn-space"></span></a>
              <a  @click="apiDetail(scope.row)">查看</a>
            </template>
        </el-table-column>

       
      </el-table>
      <div class="footerPage">
        <span></span>
        <div class="rightPage">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="page.page"
            :page-size="page.size"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDocList , batchDelDoc, doSubmitDoc, doOnlineDoc, doOfflineDoc} from '@/api/doc/index';
  export default {
    name: 'docCenter',
    components: {
    },
    props: {

    },
    created() {
    },
    mounted() {
     
      this.getList()
    },
    activated() {
      if (this.$route.params.type == 'init') {
        this.getList()
      }
    },
    watch:{

    },
    data() {
      return {
        total: 0,
        list: [],
        selection: [],
        createTime: [],
        statusArray:[
          {label: '全部', value: '0'},
          {label: '草稿', value: '1'},
          {label: '上架', value: '2'},
          {label: '下架', value: '3'},
        ],
        form: {
          name: '',
          beginDate:'',
          endDate: '',
          status: '0'
        },
        page: {
          page: 1,
          size: 10
        },
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      getList(obj = this.form) {
        let param = Object.assign({}, this.page, obj)
        getDocList(param).then( res => {
          this.list = res.data.list
          this.total = res.data.total
        })
        
      },
     
      selectChange(val) {//多选框选择
        this.selection = val
      },
      levelChangeSearch(val) {//搜索
        this.form = val
        this.formBak = val
        this.getList()
      },

      handleCurrentChange(val) {//分页
        this.getList(this.form);
        this.page.page = val
      },
      editDoc(data) {
        this.$router.push({
          name: 'editDoc',
          params: {
            id: data.id
          }
        })
      },
      changeCreateTime() {
        if (this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.beginDate = this.createTime[0]
          this.form.endDate = this.createTime[1]
        } else {
          this.form.beginDate = ''
          this.form.endDate = ''
        }
      },
      resetIndex(row, column, cellValue, index) {
        return index + 1 + (this.page.page - 1) * this.page.size
      },
      addDoc() {
        this.$router.push({
          name: 'addDoc'
        })
      },
      search() {
        this.page.page = 1
        this.getList()
      },
      reset() {
        this.form = {
          name: '',
          beginDate: '',
          endDate: '',
          status: '0'
        }
        this.createTime = ''
      },
      changeStatus(row, status, message,info) {
        this.$confirm(info, '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            id: row.id
          }
          operateBase(status, param.id).then((resp) => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: message
              })
              this.getList()
            }
          })
        }).catch( error => {
          console.log(error)
        })
        
      },
      submitDoc(data) {
        this.$confirm('确认提交？', '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            id: data.id
          }
          doSubmitDoc(param).then((resp) => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.getList()
            }
          })
        }).catch( error => {
          console.log(error)
        })
      },
      onlineDoc(data) {
        this.$confirm('确认上架？', '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            id: data.id
          }
          doOnlineDoc(param).then((resp) => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '上架成功'
              })
              this.getList()
            }
          })
        }).catch( error => {
          console.log(error)
        })
      },
      offlineDoc(data) {
        this.$confirm('确认下架？', '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            id: data.id
          }
          doOfflineDoc(param).then((resp) => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '下架成功'
              })
              this.getList()
            }
          })
        }).catch( error => {
          console.log(error)
        })
      },
      
      removeDoc() {
        if (this.selection.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择需要删除的数据',
            duration: 1300
          })
        } else {
          let ids = []
          this.selection.forEach((v) => {
            //if(v.status == '草稿' || v.status == '下架') {
              ids.push(v.id)
            //}
          })
         
            this.$confirm('确认删除数据？', '确认',{
              cancelButtonClass: 'btn-custom-cancel'
            }).then(() => {
              batchDelDoc({ids: ids.join()}).then((resp) => {
                if (resp.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '删除成功',
                    duration: 1300
                  })
                  this.getList()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message,
                    duration: 1300
                  })
                }
              })
              
            }).catch( error => {
              console.log(error)
            })
          
        }
      },
      apiDetail(row) {
        sessionStorage.setItem('tabNum', 4)
        this.$router.push({
          name: 'docDetail',
          query: {
            id: row.id,
            businessOrNormal: 2
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import '../../assets/scss/self.less';
   .right-btn-box{
    width: 145px;
    text-align: right;
  }
  .left-btn-box{
    margin-bottom: 20px;
  }
</style>


