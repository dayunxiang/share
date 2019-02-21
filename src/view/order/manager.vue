<template>
  <div>
    <div class="page-title">工单受理</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">待受理</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">待回复</span>
        <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">已解决</span>
      </p>

       <el-row class="searchBar">
        <div>
          <el-row :gutter="15">
            <el-col :span="8" >
              <span class="form-label">申请人</span>
              <el-input v-model="form.applicant" size="mini" class="form-input" maxlength="20" placeholder="请输入申请人"></el-input>
            </el-col>
            <el-col :span="8" class="height-28" >
              <span class="form-label">申请时间</span>
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
           
          </el-row>
        </div>
        <div class=" box right-btn-box search-box">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div> 
      </el-row>

     
      <el-table :data="list" border >
        <el-table-column  type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="标题" prop="title"  :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="申请部门" prop="applicantDepartment"  ></el-table-column>
        <el-table-column label="申请人" prop="applicant" ></el-table-column>
        <el-table-column label="申请时间" prop="applicantDate"  ></el-table-column>
        <el-table-column label="状态" prop="status"  :show-overflow-tooltip="true" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" class="status-blue">待受理</span>
            <span v-if="scope.row.status == '2'" class="status-error">待回复</span>
            <span v-if="scope.row.status == '3'" class="status-disabled">已解决</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="140">
          <template slot-scope="scope">
              <a  @click="orderDetail(scope.row)" v-if="tabNum == 1">处理</a>
              <a  @click="orderDetail(scope.row)" v-if="tabNum == 2">回复</a>
              <a  @click="orderDetail(scope.row)" v-if="tabNum == 3">查看</a>
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
  import {getManagerList} from '@/api/order/index';
  export default {
    name: 'orderManage',
    components: {
    },
    props: {

    },
    created() {
    },
    mounted() {
      if (this.$route.params.pageTab) {
        this.tabNum = this.$route.params.pageTab
        this.form.status = this.$route.params.pageTab
      }
      this.getList()
    },
    activated() {
      if (this.$route.params.pageTab) {
        this.tabNum = this.$route.params.pageTab
        this.form.status = this.$route.params.pageTab
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
        endTime:'',
        createTime: [],
        selection: [],
        form: {
          status: '1', 
          applicant: '',
          beginTime: '',
          endTime: ''
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
        getManagerList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      search() {
        this.page.page = 1
        this.getList()
      }, 
      reset() {
        this.form = {
          status: this.tabNum, 
          applicant: '',
          beginTime: '',
          endTime: ''
        }
        this.createTime = []
      },   
      close(data) {
        this.$confirm('确认', '确认关闭该工单？').then(() => {
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
            tabNum: this.tabNum,
            type: 'admin'
          }
        })
        
      },
      changeCreateTime() {
        if (this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.beginTime = this.createTime[0]
          this.form.endTime = this.createTime[1]
        } else {
          this.form.beginTime = ''
          this.form.endTime = ''
        }
      },
      changeTab(num) {
        this.tabNum = num
        //this.form.status = num
        this.form = {
          status: num,
          applicant: ''
        }
        this.createTime = []
        this.getList()
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


