<template>
  <div>
    <div class="page-title">我的工单列表</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">待受理</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">待回复</span>
        <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">已解决</span>
        <span :class="tabNum == 4 ? 'active' : ''" @click="changeTab(4)">已关闭</span>
      </p>
      <div class="btn-box">
        <el-button size="mini" class="operateBtn" @click="addOrder"><i class="iconfont icon-xinjiangongdan_huaban"></i> 新建工单</el-button>
      </div>
      <el-table :data="list"  border >
        <el-table-column  fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="标题" prop="title"  :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        
        <el-table-column label="受理部门" prop="acceptDepartment" v-if="tabNum != 1" ></el-table-column>
        <el-table-column label="受理人" prop="acceptor"  v-if="tabNum != 1"></el-table-column>
        <el-table-column :label="timeTitle" prop="applicantDate"  ></el-table-column>
        <el-table-column label="状态" prop="status"  :show-overflow-tooltip="true" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'">待受理</span>
            <span v-if="scope.row.status == '2'">待回复</span>
            <span v-if="scope.row.status == '3'">已解决</span>
            <span v-if="scope.row.status == '4'">已关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="120">
          <template slot-scope="scope">
              <a  @click="orderDetail(scope.row)">查看</a>
              <span class="btn-space" v-if="tabNum == 1 || tabNum == 2"></span>
              <a  @click="close(scope.row)" v-if="tabNum == 1 || tabNum == 2">关闭</a>
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
  import {getOrderList, closeOrder} from '@/api/order/index';
  export default {
    name: 'myOrder',
    components: {
    },
    props: {

    },
    created() {
    },
    mounted() {
      if (this.$route.params.pageTab) {
        this.tabNum = this.$route.params.pageTab
      }
      this.getList()
    },
    activated() {
      if (this.$route.params.pageTab) {
        this.tabNum = this.$route.params.pageTab
        this.getList()
      } else if (this.$route.params.type == 'init') {
        this.getList()
      }
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
        getOrderList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },

    
      close(data) {
        this.$confirm('确认关闭该工单？', '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
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
        this.$router.push({
          name: 'orderDetail',
          params: {
            id: row.id,
            type: 'detail',
            tabNum: this.tabNum
          }
        })
        
      },
      changeTab(num) {
        this.tabNum = num
        this.form.status = num
        this.getList()
        this.timeTitle = num == 3 ? '解决时间' : (num == 4 ? '关闭时间' : '申请时间')
      },
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


