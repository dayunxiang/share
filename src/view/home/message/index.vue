<template>
  <div>
    <div class="page-title">消息提醒</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">普通消息</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">待办消息</span>
      </p>
      <div class="pu-toolbar">
        <el-row class="searchBar">
          <div>
            <el-row :gutter="15">
              <el-col :span="8">
                <span class="form-label">消息内容</span>
                <el-input v-model="form.message" size="mini" class="form-input" maxlength="50" placeholder="请输入消息内容">
                </el-input>
              </el-col>
              <el-col :span="8" class="height-28">
                <span class="form-label">时间</span>
                <el-date-picker
                  v-model="createTime"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="changeTime"
                  value-format="yyyy-MM-dd HH:mm:ss" size="mini"
                  class="form-input">
                </el-date-picker>
              </el-col>
              <el-col :span="8" v-if="tabNum == 1">
                <span class="form-label">状态</span>
                <el-select v-model="form.status" size="mini"  class="form-input" clearable>
                  <el-option v-for="(item, index) in statusArray" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8" v-if="tabNum == 2">
                <span class="form-label">状态</span>
                <el-select v-model="form.status" size="mini"  class="form-input" clearable>
                  <el-option v-for="(item, index) in statusArray2" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="box right-btn-box search-box">
            <el-button type="primary" size="mini" @click="search">查询</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
          </div> 
        </el-row>
         <div class=" box left-btn-box search-box" v-if="tabNum == 1">
          <el-button size="mini"  class="operateBtn" @click="batchReadMessage"><i class="fa fa-envelope-open-o"></i> 批量已读</el-button>
        </div>
      </div>

      <el-table :data="list" border @selection-change="selectChange">
        <el-table-column  type="selection" width="40" fixed v-if="tabNum == 1" key="keya"></el-table-column>
        <el-table-column  type="index" width="50" label="序号" fixed key="keyb"></el-table-column>
        <el-table-column label="消息内容" prop="message"  :show-overflow-tooltip="true" class-name="first-column" key="keyc"></el-table-column>
        <el-table-column label="时间" prop="dates"  key="keyd"></el-table-column>
        <el-table-column label="状态" prop="status"   width="140" v-if="tabNum == 1" key="keye">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" class="status-error">未读</span>
            <span v-if="scope.row.status == '2'" class="status-disabled">已读</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status"   width="140" v-if="tabNum == 2" key="keyf">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" class="status-error">未处理</span>
            <span v-if="scope.row.status == '2'" class="status-disabled">已处理</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="120" key="keyg">
          <template slot-scope="scope">
              <a  @click="orderDetail(scope.row)">详情</a>
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
    <el-dialog title="详情" :visible.sync="messageVisible" @close="closeDialog" :append-to-body="true" width="500px">
      <div>{{this.messageDetail}}</div>
    </el-dialog>
  </div>
</template>

<script>
  import {getMessageList, messageDetail, getMessageCount, batchMessageDetail} from '@/api/message/index';
  import store from '../../../store/index'
  export default {
    name: 'messageManage',
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
      this.getList()
    },
    watch:{

    },
    data() {
      return {
        messageDetail: '',
        messageVisible: false,
        total: 0,
        tabNum: 1,
        list: [],
        timeTitle: '申请时间',
        selection: [],
        form: {
          message: '',
          msgStartTime: '',
          msgEndTime: '',
          status: ''
        },
        page: {
          page: 1,
          size: 10,
          category: 0
        },
        createTime: [],
        statusArray: [
          {label: '未读', value: '1'},
          {label: '已读', value: '2'},
        ],
        statusArray2: [
          {label: '未处理', value: '1'},
          {label: '已处理', value: '2'},
        ]
      }
    },
    computed: {

    },
    methods: {
      getList() {
        let param = Object.assign({},this.page,this.form)
        getMessageList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      changeTab(tab) {
        this.reset()
        this.tabNum = tab
        this.page.category = tab == 1 ? 0 : 1
        this.getList()
      },
      closeDialog() {
        this.getList()
        this.messageVisible = false
      },
      close(data) {
        this.$confirm('确认关闭该工单？', '确认').then(() => {
          closeOrder(data.id).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '关闭成功'
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

      orderDetail(row) {
        if(this.tabNum == 1 || (this.tabNum == 2 && row.status == 2)) {
          messageDetail(row.id).then(res => {
            if(res.code == 200) {
              getMessageCount().then(res => {
                store.state.app.msgCount = res.data
              })
            }
          })
        }

        let type = row.type
        let route = ''
        let pageTab = -1
        switch (type) {
          case '1-1': route = 'myOrder'; pageTab = 1; break;
          case '1-2': route = 'myOrder'; pageTab = 2; break;
          case '1-3': route = 'myOrder'; pageTab = 3; break;
          case '1-4': route = 'myOrder'; pageTab = 4; break;
          case '1-5': route = 'orderManage'; pageTab = 1; break;
          case '1-6': route = 'orderManage'; pageTab = 2; break;
          case '1-7': route = 'orderManage'; pageTab = 3; break;
          case '2-1': route = 'moneyManager'; pageTab = 1; break;
          case '2-2': route = 'moneyManager'; pageTab = 2; break;
          case '2-3': route = 'shareMoney';  break;
          case '3-1': this.messageVisible = true; this.messageDetail = row.message; return false; break;
        }
        this.$router.push({
          name: route,
          params: {
            pageTab: pageTab
          }
        })
      },
      addOrder() {
        this.$router.push({
          name: 'addOrder'
        })
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      search() {
        this.page.page = 1
        let searchParam = Object.assign({},this.page,this.form)
        getMessageList(searchParam).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      reset() {
        this.form = {
          message: '',
          msgStartTime: '',
          msgEndTime: ''
        }
        this.createTime = []
      },
      changeTime() {
        if (this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.msgStartTime = this.createTime[0]
          this.form.msgEndTime = this.createTime[1]
        } else {
          this.form.msgStartTime = ''
          this.form.msgEndTime = ''
        }
      },
      selectChange(val) {//多选框选择
        this.selection = val
      },
      batchReadMessage() {
        if(this.selection.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择消息'
          })
        } else {
          let ids = []
            this.selection.map( v => {
              ids.push(v.id)
            })
            batchMessageDetail(ids.join()).then( res => {
              if(res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }
            })
        }
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
  .fa-envelope-open-o {
    font-size: 14px;
    font-weight: bold;
  }
</style>


