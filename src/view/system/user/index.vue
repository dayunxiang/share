<template>
  <div>
    <div class="page-title">用户管理</div>

    <div class="main-container">

      <el-row class="searchBar">
        <div>
          <el-row :gutter="15">
            <el-col :span="8" >
              <span class="form-label">用户名称</span>
              <el-input v-model="form.name" size="mini" class="form-input"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class=" box right-btn-box search-box">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </div> 
      </el-row>

      <el-table :data="list"  fit border>
        <el-table-column prop="index" label="序号" width="50" :formatter="resetIndex"></el-table-column>
        <el-table-column  label="用户名称" prop="name"></el-table-column>
        <el-table-column  label="登录名称" prop="loginName"></el-table-column>
        <el-table-column  label="部门名称"  prop="officeName"></el-table-column>
        <el-table-column  label="手机"   prop="mobile"></el-table-column>
        <el-table-column  label="邮箱"  width="260"  show-overflow-tooltip>
          <template slot-scope="scope"><span>{{ scope.row.email }}</span></template>
        </el-table-column>
        <el-table-column width="120" label="操作">
          <template slot-scope="scope">
            <a @click="handleDetail(scope.row)" >详情</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="footerPage">
        <div class="rightPage">
          <el-pagination  @current-change="handleCurrentChange" :current-page="page.page"  :page-size="page.size"  :total="total"> </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="详情" :visible.sync="detailDialogVisible" :append-to-body="true" width="400px">
      <detail-element :row="row"></detail-element>
    </el-dialog> 
  </div>
</template>

<script>
  import {getUser} from '@/api/system/index'
  import detailElement from './detailDialog'
  export default {
    name: 'userManager',
    components: {
      detailElement
    },
    data() {
      return {
        detailDialogVisible: false,
        list: null,
        total: null,
        row: {},
        form: {
          name: ''
        },
        page: {
          page: 1,
          size: 10
        }
      }
    },
    mounted(){
      this.getList()
     
    },
    methods: {
      getList(obj = this.form) {
        let param = Object.assign({}, this.page, this.form)
        getUser(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })    
      },
      search() {
        this.page.page = 1
        this.getList()
      },
      handleDetail(row) {
        this.detailDialogVisible = true;
        this.row = row;
      },

      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
  

     
      resetIndex(row, column, cellValue, index) {
        return index + 1 + (this.page.page - 1) * this.page.size  
      }
    }
  }
</script>

<style scoped>
.pagination-container {
  background-color: #fff;
  padding: 20px;
}
</style>

