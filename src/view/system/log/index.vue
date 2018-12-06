<template>
  <div class="hintMain">
    <div class="pu-toolbar">
      <div class="inputBordetTitle tallScreen mar-top-10">
        <search-element @changeCardVisible="changeCardVisible"></search-element>
      </div>
    </div>
    <div class="puFraming">
      <el-table ref="multipleTable" :data="list" @selection-change="selectChange" @cell-click="onDoing" stripe border
              style="width: 100%;">
        <el-table-column fixed type="selection" width="30"></el-table-column>
        <el-table-column prop="index" label="序号" width="60" :formatter="resetIndex"></el-table-column>
        <el-table-column label="用户名" prop="logUser" width="100"></el-table-column>
        <el-table-column label="所属部门" prop="logDataDept" width="120"></el-table-column>
        <el-table-column label="操作菜单" prop="logDataTitle" width="120" class-name="pointer"></el-table-column>
        <el-table-column label="日志内容" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope" >
            <span v-html="delHtmlTag(scope.row.logContent)"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="logDatetime" width="160"></el-table-column>
        <el-table-column label="IP地址" prop="logOpIp" width="120"></el-table-column>
      </el-table>
      <div class="footerPage">
        <!-- <span>提示：点击日志标题查看详情</span> -->
        <div class="rightPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.page"
            layout="total,sizes, prev, pager, next, jumper"
            :page-sizes="[15, 50, 100, 200]"
            :page-size="15"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <template v-if="dialogParticulars">
        <el-dialog title="详情" :visible.sync="dialogParticulars" width="1000px">
          <de-tails :listId="dataId"></de-tails>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogParticulars = false" size="mini">确 定</el-button>
        </span>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script>
  import {getAllData} from '@/api/journal/index';
  import jhButtons from './buttons.vue';
  import deTails from './details.vue';
  import searchElement from './search'

  export default {
    components: {
      jhButtons,
      deTails,
      searchElement
    },
    created() {
      this.getList(this.page.page, this.page.size);
    },
    data() {
      return {
        dialogParticulars: false,
        selection: [],
        list: [],
        searchCardVisible: false,
        page: {
          page: 1,
          size: 15
        },
        total: 0,
        dataId: '',
        from: ''
      }
    },
    methods: {
      getList(p, z, obj) {
        getAllData(p, z, obj).then(res => {
          this.list = res.data.list;
          this.total = res.data.total;
        });
      },
      selectChange(val) {
        this.selection = val
      },
      onDoing(row, column, cell, event) {
        if (column.label == "日志标题") {
          this.dialogParticulars = true;
          this.dataId = row.id;
        }
      },
      changeSearch(val) {
        this.from = val;
        this.getList(this.page.page, this.page.size, val);
      },
      handleSizeChange(val) {//每页请求条数
        this.page.size = val
        this.getList(this.page.page, val, this.from);
      },
      handleCurrentChange(val) {//分页
        this.page.page = val
        this.getList(val, this.page.size, this.from);
      },
      resetIndex(row, column, cellValue, index) {
        return index + 1 + (this.page.page - 1) * this.page.size
      },
      search() {
        this.searchCardVisible = true
      },
      changeCardVisible(form) {
        //this.searchCardVisible = false
        this.getList(this.page.page, this.page.size, form);
        this.from = form
      },
      delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, "");
      }
    }
  }
</script>

<style scoped>
  /*.puFraming {
    padding-top: 10px;
    padding-bottom: 40px;
  }*/
</style>


