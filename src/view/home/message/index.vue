<template>
  <div>
    <div class="page-title">消息提醒</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">未读消息</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">已读消息</span>
      </p>
      <el-table :data="list" border >
        <el-table-column  type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column label="消息内容" prop="message"  :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="时间" prop="dates"  ></el-table-column>
        <el-table-column label="状态" prop="status"   width="140" v-if="tabNum == 1">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" class="status-error">未读</span>
            <span v-if="scope.row.status == '2'" class="status-disabled">已读</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="120" v-if="tabNum == 1">
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
  </div>
</template>

<script>
  import {getMessageList, messageDetail, getMessageCount} from '@/api/message/index';
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
        total: 0,
        tabNum: 1,
        list: [],
        timeTitle: '申请时间',
        selection: [],
        form: {
          status: '1' //1为基础api，2为业务api
        },
        page: {
          page: 1,
          size: 10,
          status: 1
        },
        tabNum: 1
      }
    },
    computed: {

    },
    methods: {
      getList() {
        getMessageList(this.page).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      changeTab(tab) {
        this.tabNum = tab
        this.page.status = tab
        console.log(this.page)
        this.getList()
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
        messageDetail(row.id).then(res => {
          if(res.code == 200) {
            getMessageCount().then(res => {
              store.state.app.msgCount = res.data
            })
          }
        })
        
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
        }
        this.$router.push({
          name: route,
          params: {
            pageTab: pageTab
          }
        })

      },
      // changeTab(num) {
      //   this.tabNum = num
      //   this.form.status = num
      //   this.getList()
      //   this.timeTitle = num == 3 ? '解决时间' : (num == 4 ? '关闭时间' : '申请时间')
      // },
      addOrder() {
        this.$router.push({
          name: 'addOrder'
        })
      },
      handleCurrentChange(page) {
        this.page.page = page
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


