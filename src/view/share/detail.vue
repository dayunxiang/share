<template>
  <div>
    <div v-if="tabNum == 1">
      <div>
        <div class="detail-header">
          <p><span class="color666">产品名称：</span>{{detailData.apiName}}</p>
          <p class="fl"><span class="color666">购买时间：</span>{{detailData.boughtTime}}</p>
          <p class="fl"><span class="color666">购买次数：</span>{{detailData.totalTimes}}<span class="color666">次</span></p>
        </div>
        <div class="pd20">
          <span>已使用<span class="red-font"> {{detailData.usedTimes}} </span>次，</span><span>剩余<span class="red-font"> {{detailData.leftTimes}} </span>次</span>
        </div>
      </div>
      <el-table border :data="list">
        <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
        <el-table-column label="调用时间" prop="callTime"></el-table-column>
        <el-table-column label="调用IP" prop="callIp"></el-table-column>
        <el-table-column label="剩余次数" prop="restTimes"></el-table-column>
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
    <div v-if="tabNum == 2">
      <div>
        <div class="detail-header">
          <p><span class="color666">产品名称：</span>{{detailData.name}}</p>
          <p class="fl"><span class="color666">购买时间：</span>{{detailData.boughtDate}}</p>
          <p class="fl"><span class="color666">下载次数：</span>{{detailData.downloadTimes}}<span class="color666">次</span></p>
        </div>
        <div class="pd20">
          <span>产品单价</span><span class="red-font"> {{detailData.price}} </span><span>水利币/次</span>
        </div>
      </div>
      <el-table border :data="list">
        <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
        <el-table-column label="下载时间" prop="downloadDate"></el-table-column>
        <el-table-column label="下载IP" prop="ip"></el-table-column>
        <el-table-column label="下载顺序" prop="sort"></el-table-column>
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

    <div v-if="tabNum == 3">
      <div>
        <div class="detail-header">
          <p><span class="color666">产品名称：</span>{{detailData.name}}</p>
          <p class="fl"><span class="color666">购买时间：</span>{{detailData.boughtDate}}</p>
          <p class="fl"><span class="color666">下载次数：</span>{{detailData.downloadTimes}}<span class="color666">次</span></p>
        </div>
        <div class="pd20">
          <span>产品单价</span><span class="red-font"> {{detailData.price}} </span><span>水利币/次</span>
        </div>
      </div>
      <el-table border :data="list">
        <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
        <el-table-column label="下载时间" prop="downloadDate"></el-table-column>
        <el-table-column label="下载IP" prop="ip"></el-table-column>
        <el-table-column label="下载顺序" prop="sort"></el-table-column>
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
  import { getConsumeDetail, getDataConsumeDetail, getDocConsumeDetail } from '@/api/share/index'
  export default {
    props: {
        dataId: Number,
        tabNum: Number,
        detailData: Object
    },
    components: {
    },
    mounted() {
      this.getList()
    },
    data() {
      return {
        total: 0,
        list: [],
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
        if(this.tabNum == 1) {
          let param = Object.assign({id: this.dataId}, this.page)
          getConsumeDetail(param).then((resp) => {
            this.list = resp.data.list
            this.total = resp.data.total
          })
        } else if(this.tabNum == 2){
          getDataConsumeDetail(this.dataId, this.page).then((resp) => {
            this.list = resp.data.list
            this.total = resp.data.total
          })
        } else if(this.tabNum == 3) {
          let param3 = Object.assign({id: this.dataId}, this.page)
          getDocConsumeDetail(param3).then(res => {
            this.list = res.data.list
            this.total = res.data.total
          })
        }
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .page {
    text-align: right;
  }
  .el-pagination {
    margin: 20px auto 0;
  }
  .detail-header {
   overflow: hidden;
   margin-bottom: 20px;
   padding-bottom: 10px;
   border-bottom: 1px solid #ccc;
  }
  .detail-header p {
    line-height: 24px;
    margin-bottom: 10px;
  }
  .detail-header p.fl {
    width: 50%;
    float: left;
  }
  .red-font {
    font-weight: bold;
    color: #e51a09;
  }
  .color666 {
    color: #666;
  }
  .pd20 {
    padding-bottom: 20px;
  }
  div, p,span {
    color: #333;
  }
</style>


