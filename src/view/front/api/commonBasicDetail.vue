<template>
  <div>
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
                <small v-if="data.apiBookedTimes">{{data.apiBookedTimes}}</small>
                <small v-else>0</small>
              </span>
            </span>
          </div>
          <div class="api-info">
            <p class="title">{{data.apiName}}</p>
            <p class="desc" :title="data.apiShortDescription">{{data.apiShortDescription}}</p>
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
              <el-button  @click="collectApi">
                <img :src="starUrl2" v-if="data.buttonStatusList[0].apiCollectionStatus == '收藏'"/>
                <img :src="starUrl3" v-if="data.buttonStatusList[0].apiCollectionStatus == '取消收藏'"/>
                {{ data.buttonStatusList[0].apiCollectionStatus }}
              </el-button>
            </p>
          </div>
        </div>  
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-container">
        <p class="nav2 nav">
          <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">产品介绍</span>
          <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">API详情</span>
          <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">错误码参照</span>
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
        <el-table :data="data.requestParametersList" :row-style="rowStyle">
          <el-table-column label="名称" prop="name" width="200"></el-table-column>
          <el-table-column label="请求类型" prop="requestType" width="200"></el-table-column>
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
        <p class="table-title clear-top">错误码说明：</p>
        <el-table :data="errorArray">
          <el-table-column label="错误码" prop="code" width="200"></el-table-column>
          <el-table-column label="说明" prop="desc" ></el-table-column>
        </el-table>

    

     
      </div>

      <div class="detail" v-show="tabNum == 5">
        <p class="table-title clear-top">联系我们：</p>
        <el-table :data="contact">
          <el-table-column label="内容" prop="content" width="200"></el-table-column>
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
          <p class="desc">{{data.apiShortDescription}}</p>
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
     <el-dialog title="确认付款" :visible="showPay" @close="cancel2" width="500px">
      <p class="text-center" >
        <label>付款金额：</label>
        <span><span class="color-red">{{orderMoney}}</span>水利币</span>
      </p>

      <p class="text-center mar-top-30">
        <el-button size="primary" @click="ensurePay">确认付款</el-button>
      </p>
    </el-dialog>
    <div role="alert" class="el-message el-message--success is-closable showMyMessage" style="z-index: 2014;" v-if="showMyMessage">
      <i class="el-message__icon el-icon-success"></i>
      <p class="el-message__content">
        <span>{{ myMessageCon }}，</span>
        <router-link class="toLink" :to="'/api/myApi'">请到个人中心 =&gt; API中心中查看 &nbsp;</router-link>
      </p>
      <i class="el-message__closeBtn el-icon-close" @click="closeMyMessage"></i>
    </div>
  </div>
</template>

<script>
  import {getApiList, addCollection, getDesc, bookApi, renewApi} from '@/api/front/index'
  import {getApiDetail} from '@/api/api/index'
  import { getToken } from '@/utils/auth'
  import { cancelCollect} from '@/api/share/index'
  import { payApi} from '@/api/myapi/index'
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
        myMessageCon: '',
        showMyMessage: false,
        dataId: '',
        isShowDesc: false,
        showBook: false,
        showPay: false, //显示付款dialog
        orderMoney: 0,//订单需付款金额
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
        apiDesc: '',
        tabNum: 1,
        contact: [],
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
      rowStyle({row, rowIndex}) {
        if(row.isRequired == 1) {
          return 'font-weight: 900'
        } else {
          return ''
        }
      },
      getDetail() {
        let param = {
          id: this.dataId
        }
        let tag = getToken() ? 'order' : 'visitor'
        getApiDetail(tag, param).then((resp) => {
          if (resp.code == 200) {
            this.data = resp.data.length > 0 ? resp.data[0] : this.data
            this.data.apiRequestExample = this.data.apiRequestExample.replace(/&amp;/g,'&')
            this.data.apiCheckTimes = this.data.apiCheckTimes ? this.data.apiCheckTimes : 0
            this.data.apiCollectionTimes = this.data.apiCollectionTimes ? this.data.apiCollectionTimes : 0
            this.contact = this.data.apiContactInfoVOList
            
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
        if(this.data.buttonStatusList[0].apiCollectionStatus == '收藏') {
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
        } else {
          cancelCollect({id: this.data.buttonStatusList[0].collectionId}).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '取消成功'
              })
              this.getDetail()
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        }
      },
      bookOrRenew() {
        if(getToken()) {
          this.showBook = true
          this.bookTitle = this.data.buttonStatusList[0].apiBuyStatus == '立即订阅' ? '产品订阅' : (this.data.buttonStatusList[0].apiBuyStatus == '续费' ? '续费' : '付款')
          this.bookPrice = (parseFloat(this.data.payStandard) * 50).toFixed(2)
        } else {
          this.$store.state.app.loginFlag = true
        }
        
      },
      cancel() {
        this.showBook = false
      },
      cancel2() {
        this.showPay = false
      },
      closeMyMessage() {
        this.showMyMessage = false
      },
      ensure() {
        if (this.data.buttonStatusList[0].apiBuyStatus == '立即订阅') {
          let param = {
            apiId: this.data.id,
            apiBookedTimes: this.bookCount
          }
          bookApi(param).then(resp => {
            if (resp.code == 200) {
              this.showBook = false
              this.showPay = true
              this.apiId = resp.data
              this.orderMoney = (this.bookCount * parseFloat(this.data.payStandard)).toFixed(2)            
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
              this.myMessageCon = this.data.buttonStatusList[0].apiBuyStatus == '续费' ? '续费成功' : '付款成功'
              this.showMyMessage = true
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
      ensurePay() {
        let param = {
          myApiPayDtos: [{
            id: this.apiId,
            apiBookedTimes: this.bookCount
          }]
        }
        payApi(param).then(resp => {
          if (resp.code == 200) {
            this.myMessageCon = '付款成功'
            this.showMyMessage = true
            this.getDetail()
            this.showPay = false
          } else {
            this.$message({
              type: 'error',
              message: '金额不足，订单进入待付款状态'
            })
          }
        })
        
      },
      changeCount() {
        this.bookPrice = parseFloat(this.data.payStandard * this.bookCount).toFixed(2)
      }
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
   .toLink {
    color: #009dec;
    cursor: pointer;
    text-decoration: underline;
   }
   .color-red {
    color: #ee3323;
   }
</style>


