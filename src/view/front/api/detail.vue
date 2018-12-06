<template>
  <div class="">
    <div class="front-detail">
      <div class="front-main">
        <div class="api-detail">
          <div class="api-img">
            <img :src="defaultUrl" v-if="!data.filePath"/>
            <img :src="data.filePath" v-if="data.filePath"/>
            <span class="count">
              <span class="count-detail">
                <img :src="starUrl"/><br/>
                <small> {{data.apiCollectionTimes}}</small>
              </span>
              <span class="border"></span>
              <span class="count-detail">
                <img :src="watchUrl" style="height: 14px;"/><br/>
                <small>{{data.apiBookedTimes}}</small>
              </span>
            </span>
          </div>
          <div class="api-info">
            <p class="title">{{data.apiName}}</p>
            <p class="desc">{{data.apiShortDescription}}</p>
            <p class="price" v-if="data.isFree == '1'">
              <img :src="priceUrl"/>
              <span>{{data.payStandard}}</span>
              水利币/次
            </p>
            <p class="free" v-if="data.isFree != '1'">
              免费
            </p>
            <p>
              <el-button type="primary" @click="bookOrRenew">
                {{data.buttonStatusList[0].apiBuyStatus}}
              </el-button>
              <el-button  @click="collectApi"  v-if="data.buttonStatusList[0].apiCollectionStatus == '收藏'">
                <img :src="starUrl2" v-if="data.isFree == '1'"/>
                <img :src="starUrl3" v-if="data.isFree != '1'"/>
                收藏
              </el-button>
            </p>
          </div>
        </div>  
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-container">
        <p class="nav">
          <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">产品介绍</span>
          <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">API文档</span>
          <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">错误码参照</span>
          <span :class="tabNum == 4 ? 'active' : ''" @click="changeTab(4)">示例代码</span>
          <span :class="tabNum == 5 ? 'active' : ''" @click="changeTab(5)">联系我们</span>
        </p>
      </div>
      <div class="detail" v-show="tabNum == 1">
        <p class="title">功能介绍：</p>
        <p class="desc"><pre>{{data.apiDescription}}</pre></p>
      </div>

      <div class="detail" v-show="tabNum == 2">
        <p class="desc2">
          <label>接口地址：</label>
          <span>{{data.apiUrl}}</span>
        </p>
        <p class="desc2">
          <label>返回格式：</label>
          <span>{{data.apiResFormat}}</span>
        </p>
        <p class="desc2">
          <label>请求方式：</label>
          <span>{{data.requestType}}</span>
        </p>
        <p class="desc2">
          <label>请求示例：</label>
          <span>{{data.apiRequestExample}}</span>
        </p>

        <p class="table-title">请求参数说明：</p>
        <el-table :data="data.requestParametersList">
          <el-table-column label="名称" prop="name" width="200"></el-table-column>
          <el-table-column label="必填" prop="isRequired" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isRequired == '1'">是</span>
              <span v-if="scope.row.isRequired != '1'">否</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type" width="110"></el-table-column>
          <el-table-column label="说明" prop="description" ></el-table-column>
        </el-table>

        <p class="table-title">返回参数说明：</p>
        <el-table :data="data.responseParametersList">
          <el-table-column label="名称" prop="name" width="200"></el-table-column>
          <el-table-column label="类型" prop="type" width="110"></el-table-column>
          <el-table-column label="说明" prop="description" ></el-table-column>
        </el-table>

        <p class="table-title">返回示例：</p>
        <div class="demo" >
          <pre>{{data.apiResExample}}</pre>
        </div>
      </div>

      <div class="detail" v-show="tabNum == 3">
        <p class="table-title clear-top">服务级错误参照码(error_code)：</p>
        <el-table :data="data.serviceList">
          <el-table-column label="错误码" prop="code" width="200"></el-table-column>
          <el-table-column label="说明" prop="description" ></el-table-column>
        </el-table>

        <p class="table-title">系统级错误参照码：</p>
        <el-table :data="data.systemList">
          <el-table-column label="错误码" prop="code" width="200"></el-table-column>
          <el-table-column label="说明" prop="description" ></el-table-column>
        </el-table>

        <p class="table-title">正常返回参照：</p>
        <el-table :data="data.normalList">
          <el-table-column label="错误码" prop="code" width="200"></el-table-column>
          <el-table-column label="说明" prop="description" ></el-table-column>
        </el-table>
      </div>

      <div class="detail" v-show="tabNum == 4">
        <p class="table-title clear-top">完整教学代码示例：</p>
        <el-table :data="data.apiExampleCallVOList" @cell-click="showDesc">
          <el-table-column label="语言" prop="language" width="200"></el-table-column>
          <el-table-column label="标题" prop="title" width="200" class-name="pointer" ></el-table-column>
          <el-table-column label="提供者" prop="providerName" width="200"></el-table-column>
          <el-table-column label="时间" prop="createTime" ></el-table-column>
        </el-table>
        <div class="demo mar-t-20" v-html="apiDesc" v-if="isShowDesc"></div>
      </div>

      <div class="detail" v-show="tabNum == 5">
        <p class="table-title clear-top">联系我们：</p>
        <el-table :data="contact">
          <el-table-column label="内容" prop="key" width="200"></el-table-column>
          <el-table-column label="详细" prop="detail" ></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="bookTitle" :visible="showBook" @close="cancel" width="500px">
      <div class="book-outer">
        <div class="api-img">
          <img :src="defaultUrl" v-if="!data.filePath"/>
          <img :src="data.filePath" v-if="data.filePath"/>
        </div>
        <div class="api-info">
          <p class="title">{{data.apiName}}</p>
          <p class="desc" :title="data.apiShortDescription">{{data.apiShortDescription}}</p>
        </div>
      </div>
      <div class="book-detail">
        <p>
          <span class="label">数量：</span>
          <el-select v-model="bookCount" size="mini" class="book-input" @change="changeCount">
            <el-option v-for="(item, index) in countArray" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>次
        </p>
        <p>
          <span class="label">金额：</span>
          <span v-if="data.payStandard">
            <span class="price">{{bookPrice}}</span>水利币
          </span>
          <span class="free" v-if="!data.payStandard">免费</span>
        </p>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="ensure">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getApiList, addCollection, getDesc, bookApi, renewApi} from '@/api/front/index'
  import {getApiDetail} from '@/api/api/index'
  import { getToken } from '@/utils/auth';
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
        dataId: '',
        isShowDesc: false,
        showBook: false,
        bookPrice: 0,
        bookCount: 50,
        bookTitle: '',
        data: {
          buttonStatusList: [{}]
        },
        countArray: [
          {label: '50', value: '50'},
          {label: '100', value: '100'},
          {label: '200', value: '200'},
          {label: '500', value: '500'},
          {label: '1000', value: '1000'},
          {label: '2000', value: '2000'}
        ],
        apiDesc: '',
        tabNum: 1,
        contact: [
          {key: '联系电话', detail: '0791-8835672'}
        ],
        logoUrl: require('@/assets/images/logo.png'),
        defaultUrl: require('@/assets/images/default.png'),
        starUrl: require('@/assets/images/star.png'),
        starUrl2: require('@/assets/images/star2.png'),
        starUrl3: require('@/assets/images/star3.png'),
        watchUrl: require('@/assets/images/watch.png'),
        priceUrl: require('@/assets/images/price2.png'),
      }
    },
    methods: {
      getDetail() {
        let param = {
          id: this.dataId
        }
        let tag = getToken() ? 'order' : 'visitor'
        getApiDetail(tag, param).then((resp) => {
          if (resp.code == 200) {
            this.data = resp.data.length > 0 ? resp.data[0] : this.data
            this.data.apiCheckTimes = this.data.apiCheckTimes ? this.data.apiCheckTimes : 0
            this.data.apiCollectionTimes = this.data.apiCollectionTimes ? this.data.apiCollectionTimes : 0
          }
        })
      },
      changeTab(num) {
        this.tabNum = num
      },
      showDesc(row,column) {
        if (column.label == '标题') {
          this.apiDesc = row.exampleCode
          this.isShowDesc = true 
         }
      },
      collectApi() {
        let param = {
          id: this.dataId
        }
        addCollection(param).then((resp) => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '收藏成功'
            })
            this.getDetail()
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      bookOrRenew() {
        this.showBook = true
        this.bookTitle = this.data.buttonStatusList[0].apiBuyStatus == '立即订阅' ? '产品订阅' : '续费'
        this.bookPrice = (this.data.payStandard * 50).toFixed(2)
      },
      cancel() {
        this.showBook = false
      },
      ensure() {
        if (this.data.buttonStatusList[0].apiBuyStatus == '立即订阅') {
          let param = {
            apiId: this.data.id,
            apiBookedTimes: this.bookCount
          }
          bookApi(param).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '订阅成功'
              })
              this.showBook = false
            } else {
               this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        } else {
          let param = {
            myApiPayDtos: [{
              id: this.data.buttonStatusList[0].id,
              apiBookedTimes: this.bookCount
            }]
          }
          renewApi(param).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '续费成功'
              })
              this.showBook = false
            } else {
               this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        }
      },
      changeCount() {
        this.bookPrice = (this.data.payStandard * this.bookCount).toFixed(2)
      }
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


