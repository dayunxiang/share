<template>
  <div>
    <div class="page-title">我的消费记录</div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">API</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">数据</span>
        <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">文库</span>
      </p>
      <div>
        <div class="pu-toolbar" style="padding: 0;">
          <div>
            <el-row class="searchBar">
              <div>
                <el-row :gutter="15">
                  <el-col :span="8">
                    <span class="form-label">消费产品</span>
                    <el-input v-model="name" size="mini" class="form-input" placeholder="请输入消费产品" maxlength="50"></el-input>
                  </el-col>
                  <el-col :span="8" class="height-28">
                    <span class="form-label">购买时间</span>
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
                </el-row>
              </div>
              <div class=" box right-btn-box search-box">
                <el-button type="primary" size="mini" @click="search">查询</el-button>
                <el-button size="mini" @click="reset">重置</el-button>
              </div> 
            </el-row>
          </div>
        </div>

        <el-table border :data="list" v-show="tabNum == 1">
          <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
          <el-table-column label="消费产品" prop="apiName" class-name="first-column"></el-table-column>
          <el-table-column label="购买时间" prop="boughtTime"></el-table-column>
          <el-table-column label="总次数" prop="totalTimes" width="100"></el-table-column>
          <el-table-column label="使用次数" prop="usedTimes" width="100"></el-table-column>
          <el-table-column label="剩余次数" prop="leftTimes" width="100"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button  type="text" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table border :data="list2" v-show="tabNum == 2">
          <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
          <el-table-column label="消费产品" prop="name" class-name="first-column"></el-table-column>
          <el-table-column label="购买时间" prop="boughtDate"></el-table-column>
          <el-table-column label="下载次数" prop="downloadTimes" width="100"></el-table-column>
          <el-table-column label="消费金额" prop="costFee" width="100"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table border :data="list3" v-show="tabNum == 3">
          <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
          <el-table-column label="消费产品" prop="name" class-name="first-column"></el-table-column>
          <el-table-column label="购买时间" prop="boughtDate"></el-table-column>
          <el-table-column label="下载次数" prop="downloadTimes" width="100"></el-table-column>
          <el-table-column label="消费金额" prop="costFee" width="100"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">详情</el-button>
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
        <el-dialog title="消费详情" :visible="showDetail" width="800px" v-if="showDetail" @close="cancel" :append-to-body="true">
          <detail :dataId="dataId" :tabNum="tabNum" :detailData="detailData"></detail>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import {getConsume, getDataConsume, getDocConsume} from '@/api/share/index'
  import detail from './detail'
  export default {
    components: {
      detail
    },
    mounted() {
      this.getList()
    },
    data() {
      return {
        tabNum: 1,
        showApply: false,
        showDetail: false,
        dataId: '',
        detailData: '',
        list: [],
        total: 0,
        list2: [],
        list3: [],
        selection: [],
        applyCount: '',
        name: '',
        createTime: [],
        form: {},
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
      getList() {
        let param = Object.assign({}, this.page, this.form)
        if(this.tabNum == 1) {
          getConsume(param).then((resp) => {
            this.list = resp.data.list
            this.total = resp.data.total
          })
        } else if(this.tabNum == 2) {
          getDataConsume(param).then( res => {
            this.list2 = res.data.list
            this.total = res.data.total
          })
        } else if(this.tabNum == 3) {
          getDocConsume(param).then( res => {
            this.list3 = res.data.list
            this.total = res.data.total
          })
        }
        
      },
      search() {
        this.page.page = 1
        if(this.tabNum == 1) {
          this.form.apiName = this.name
        } else if(this.tabNum == 2 || this.tabNum == 3) {
          this.form.name = this.name
        }
        this.getList()
      },
      detail(data) {
        this.dataId = data.id
        this.detailData = data
        this.showDetail = true
      },
      cancel() {
        this.showDetail = false
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      changeTime() {
        if(this.tabNum == 1) {
          if(this.createTime instanceof Array && this.createTime.length > 0) {
            this.form.beginDate = this.createTime[0]
            this.form.endDate = this.createTime[1]
          } else {
            this.form.beginDate = ''
            this.form.endDate = ''
          }
        } else if(this.tabNum == 2) {
          if(this.createTime instanceof Array && this.createTime.length > 0) {
            this.form.boughtStartTime = this.createTime[0]
            this.form.boughtEndTime = this.createTime[1]
          } else {
            this.form.boughtStartTime = ''
            this.form.boughtEndTime = ''
          }
        } else if(this.tabNum == 3) {
          if(this.createTime instanceof Array && this.createTime.length > 0) {
            this.form.createStartTime = this.createTime[0]
            this.form.createEndTime = this.createTime[1]
          } else {
            this.form.createStartTime = ''
            this.form.createEndTime = ''
          }
        }
      },
      reset() {
        this.form = {}
        this.name = ''
        this.createTime = []
      },
      changeTab(num) {
        this.tabNum = num
        this.name = ''
        this.createTime = []
        this.form = {}
        this.getList()
      },
    }
  }
</script>

<style scoped>
  
</style>


