<template>
  <div class="puFraming">
    <div class="el-row--flex is-justify-space-between puCommand">
      <div>
        <el-popover trigger="click" v-model="searchCardVisible" placement="bottom-start">
          <search-element @changeCardVisible="changeCardVisible" ref="searchElement"></search-element>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search" slot="reference">搜索</el-button>
        </el-popover>
      </div>
      <!-- <div class="btnList">
        <el-button type="primary" size="small" @click="importData">导入 <i class="fa fa-sign-in"></i></el-button>
      </div> -->
    </div>
        <el-table :data="list"  fit>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="单位名称" min-width="320">
            <template slot-scope="scope">{{ scope.row.unit }}</template>
          </el-table-column>
          <el-table-column  label="单位地址" min-width="320">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="top" popper-class="tip">
                <el-scrollbar style="height: 100%">
                  <div class="tipCon">{{scope.row.address}}</div>
                </el-scrollbar>
                  <div slot="reference">
                    <span class="question">{{ scope.row.address }}</span>
                  </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column  label="联系电话" min-width="200">
            <template slot-scope="scope">{{ scope.row.tel }}</template>
          </el-table-column>
          <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" class="pu-button-mini button-blue" @click="handleDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!-- <el-dialog title="导入" :visible.sync="importDialogVisible" @close="closeImportDialog">
          <import-element ref="importExcel"></import-element>
        </el-dialog> -->
        <el-dialog title="详情" :visible.sync="detailDialogVisible" width="40%">
          <detail-element :row="row"></detail-element>
        </el-dialog>
  </div>
</template>

<script>
  //import importElement from '../common/import'
  import searchElement from './search'
  import detailElement from './detailDialog'
  export default {
    components: {
      //'importElement': importElement,
      'searchElement': searchElement,
      'detailElement': detailElement
    },
    data() {
      return {
        //importDialogVisible: false,
        detailDialogVisible: false,
        searchCardVisible: false,
        listQuery: {
          page: 1,
          limit: 10
        },
        list: null,
        total: null,
        rowId: 1,
        row: {}
      }
    },
    created(){
      this.getList()
    },
    methods: {
      getList() {
        let tableData = [{
          id: 4,
          unit: '江西省水投生态资源开发集团有限公司',
          address: '江西省南昌市南昌高新技术产业开发区紫阳大道云中城A栋',
          tel: '0791-9999-8888'
        },{
          id: 5,
          unit: '江西省水务集团有限公司',
          address: '江西省南昌市南昌高新技术产业开发区紫阳大道云中城A栋',
          tel: '0791-9999-8889'
        },{
          id: 6,
          unit: '江西省水投建设有限公司',
          address: '江西省南昌市南昌高新技术产业开发区紫阳大道云中城A栋',
          tel: '0791-9999-8880'
        }]
        this.list = tableData
        this.total = tableData.length;
        //console.log(this.list)
      },
      handleDetail(row) {
        this.detailDialogVisible = true;
        this.row = row;
      },
      handleSizeChange(val) {
        /*this.listQuery.limit = val;
        this.getList();*/
      },
      handleCurrentChange(val) {
        /*this.listQuery.page = val;
        this.getList();*/
      },
      /*importData() {
        this.importDialogVisible = true
      },
      closeImportDialog() {
        if(this.$refs.importExcel !== undefined) {
          this.$refs.importExcel.clearFiles()
        }
      },*/
      search() {
        this.searchCardVisible = true
        this.$refs.searchElement.resetForm()
      },
      changeCardVisible() {
        this.searchCardVisible = false
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

