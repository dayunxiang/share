<template>
  <div>
    <div class="page-title">账户流水</div>
    <div class="main-container">
      <div class="mar-20">
        <div class="pu-toolbar" style="padding: 0;">
          <div>
            <el-row class="searchBar">
              <div>
                <el-row :gutter="15">
                  <el-col :span="8">
                    <span class="form-label">对象名称</span>
                    <el-input v-model="form.name" size="mini" class="form-input" placeholder="请输入对象名称"></el-input>
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
                 
                  <el-col :span="8">
                    <span class="form-label">类型</span>
                    <el-select v-model="form.actionType" size="mini " class="form-input"> 
                      <el-option v-for="item in typeArray" :key="item.id" :value="item.value" :label="item.label"></el-option>
                    </el-select>
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

        <el-table border :data="list" >
          <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
          <el-table-column label="对象名称" prop="name" class-name="first-column"></el-table-column>
          <el-table-column label="时间" prop="dates"></el-table-column>
          <el-table-column label="业务" prop="busiTypeValue" width="100"></el-table-column>
          <el-table-column label="操作类型" prop="actionTypeValue" width="100"></el-table-column>
          <el-table-column label="单价" prop="price" width="100"></el-table-column>
          <el-table-column label="金额" prop="costFee" width="100"></el-table-column>
          <el-table-column label="购买数量" prop="boughtNum" width="100"></el-table-column>     
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
  </div>
</template>

<script>
  import {getSerialList} from '@/api/share/index'
  export default {
    name: 'serialList',
    components: {
    },
    mounted() {
      this.getList()
    },
    data() {
      return {
        dataId: '',
        list: [],
        total: 0,
        createTime: [],
        typeArray: [
          {value: '0', label: '全部'},
          {value: '1', label: '订阅'},
          {value: '2', label: '续费'},
          {value: '3', label: '下载'}
        ],
        form: {
          name: '',
          actionType: '0',
          beginDate: '',
          endDate: ''
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
      getList() {
        let param = Object.assign({}, this.page, this.form)
        getSerialList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      search() {
        this.page.page = 1
        this.getList()
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      changeTime() {
        if(this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.beginDate = this.createTime[0]
          this.form.endDate = this.createTime[1]
        } else {
          this.form.beginDate = ''
          this.form.endDate = ''
        }
        
      },
      reset() {
        this.form = {
          name: '',
          actionType: '0',
          beginDate: '',
          endDate: ''
        }
        this.createTime = []
      },
      
    }
  }
</script>

<style scoped>
  
</style>


