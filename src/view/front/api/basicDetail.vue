<template>
  <div class="front-detail">
    <div class="front-main">
      <div class="basic-detail" >
        <div class="detail-outer">
          <label>API链接：</label>
          <div class="detail font-0">
            <el-input size="mini" class="link" :readonly="true" v-model="apiDetail.url"></el-input>
          </div>

        </div>
        <div class="detail-outer">
          <label>请求说明：</label>
          <div class="detail border">
             <ul>
              <li>请求地址：{{apiDetail.requestDescriptionList[0].url}}</li>
              <li>请求方式：{{apiDetail.requestDescriptionList[0].requestMethod}}</li>
              <li>返回格式：{{apiDetail.returnType}}</li>
              <li>请求参数：</li>
             </ul>
          </div>
          <div class="detail">
            <el-table :data="apiDetail.requestDescriptionList[0].requestParameterList" border cell-class-name="text-center">
              <el-table-column label="名称" prop="columnName"></el-table-column>
              <el-table-column label="必填" prop="isMust">
                <template slot-scope="scope">
                  <span v-if="scope.row.isMust == 1">是</span>
                  <span v-if="scope.row.isMust != 1">否</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="type"></el-table-column>
              <el-table-column label="说明" prop="explain"></el-table-column>
            </el-table>
          </div>
        </div>
        
        <div class="detail-outer">
          <label>返回示例：</label>
          <div class="detail border">
             <pre>{{apiDetail.dataReturnExampleMap}}</pre>
          </div>
          <div class="detail">
            <el-table :data="apiDetail.returnExampleMapList" border cell-class-name="text-center">
              <el-table-column label="名称" prop="columnName"></el-table-column>
              <el-table-column label="类型" prop="type"></el-table-column>
              <el-table-column label="说明" prop="explain"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="detail-outer">
          <label>错误码：</label>
          <div class="detail">
            <el-table :data="errorArray" border >
              <el-table-column label="错误码" prop="code" width="200" class-name="text-center"></el-table-column>
              <el-table-column label="说明" prop="desc" class-name="text-left"></el-table-column>
            </el-table>
          </div>
        </div>

      </div>
    </div>
    <div class="height-30"></div>

    
  </div>
</template>

<script>
  import {getBasicDetail} from '@/api/front/index'
  export default {
    components: {
    },
    mounted() {
      this.dataId = this.$route.query.id
      this.getDetail()
    },
    watch: {
      $route() {
        this.dataId = this.$route.query.id
        this.getDetail()
      }
    },
    data() {
      return {
        apiDetail: {
          requestDescriptionList: [{
            requestParameterList: []
          }],
          returnExampleMapList: []
        },
        dataId: '',
        errorArray: [
          {code: '200', desc: '请求成功'},
          {code: '207', desc: '频繁操作'},
          {code: '400', desc: '请求参数出错'},
          {code: '401', desc: '没有登录'},
          {code: '402', desc: '登录失败'},
          {code: '403', desc: '没有权限'},
          {code: '404', desc: '找不到页面'},
          {code: '405', desc: '请求方法不能被用于请求相应的资源'},
          {code: '406', desc: '内容特性不满足'},
          {code: '408', desc: '请求超时'},
          {code: '409', desc: '发生冲突'},
          {code: '410', desc: '已被删除'},
          {code: '411', desc: '没有定义长度'},
          {code: '412', desc: '条件不满足'},
          {code: '413', desc: '数据太大'},
          {code: '415', desc: '不是服务器中所支持的格式'},
          {code: '421', desc: '连接数过多'},
          {code: '423', desc: '已被锁定'},
          {code: '451', desc: '法律不允许'},
          {code: '500', desc: '服务器出错'},
          {code: '501', desc: '不支持当前请求所需要的某个功能'},
          {code: '503', desc: '服务器升级中,暂时不可用'},
          {code: '510', desc: '获取资源所需要的策略并没有被满足'}
        ],
      }
    },
    methods: {
      getDetail() {
        let param = {
          id: this.dataId
        }
        getBasicDetail(param).then(resp => {
          if (resp.code == 200) {
            this.apiDetail = resp.data
            this.apiDetail.requestDescriptionList[0].url = this.apiDetail.requestDescriptionList[0].url.replace(/\&amp;/g,'&')
          }
        })
      }
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


