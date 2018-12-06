<template>
  <div class="pu-toolbar">
    <div>
      <el-row class="searchBar">
        <div>
          <el-row :gutter="15">
            <el-col :span="8">
              <span class="form-label">API标题</span>
              <el-input v-model="form.apiNameParam" size="mini" class="form-input" maxlength="50" placeholder="请输入API标题"></el-input>
            </el-col>
            <el-col :span="8" class="height-28">
              <span class="form-label">创建时间</span>
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
              <span class="form-label">状态</span>
              <el-select v-model="form.status" size="mini"  class="form-input">
                <el-option v-for="(item, index) in statusArray" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div class=" box right-btn-box search-box">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div> 
      </el-row>
       <div class=" box left-btn-box search-box">
          <el-button size="mini"  class="operateBtn" @click="addApi" v-if="tabNum == '2'"><i class="iconfont icon-fabushuju_huaban"></i> 发布</el-button>
          <el-button size="mini"  class="operateBtn" @click="addApi" v-if="tabNum == '1'"><i class="iconfont icon-APIchuangjian_huaban"></i> 创建</el-button>
          <el-button size="mini" class="operateBtn" v-if="tabNum == 2"><a href="../static/template/API详情填写模板.xlsx"><i class="iconfont icon-xiazaimoban_huaban"></i> 下载模版</a></el-button>
          <el-button size="mini" class="operateBtn" @click="removeApi"><i class="iconfont icon-shanchu_huaban"></i> 删除</el-button>
        </div>
    </div>
  </div>
</template>

<script>

  export default {
    components: {
    },
    props: {
      tabNum: Number
    },
    watch: {
      tabNum(newVal, oldVal) {
        this.reset()
      }
    },
    mounted() {
    },
    data() {
      return {
        statusArray:[
          {label: '全部', value: '0'},
          {label: '草稿', value: '1'},
          {label: '上架', value: '2'},
          {label: '下架', value: '3'},
        ],
        createTime: '',
        form: {
          apiNameParam: '',
          apiCreateBeginTime: '',
          apiCreateEndTime:'',
          status: '0',
          apiMainType: '2' //1为基础api，2为业务api
        },
        addUrl: require('@/assets/images/add.png'),
        batchUrl: require('@/assets/images/batch.png'),
        uploadUrl: require('@/assets/images/upload.png'),
        downloadUrl: require('@/assets/images/download.png'),
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      addApi() {
        this.$emit('addApi')
      },
      search() {
        this.$emit('search', this.form)
      },
      removeApi() {
        this.$emit('removeApi')
      },
      reset() {
        this.form = {
          apiNameParam: '',
          apiCreateBeginTime: '',
          apiCreateEndTime: '',
          apiMainType: this.tabNum,
          status: ''
        }
        this.createTime = ''
      },
      changeTime() {
        if (this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.apiCreateBeginTime = this.createTime[0]
          this.form.apiCreateEndTime = this.createTime[1]
        } else {
          this.form.apiCreateBeginTime = ''
          this.form.apiCreateEndTime = ''
        }
      }
    }
  }
</script>

<style scoped>
  .box-outer{
    table-layout: fixed;
  }
  .search-box{
    width: 100%
  }
  .btn-box{
    vertical-align: top;
    height: 100%;
  }
  .btnhide{
    position: absolute;
    right: 0;
    height: 0;
    bottom: 0;
  }
  .btnhide{
    width: 0;
  }
</style>


