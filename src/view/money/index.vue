<template>
  <div>
    <div class="page-title">水利币管理</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">待处理</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">已处理</span>
        <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">发放记录</span>
      </p>

       <el-row class="searchBar">
        <div>
          <el-row :gutter="15">
            <el-col :span="8" v-if="tabNum != 3">
              <span class="form-label">申请人</span>
              <el-input v-model="form.applier" size="mini" class="form-input" placeholder="请输入申请人"></el-input>
            </el-col>
            <el-col :span="8" class="height-28" v-if="tabNum != 3">
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
            <el-col :span="8" v-if="tabNum == 2">
              <span class="form-label">处理结果</span>
              <el-select v-model="form.applicationStatus" size="mini"  class="form-input">
                <el-option v-for="(item, index) in statusArray" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="height-28" v-if="tabNum == 3">
              <span class="form-label">发放时间</span>
              <el-date-picker
                v-model="grantTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeGrantTime"
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

      <div class="btn-box">
        <el-button size="mini" class="operateBtn" @click="addRecord"><i class="iconfont icon-fabushuilibi--"></i> 发放水利币</el-button>
      </div>
      <el-table :data="list"  border v-show="tabNum != 3">
        <el-table-column  fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="申请人" prop="applier"  ></el-table-column>
        <el-table-column label="申请人部门" prop="applierDepartment" ></el-table-column>
        <el-table-column label="申请人职位" prop="applierPosition"  ></el-table-column>
        <el-table-column label="申请时间" prop="applyTime"  width="180"></el-table-column>
        <el-table-column label="申请金额（水利币）" prop="applyAmount"  ></el-table-column>
        <el-table-column label="状态" prop="applicationStatus" v-if="tabNum == 1"  ></el-table-column>
        <el-table-column label="处理结果" prop="applicationStatus" v-if="tabNum == 2" ></el-table-column>
       
        <el-table-column label="操作"  width="120" v-if="tabNum == 1">
          <template slot-scope="scope" >
              <a  @click="agree(scope.row)">同意</a>
              <span class="btn-space"></span>
              <a  @click="refuse(scope.row)" >拒绝</a>
            </template>
        </el-table-column>
      </el-table>

      <el-table :data="list2"  border v-show="tabNum == 3">
        <el-table-column  type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column label="发放账户" prop="givingAccount"  ></el-table-column>
        <el-table-column label="所在部门" prop="office" ></el-table-column>
        <el-table-column label="发放时间" prop="givingDate"  width="180"></el-table-column>
        <el-table-column label="发放数量（水利币）" prop="num" ></el-table-column>
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
    <el-dialog title="发放水利币" :visible="showMoney" width="500px" :append-to-body="true" @close="cancel">
       <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="110px">
         <el-form-item label="发放至账户：" prop="user">
           <el-input size="small" v-model="addForm.user" @keyup.enter.native="checkUser($event)" @input="checkUser($event)" @blur="blurUser"></el-input>
           <div class="user-list" v-show="userList.length > 0">
             <span v-for="item in userList" :key="item.id" @click="chooseUser(item)">{{item.userName}}</span>
           </div>
         </el-form-item>
         <el-form-item label="发放金额：" prop="money">
           <el-input size="small" v-model="addForm.money">
             <template slot="append">水利币</template>
           </el-input>
         </el-form-item>
       </el-form>
       <div class="dialog-footer">
         <el-button type="primary" size="small" @click="ensure">确定</el-button>
         <el-button  size="small" @click="cancel">取消</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getMoneyList1, getMoneyList2, getMoneyList3, agreeMoney, refuseMoney, checkUserInfo, givingMoney} from '@/api/money/index';
  export default {
    name: 'moneyManager',
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
        showMoney: false,
        isChooseUser: false,
        userId: '',
        list: [],
        list2: [],
        timeTitle: '申请时间',
        userList: [],
        grantTime: [],
        createTime: [],
        selection: [],
        statusArray: [
          {value: '4', label: '全部'},
          {value: '2', label: '已同意'},
          {value: '3', label: '已拒绝'}
        ],
        form: {
          applicationStatus: '4' 
        },
        addForm: {

        },
        addRules: {
          user: [
            {required: true, message: '请输入发放账户', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '请输入发放金额', trigger: 'blur'}
          ]
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
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let param = Object.assign({}, this.page, obj)
        this.list = []
        if (this.tabNum == 1) {
          getMoneyList1(param).then((resp) => {
            this.list = resp.data.list
            this.total = resp.data.total
            loading.close()
          })
        } else if (this.tabNum == 2) {
          getMoneyList2(param).then((resp) => {
            this.list = resp.data.list
            this.total = resp.data.total
            loading.close()
          })
        } else {
          getMoneyList3(param).then((resp) => {
            this.list2 = resp.data.list
            this.total = resp.data.total
            loading.close()
          })
        }
      },
      search() {
        this.getList()
      },
      reset() {
        this.form = {}
        this.createTime = []
        this.grantTime = []
      },
      refuse(data) {
        this.$confirm('确认拒绝该申请？', '确认').then(() => {
          refuseMoney({id: data.id}).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '处理成功'
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
      agree(data) {
        this.$confirm('确认同意该申请？', '确认').then(() => {
          agreeMoney({id: data.id}).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '处理成功'
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
      changeCreateTime() {
        if(this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.beginDate = this.createTime[0]
          this.form.endDate = this.createTime[1]
        } else {
          this.form.beginDate = ''
          this.form.endDate = ''
        }
        
      },
      changeGrantTime() {
        if(this.grantTime instanceof Array && this.grantTime.length > 0) {
          this.form.beginDate = this.grantTime[0]
          this.form.endDate = this.grantTime[1]
        } else {
          this.form.beginDate = ''
          this.form.endDate = ''
        }
        
      },
      changeTab(num) {
        this.tabNum = num
        this.reset()
        this.getList()
        this.timeTitle = num == 3 ? '解决时间' : (num == 4 ? '关闭时间' : '申请时间')
      },
      addRecord() {
        this.showMoney = true
      },
      cancel() {
        this.showMoney = false
        this.$refs.addForm.resetFields()
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      checkUser(e) {
        if (this.isChooseUser) {
          this.isChooseUser = false
        } else {
          if (/^[\u4e00-\u9fa5]+$/g.test(this.addForm.user)) {
            let param = {
              name: this.addForm.user
            }
            checkUserInfo(param).then(resp => {
              this.userId = ''
              this.userList = resp.data
            })
          } else if (this.addForm.user == '' || this.addForm.user ==  null || this.addForm.user ==  undefined) {
            this.userList = []
          }
        }
      },
      blurUser() {
        this.timer = setTimeout(() => {
          this.userList = []
          this.isChooseUser = true
          if (!this.userId) {
            this.addForm.user = ''
          }
        }, 300)
      },
      chooseUser(data) {
        this.addForm.user = data.userName
        this.userId = data.id
        this.userList = []
        this.isChooseUser = true
      },
      ensure() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let param = {
              id: this.userId,
              money: this.addForm.money
            }
            givingMoney(param).then(resp => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '发放成功'
                })
                this.$refs.addForm.resetFields()
                this.showMoney = false
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          }
        })
      },
    }
  }
</script>

<style scoped lang="less">

  .btn-box { 
    margin-bottom: 20px;
  }
  .btn-space{
    margin: 0 3px;
  }
  .search-box{
    width: 145px;
    text-align: right;
  }
  .user-list {
    position: absolute;
    width: 360px;
    max-height: 250px;
    overflow: auto;
    border: 1px solid #ccc;
    border-bottom: none;
    z-index: 10;
    line-height: 30px;
    background: #fff;
    span {
      display: inline-block;
      width: 358px;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
    }
    span:hover {
      background: #f3f3f3;
    }
  }
  .dialog-footer {
    text-align: right;
  }
</style>


