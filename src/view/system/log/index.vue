<template>
  <div>
    <div class="page-title">系统记录列表</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">API订阅记录</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">数据下载记录</span>
        <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">文档操作记录</span>
        <span :class="tabNum == 4 ? 'active' : ''" @click="changeTab(4)">系统访问统计</span>
      </p>
      <el-row class="searchBar">
        <div>
          <el-row :gutter="15">
            <el-col :span="7">
              <span class="form-label">用户名称</span>
              <el-input v-model="form.userName" size="mini" class="form-input" maxlength="20" placeholder="请输入用户名称"></el-input>
            </el-col>
            <el-col :span="7" v-if="tabNum == 1">
              <span class="form-label">API名称</span>
              <el-input v-model="form.apiName" size="mini" class="form-input" maxlength="20" placeholder="请输入API名称"></el-input>
            </el-col>
            <el-col :span="8" class="height-28" v-if="tabNum == 1">
              <span class="form-label">订阅时间</span>
              <el-date-picker v-model="createTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeCreateTime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" class="form-input">
              </el-date-picker>
            </el-col>
            <el-col :span="7" v-if="tabNum == 2">
              <span class="form-label">数据名称</span>
              <el-input v-model="form.name" size="mini" class="form-input" maxlength="20" placeholder="请输入申请人"></el-input>
            </el-col>
            <el-col :span="8" class="height-28" v-if="tabNum == 2">
              <span class="form-label">下载时间</span>
              <el-date-picker v-model="createDataTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDataCreateTime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" class="form-input">
              </el-date-picker>
            </el-col>
            <el-col :span="7" v-if="tabNum == 3">
              <span class="form-label">文档名称</span>
              <el-input v-model="form.name" size="mini" class="form-input" maxlength="20" placeholder="请输入申请人"></el-input>
            </el-col>
            <el-col :span="8" class="height-28" v-if="tabNum == 3">
              <span class="form-label">下载/收藏时间</span>
              <el-date-picker v-model="createDocTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDocCreateTime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" class="form-input">
              </el-date-picker>
            </el-col>
            <el-col :span="8" class="height-28" v-if="tabNum == 4">
              <span class="form-label">登录时间</span>
              <el-date-picker v-model="loginDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeLogTime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" class="form-input">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row v-if="tabNum == 3" class="mar-t-20" :gutter="15">
            <el-col :span="7">
              <span class="form-label">操作类型</span>
              <el-select size="mini" v-model="form.operateType" class="form-input">
                <el-option v-for="item in typeArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div class=" box text-right search-box">
          <el-button type="primary" size="mini" @click="statistics" v-if="tabNum == 4">统计</el-button>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div>
      </el-row>
      <div v-show="tabNum == 1">
        <div class="pu-toolbar">
          <div>
            <div class=" box left-btn-box search-box">
              <el-button size="mini" class="operateBtn" @click="batchChangeStatus('start')"><i class="iconfont  icon-qiyongzidian_huaban"></i> 启用</el-button>
              <el-button size="mini" class="operateBtn" @click="batchChangeStatus('end')"><i class="iconfont  icon-jinyongzidian_huaban"></i> 禁用</el-button>
            </div>
          </div>
        </div>
        <el-table :data="list" border @selection-change="selectChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="订阅时间" prop="apiBoughtTime" width="180"></el-table-column>
          <el-table-column label="接口类型" prop="apiMainType">
            <template slot-scope="scope">
              <span v-if="scope.row.apiMainType == '1' || scope.row.apiMainType == 2">业务接口</span>
              <span v-if="scope.row.apiMainType == 3">基础接口</span>
            </template>
          </el-table-column>
          <el-table-column label="API名称" prop="apiName"> </el-table-column>
          <el-table-column label="使用/订阅次数" prop="applicantDate">
            <template slot-scope="scope">
              <span>{{scope.row.apiCallTimes ? scope.row.apiCallTimes : 0}}</span>
              <span v-if="scope.row.apiBookedTimes">/ {{scope.row.apiBookedTimes}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="callType" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.callType == 1" class="status-blue">正常</span>
              <span v-if="scope.row.callType == 0" class="status-error">禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <a  @click="changeStatus(scope.row, 0)" v-if="scope.row.callType == '1'">禁用</a>
              <a  @click="changeStatus(scope.row, 1)" v-if="scope.row.callType == '0'">启用</a>&nbsp;
              <a  @click="apiAuthority(scope.row)" >权限设置</a>&nbsp;
              <a  @click="apiDetail(scope.row)">查看</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-table :data="list" border v-show="tabNum == 2">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="数据名称" prop="name"></el-table-column>
        <el-table-column label="下载时间" prop="downloadDate"></el-table-column>
        <el-table-column label="数据类型" prop="busnessOrNormal">
          <template slot-scope="scope">
            <span v-if="scope.row.busnessOrNormal == 1">基础数据</span>
            <span v-if="scope.row.busnessOrNormal == 2">业务数据</span>
            <span v-if="scope.row.busnessOrNormal == 3">自定义数据</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <a  @click="dataDetail(scope.row)">查看</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="list" border v-show="tabNum == 3">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="文档名称" prop="name"></el-table-column>
        <el-table-column label="下载/收藏时间" prop="operateTime"></el-table-column>
        <el-table-column label="操作类型" prop="operateType">
          <template slot-scope="scope">
            <span v-if="scope.row.operateType == 1">下载</span>
            <span v-if="scope.row.operateType == 2">收藏</span>
            <span v-if="scope.row.operateType == 3">取消收藏</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <a  @click="docDetail(scope.row)">查看</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="list" border v-show="tabNum == 4">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="登录时间" prop="createTime"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
      </el-table>
      <div class="footerPage">
        <span></span>
        <div class="rightPage">
          <el-pagination background @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getApiLogList, getDataLogList, getDocLogList, changeApiStatus, getSystemLog, batchStartApi, batchForbiddenApi } from '@/api/system/index';
export default {
  name: 'systemLog',
  components: {},
  props: {

  },
  created() {},
  mounted() {
    this.getList()
  },
  activated() {
    if (this.$route.params.type == 'init') {
      this.getList()
    }
  },
  watch: {},
  data() {
    return {
      total: 0,
      tabNum: 1,
      list: [],
      endTime: '',
      createTime: [],
      createDataTime: [],
      createDocTime: [],
      loginDate: [],
      selection: [],
      typeArray: [
        { value: '0', label: '全部' },
        { value: '1', label: '下载' },
        { value: '2', label: '收藏' },
        { value: '3', label: '取消收藏' }
      ],
      form: {},
      page: {
        page: 1,
        size: 10
      },
      selection: []
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
      if (this.tabNum == 1) {
        getApiLogList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      } else if (this.tabNum == 2) {
        getDataLogList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      } else if (this.tabNum == 3) {
        getDocLogList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      } else {
        getSystemLog(param).then(resp => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      }
    },
    selectChange(val) {//多选框选择
      this.selection = val
    },
    search() {
      this.page.page = 1
      this.getList()
    },
    reset() {
      if (this.tabNum == 1) {
        this.form = {
          userName: '',
          apiName: '',
          beginDate: '',
          endDate: ''
        }
      } else if (this.tabNum == 2) {
        this.form = {
          userName: '',
          name: '',
          downloadStartTime: '',
          downloadEndTime: ''
        }
      } else if (this.tabNum == 3) {
        this.form = {
          userName: '',
          name: '',
          operateStartTime: '',
          operateEndTime: '',
          operateType: '0',
        }
      } else {
        this.form = {
          userName: '',
          createStartTime: '',
          createEndTime: '',
        }
      }

      this.createTime = []
      this.createDataTime = []
      this.createDocTime = []
      this.loginDate = []
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
        this.form.beginDate = this.createTime[0]
        this.form.endDate = this.createTime[1]
      } else {
        this.form.beginDate = ''
        this.form.endDate = ''
      }
    },
    changeDataCreateTime() {
      if (this.createDataTime instanceof Array && this.createDataTime.length > 0) {
        this.form.downloadStartTime = this.createDataTime[0]
        this.form.downloadEndTime = this.createDataTime[1]
      } else {
        this.form.downloadStartTime = ''
        this.form.downloadEndTime = ''
      }
    },
    changeDocCreateTime() {
      if (this.createDocTime instanceof Array && this.createDocTime.length > 0) {
        this.form.operateStartTime = this.createDocTime[0]
        this.form.operateEndTime = this.createDocTime[1]
      } else {
        this.form.operateStartTime = ''
        this.form.operateEndTime = ''
      }
    },
    changeLogTime() {
      if (this.loginDate instanceof Array && this.loginDate.length > 0) {
        this.form.createStartTime = this.loginDate[0]
        this.form.createEndTime = this.loginDate[1]
      } else {
        this.form.createStartTime = ''
        this.form.createEndTime = ''
      }
    },
    changeTab(num) {
      this.tabNum = num
      this.form = {}
      if (num == 3) {
        this.form.operateType = '0'
      }
      this.createTime = []
      this.getList()
    },
    dataDetail(data) {
      sessionStorage.setItem('tabNum', 3)
      this.$router.push({
        name: 'dataDetail',
        query: {
          id: data.dataId,
          businessOrNormal: data.busnessOrNormal == 2 ? 2 : 1
        }
      })
    },
    docDetail(data) {
      sessionStorage.setItem('tabNum', 4)
      this.$router.push({
        name: 'docDetail',
        query: {
          id: data.id
        }
      })
    },
    apiDetail(data) {
      sessionStorage.setItem('tabNum', 2)
      if (data.apiMainType == 3 || data.apiMainType == 2) {
        this.$router.push({
          name: 'apiDetail',
          query: {
            id: data.apiId
          }
        })
      } else {
        this.$router.push({
          name: 'commonBasic',
          query: {
            id: data.apiId
          }
        })
      }
    },
    changeStatus(data, status) {
      let param = {
        id: data.id,
        callType: status
      }
      if (status == 0) {
        this.$confirm('确认禁用？', '确认').then(() => {
          changeApiStatus(param).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '禁用成功'
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
      } else {
        changeApiStatus(param).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '启用成功'
            })
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      }
    },
    handleCurrentChange(page) {
      this.page.page = page
      this.getList()
    },
    batchChangeStatus(type) {
      //批量启用、禁用
      if(this.selection.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要操作的记录'
        })
      } else {
        let ids = []
        this.selection.map( v => {
          ids.push(v.id)
        })
        if(type == 'start') {
          batchStartApi({
            ids: ids.join()
          }).then( res => {
            if(res.code == 200) {
              this.$message({
                type: 'success',
                message: '启用成功'
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        } else if(type == 'end'){
          batchForbiddenApi({
            ids: ids.join()
          }).then( res => {
            if(res.code == 200) {
              this.$message({
                type: 'success',
                message: '禁用成功'
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
      
    },
    apiAuthority(data) {
      this.$router.push({
        name: 'apiAuthority',
        params: {
          id: data.id
        }
      })
    },
    statistics() {
      this.$router.push({
        name: 'logStatistics'
      })
    }
  }
}

</script>
<style scoped>
.btn-box {
  margin-bottom: 20px;
}

.btn-space {
  margin: 0 3px;
}

</style>
