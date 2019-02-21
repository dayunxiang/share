<template>
 <div>
    <div class="page-title">API测试</div>
    <div class="main-container pt-20">
      <p class="api-label">
        <label>接口名称：</label>
        <span>{{apiDetail.apiName}}</span>
      </p>
       <p class="api-label">
        <label>接口地址：</label>
        <span>{{apiDetail.apiUrl}}</span>
      </p>
      <p class="api-label">
        <label>请求方式：</label>
        <span>{{apiDetail.requestType}}</span>
      </p>

      <p class="api-table-title">请求参数</p>
      <el-table :data="list" border >
        <el-table-column label="参数名" prop="name"></el-table-column>
        <el-table-column label="类型" prop="type" ></el-table-column>
        <el-table-column label="是否必填" prop="isRequired"  ></el-table-column>
        <el-table-column label="说明" prop="description"  width="180"></el-table-column>
        <el-table-column label="值" prop="applyAmount"  >
          <template slot-scope="scope">
            <el-input size="mini" v-model="form[scope.row.name]"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div class="sendBtn">
        <el-button type="primary" size="small" @click="sendRequest">发送请求</el-button>
        <span class="orange">（为了准确性，所有请求均基于真实环境请求，请悉知）</span>
      </div>
      
      <div class="mb20 table-label" v-if="requestFalse">
        <label class="same-api-label">请求详情：</label>
        <div class="back-con">
          <p>
            <label>请求地址：</label>
            <span>{{apiDetail.apiResquestExample}}</span>
          </p>
          <p>
            <label>请求参数：</label>
            <span>{{requestParam}}</span>
          </p>
          <p>
            <label>请求方式：</label>
            <span>{{apiDetail.requestType}}</span>
          </p>
        </div>
      </div>
      <div class="mb20 table-label" v-if="requestFalse">
        <label class="same-api-label">返回内容：</label>
        <div class="back-con">
          <pre>{{result}}</pre>
        </div>
      </div>
    </div>
   
  </div>
</template>

<script>
  import {getApiDetail, sendTestApi} from '@/api/myapi/index'
  export default {
  name: 'apiTest',
  components: {
    
  },
  created() {
    if (this.$route.params.id) {
      this.dataId = this.$route.params.id
      sessionStorage.setItem('apiDataId', this.dataId)
    } else {
      this.dataId = sessionStorage.getItem('apiDataId')
    }
    this.getDetail()
  },
  activated() {
    if (this.$route.params.id) {
      this.dataId = this.$route.params.id
      sessionStorage.setItem('apiDataId', this.dataId)
      this.getDetail()
    }
  },
  data() {
    return {
      dataId: '',
      showResult: false,
      apiDetail: {},
      result: '',
      list: [],
      form: {

      },
      requestParam: '',
      requestFalse: false
    }
  },
  computed: {},
  methods: {
    getDetail() {
      this.form = {}
      this.requestFalse = false
      this.requestParam = ''
      let param = {
        id: this.dataId
      }
      getApiDetail(param).then(resp => {
        if (resp.code == 200) {
          this.apiDetail = resp.data
          this.list = this.apiDetail.requestParameters
          this.apiDetail.apiResquestExample = this.apiDetail.apiResquestExample.replace(/&amp;/g,'&')
        }
      })
    },
    sendRequest() {
      this.requestParam = ''
      this.requestFalse = true
      for(let key in this.form) {
        this.requestParam += key + '=' + this.form[key] + '&'
      }
      this.requestParam = this.requestParam.slice(0,this.requestParam.length - 1)
      let param2 = {}
      param2 = Object.assign({},{jxslApiId: this.dataId},this.form)
      sendTestApi(param2).then( res => {
        this.result = res
      })
    }
  }
};
</script>

<style scoped>
.no-padding-top{
  padding-top: 0 !important;
}
</style>


