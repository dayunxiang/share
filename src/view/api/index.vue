<template>
  <div>
    <div class="page-title">API管理</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">业务API</span>
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">基础API</span>
      </p>
      <api-search @addApi="addApi" @search="search" @removeApi="removeApi" :data="total" :tabNum="tabNum"></api-search>
      <el-table :data="list" @selection-change="selectChange"  border >
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="API标题" prop="apiName"  :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="接口地址" prop="apiUrl"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="价格（水利币）" prop="payStandard"  width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.isFree != '1'" class="free-color">免费</span>
            <span v-if="scope.row.isFree == '1'">{{scope.row.payStandard}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="apiCreateTime"  width="180">


        </el-table-column>
        <el-table-column label="状态" prop="status"  width="100">
          <template slot-scope="scope">
            <span :class="{'status-success': scope.row.status == '草稿','status-error': scope.row.status == '上架','status-disabled': scope.row.status == '下架',}">{{scope.row.status}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"  width="160">
          <template slot-scope="scope">
              <a  @click="editData(scope.row)">修改<span class="btn-space"></span></a>
              <a  @click="changeStatus(scope.row, '2', '提交成功', '确认提交')" v-if="scope.row.status == '草稿'">提交<span class="btn-space"></span></a>
              <a  @click="changeStatus(scope.row, '2', '上架成功', '确认上架')"  v-if="scope.row.status == '下架'">上架<span class="btn-space"></span></a>
              <a  @click="changeStatus(scope.row, '3', '下架成功', '确认下架')"  v-if="scope.row.status == '上架'">下架<span class="btn-space"></span></a>
              <a  @click="apiDetail(scope.row)">查看</a>
            </template>
        </el-table-column>
      </el-table>

      <div class="footerPage">
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
  import {getDataList, submitData} from '@/api/api/index';
  import apiSearch from './search'
  export default {
    name: 'apiCenter',
    components: {
      apiSearch
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
        tabNum: 2,
        list: [],
        selection: [],
        form: {
          apiMainType: '2' //1为基础api，2为业务api
        },
        page: {
          page: 1,
          size: 10
        }
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
        getDataList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      selectChange(val) {//多选框选择
        this.selection = val
      },
      onDoing(row, column, cell, event) {//单机单元格
        if (column.label == "水电站名称") {
          this.listId = row.cwcbDataId;
          this.dialogParticulars = true;
        }
      },
      
    
      doDelete(form) {
        let formData = new FormData()
        formData.append('cwcbDataId', this.row.cwcbDataId)
        for (let i = 0, len = form.files.length; i < len; i++) {
          formData.append('file', form.files[i])
        }
        getDeleteModify(formData).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.isShowDeleteDialog = false
            this.getList(this.form)
          }
        })
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

      editData(data) {
        if (this.tabNum == 2) {
          this.$router.push({
            name: 'editApi',
            params: {
              id: data.id
            }
          })
        } else {
          this.$router.push({
            name: 'editBasicApi',
            params: {
              id: data.id
            }
          })
        }
       
      },
      resetIndex(row, column, cellValue, index) {
        return index + 1 + (this.page.page - 1) * this.page.size
      },
      addApi() {
        if (this.tabNum == 2) {
          this.$router.push({
            name: 'addApi'
          })
        } else {
          this.$router.push({
            name: 'addBasicApi'
          })
        }
      },
      search(form) {
        this.form = form
        this.getList()
      },
      changeStatus(row, status, message,  info) {
        this.$confirm(info, '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            apiStatusDtos: [{
              id: row.id,
              status: status
            }]
          }
          submitData(param).then((resp) => {
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
      removeApi() {
        if (this.selection.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择需要删除的API'
          })
        } else {
          this.$confirm('确认删除API？', '确认', {
            cancelButtonClass: 'btn-custom-cancel'
          }).then(() => {
            let param = {
              apiStatusDtos: []
            }
            this.selection.forEach((v) => {
              let data = {
                id: v.id,
                status: '4'
              }
              param.apiStatusDtos.push(data)
            })
            submitData(param).then((resp) => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          })
        }
      },
      apiDetail(row) {
        sessionStorage.setItem('tabNum', 2)
        if (this.tabNum == 2) {
          this.$router.push({
            name: 'apiDetail',
            query: {
              id: row.id
            }
          })
        } else {
          this.$router.push({
            name: 'commonBasic',
            query: {
              id: row.id
            }
          })
        }
        
      },
      changeTab(num) {
        this.tabNum = num
        //this.form.apiMainType = num
        this.form = {
          apiMainType: num,
          apiNameParam: '',
          apiCreateBeginTime: '',
          apiCreateEndTime: '',
          status: ''
        }
        this.getList()
      }
    }
  }
</script>

<style scoped>
  /*.puFraming {
    padding-top: 10px;
    padding-bottom: 40px;
  }*/
  .puTableHeader {
    border: 1px solid #ccc;
    border-bottom: none;
    text-align: center;
    margin: 0;
  }
</style>


