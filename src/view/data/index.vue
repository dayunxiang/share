<template>
  <div>
    <div class="page-title">数据管理</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">业务数据</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">基础数据</span>
      </p>
      <api-search @addApi="addApi" @search="search" @removeApi="removeApi" :data="total" :tabNum="tabNum"></api-search>
      <el-table :data="list" @selection-change="selectChange"  border >
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="数据名称" prop="name"  :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="价格（水利币）" prop="payStandard"  width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.isFree != '1'" class="free-color">免费</span>
            <span v-if="scope.row.isFree == '1'">{{scope.row.payStandard}}</span>
          </template>
        </el-table-column>
          
        
        <el-table-column label="发布时间" prop="createDate"  width="180">
        </el-table-column>
        <el-table-column label="状态" prop="status"  width="100">
          <template slot-scope="scope">
            <span :class="{'status-success': scope.row.status == '草稿','status-error': scope.row.status == '上架','status-disabled': scope.row.status == '下架',}">{{scope.row.status}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"  width="160" v-if="tabNum == 1">
          <template slot-scope="scope">
              <a  @click="editData(scope.row)">修改<span class="btn-space"></span></a>
              <a  @click="changeStatus2(scope.row, '', '提交成功','确认提交')" v-if="scope.row.status == '草稿'">提交<span class="btn-space"></span></a>
              <a  @click="changeStatus2(scope.row, 'on', '上架成功','确认上架')"  v-if="scope.row.status == '下架'">上架<span class="btn-space"></span></a>
              <a  @click="changeStatus2(scope.row, 'down', '下架成功','确认下架')"  v-if="scope.row.status == '上架'">下架<span class="btn-space"></span></a>
              <a  @click="apiDetail(scope.row)">查看</a>
            </template>
        </el-table-column>

        <el-table-column label="操作"  width="160" v-if="tabNum == 2">
          <template slot-scope="scope">
              <a  @click="editData(scope.row)">修改<span class="btn-space"></span></a>
              <a  @click="changeStatus(scope.row, 'draft', '提交成功','确认提交')" v-if="scope.row.status == '草稿'">提交<span class="btn-space"></span></a>
              <a  @click="changeStatus(scope.row, 'on_shelf', '上架成功','确认上架')"  v-if="scope.row.status == '下架'">上架<span class="btn-space"></span></a>
              <a  @click="changeStatus(scope.row, 'off_shelf', '下架成功','确认下架')"  v-if="scope.row.status == '上架'">下架<span class="btn-space"></span></a>
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
  import { getBaseList, batchDel, operateBase, operateBiz, getBaseDetail, getBizList, batchDelBiz } from '@/api/data/index';
  import apiSearch from './search'
  export default {
    name: 'dataCenter',
    components: {
      apiSearch
    },
    props: {

    },
    created() {
    },
    mounted() {
      if(this.$route.params.tabNum) {
        this.tabNum = this.$route.params.tabNum
      }
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
        form: {
          name: '',
          beginTime:'',
          endTime: '',
          status: '0'
        },
        page: {
          page: 1,
          size: 10
        },
        tabNum: 1
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
        if(this.tabNum == 1) {
          getBizList(param).then( res => {
            this.list = res.data.list
            this.total = res.data.total
          })
        } else if(this.tabNum == 2) {
          getBaseList({dataConditionDtoStr: JSON.stringify(param)}).then((resp) => {
            this.list = resp.data.list
            this.total = resp.data.total
          })
        }
      },
      changeTab(num) {
        this.tabNum = num
        this.form = {
          name: '',
          beginTime:'',
          endTime: '',
          status: '0'
        }
        this.getList()
        
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
      editData(data) {
        if(this.tabNum == 2) {
          this.$router.push({
            name: 'editBase',
            params: {
              id: data.id
            }
          })
        } else if(this.tabNum == 1){
          this.$router.push({
            name: 'editBiz',
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
        if(this.tabNum == 1) {
          this.$router.push({
            name: 'addBiz'
          })
        } else if(this.tabNum == 2) {
          this.$router.push({
            name: 'addBase'
          })
        }
        
      },
      search(form) {
        this.form = form
        this.getList()
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
      changeStatus2(row, status, message,info) {
        this.$confirm(info, '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {

          let param = {
            id: row.id
          }
          operateBiz(status, param.id).then((resp) => {
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
              if(this.tabNum == 1) {
                batchDelBiz(ids.join()).then((resp) => {
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
              } else if(this.tabNum == 2) {
                batchDel(ids.join()).then((resp) => {
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
              }
              
            }).catch( error => {
              console.log(error)
            })
          
        }
      },
      apiDetail(row) {
        sessionStorage.setItem('tabNum', 3)
        if(this.tabNum == 1) {
          this.$router.push({
            name: 'dataDetail',
            query: {
              id: row.id,
              businessOrNormal: 2
            }
          })
        } else if(this.tabNum == 2) {
          this.$router.push({
            name: 'dataDetail',
            query: {
              id: row.id,
              businessOrNormal: 1
            }
          })
        }
        
      }
    }
  }
</script>

<style lang="less">
  @import '../../assets/scss/self.less';
</style>


