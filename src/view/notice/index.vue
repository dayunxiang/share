<template>
  <div>
    <div class="page-title">公共管理</div>
    <div class="main-container">
      
      <div class="btn-box">
        <el-button size="mini" class="operateBtn" @click="addNotice">发布公告</el-button>
      </div>
      <el-table :data="list"  border >
        <el-table-column  fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="标题" prop="name"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="时间" prop="createTime"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="状态" prop="status"  :show-overflow-tooltip="true" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" class="status-success">发布</span>
            <span v-if="scope.row.status == '2'" class="status-error">删除</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="160">
          <template slot-scope="scope">
              <a  @click="editNotice(scope.row)">修改</a>
              <span class="btn-space" ></span>
              <a  @click="noticeDetail(scope.row)">查看</a>
              <span class="btn-space" ></span>
              <a  @click="removeNotice(scope.row)" >删除</a>
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

    <el-dialog title="发布公告" :visible="showAddDialog" :append-to-body="true" width="800px" @close="cancel" v-if="showAddDialog">
      <add-notice @cancel="cancel" @init="refresh"></add-notice>
    </el-dialog>
    <el-dialog title="修改公告" :visible="showEditDialog" :append-to-body="true" width="800px" @close="cancel" v-if="showEditDialog">
      <edit-notice @cancel="cancel" :data="editData" @init="refresh"></edit-notice>
    </el-dialog>
    <el-dialog title="公告详情" :visible="showDetailDialog" :append-to-body="true" width="800px" @close="cancel" v-if="showDetailDialog">
      <edit-notice @cancel="cancel" :data="detailData" @init="refresh" type="detail"></edit-notice>
    </el-dialog>
  </div>
</template>

<script>
  import {getNoticeList, deleteNotice} from '@/api/notice/index';
  import addNotice from './addNotice'
  import editNotice from './editNotice'
  export default {
    name: 'myNotice',
    components: {
      addNotice,
      editNotice
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
        timeTitle: '申请时间',
        selection: [],
        form: {
          status: '1' //1为基础api，2为业务api
        },
        page: {
          page: 1,
          size: 10
        },
        showAddDialog: false,
        showEditDialog: false,
        showDetailDialog: false,
        editData: {},
        detailData: {},
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
        getNoticeList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },

    
      removeNotice(data) {
        this.$confirm('确认删除该公告？', '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          deleteNotice(data.id).then(resp => {
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
      },

      noticeDetail(data) {
        this.showDetailDialog = true
        this.detailData = data
      },
      editNotice(data) {

        this.showEditDialog = true
        this.editData = data
      },
      addNotice() {

        this.showAddDialog = true
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      cancel() {
        this.showAddDialog = false
        this.showEditDialog = false
        this.showDetailDialog = false
      },
      refresh() {
        this.showAddDialog = false
        this.showEditDialog = false
        this.getList()
      }
    }
  }
</script>

<style scoped>

  .btn-box { 
    margin-bottom: 20px;
  }
  .btn-space{
    margin: 0 3px;
  }
</style>


