<template>
<div>
  <div class="front-index" v-show="!showNotice && !showNoticeDetail && !showReport">
    <div class="index-container">
      <div class="classify">
        <div class="classify-con">
          <img :src="typeFlag == 1 ? bussinessUrl2 : bussinessUrl" class="classify-bussiness " :class="{active: typeFlag == 1}" @click="changeType(1)"/>
          <img :src="typeFlag == 2 ? basicUrl2 : basicUrl" class="classify-basic" :class="{active: typeFlag == 2}" @click="changeType(2)"/>
        </div>
        <div class="classify-detail">
          <div v-for="(item, index) in basicClassify" :key="item.id" class="detail-con" v-if="typeFlag == 1" >
            <p><i class="classify-icon" :class="{'icon': index == 0, 'icon1': index == 1, 'icon2': index == 2, 'icon3': index == 3, 'icon4': index == 4, 'icon5': index == 5}"></i>{{item.name}}</p>
            <el-popover
              placement="top"
              title=""
              width="160"
              trigger="click"
              v-for="child in item.children" :key="child.id"
              popper-class="popper-red"
              content="该对象暂无相关数据"
              :disabled="child.visible">
              <span slot="reference" class="basic-type" :class="{active: child.type == classifyId, 'disabled': !child.visible}" @click="chooseClassify(child)">{{child.name}}</span>
            </el-popover>
          </div>
          <div v-for="(item, index) in bussinessClassify" :key="item.id" class="detail-con" v-if="typeFlag == 2">
            <p><i class="classify-icon" :class="{'icon': index == 0, 'icon1': index == 1, 'icon2': index == 2, 'icon3': index == 3, 'icon4': index == 4, 'icon5': index == 5}"></i>{{item.name}}</p>
            <el-popover
              placement="top"
              title=""
              width="160"
              trigger="click"
              v-for="child in item.children" :key="child.id"
              popper-class="popper-red"
              content="该对象暂无相关数据"
              :disabled="child.visible">
              <span slot="reference" class="basic-type" :class="{active: child.type == classifyId, 'disabled': !child.visible}" @click="chooseClassify(child)">{{child.name}}</span>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="map-container">
        <div style="">
           <gis-map ref="gisMap" :typeFlag="typeFlag"></gis-map>
        </div>
      </div>
    </div>
    <div class="index-link" v-show="!showMapData">
      <div class="link bg-api" @click="goApi">
        <img :src="linkApi"/>
        <span>共享接口</span>
      </div>
      <div class="link bg-data" @click="goData">
        <img :src="linkDoc"/>
        <span>数据服务</span>
      </div>
      <div class="link bg-doc" @click="goDoc">
        <img :src="linkData"/>
        <span>文档共享</span>
      </div>
      <div class="link bg-report" @click="goReport">
        <img :src="linkReport"/>
        <span>需求提报</span>
      </div>
    </div>

    <div class="index-recommend" v-show="!showMapData">
      <div class="api-recommend">
        <p class="title">推荐API</p>
        <div class="new">
          <span class="api-title" v-for="item in newApiList" :key="item.id" @click="goApiDetail(item)">
            <img :src="item.picPath" v-if="item.picPath"/>
            <img :src="logoUrl" v-if="!item.picPath"/>
            <span :title="item.apiName">{{item.apiName}}</span>
          </span>
         
        </div>
        <div class="hot">
          <span class="api-title" v-for="item in hotApiList" :key="item.id" @click="goApiDetail(item)">
            <img :src="item.picPath" v-if="item.picPath"/>
            <img :src="logoUrl" v-if="!item.picPath"/>
            <span :title="item.apiName">{{item.apiName}}</span>
          </span>
        </div>
        <div class="common">
          <span class="api-title" v-for="item in commonApiList" :key="item.id" @click="goApiDetail(item)">
            <img :src="item.picPath" v-if="item.picPath"/>
            <img :src="logoUrl" v-if="!item.picPath"/>
            <span :title="item.apiName">{{item.apiName}}</span>
          </span>    
        </div>
      </div>

      <div class="data-recommend">
        <p class="title">推荐数据</p>
        <div class="book">
          <span class="api-title-2" v-for="(item, index) in bookDataList" :key="index" @click="goDataDetail(item)">
            
            <img :src="item.picPath" v-if="item.picPath"/>
            <img :src="logoUrl" v-if="!item.picPath"/>
            <span :title="item.name">{{item.name}}</span>
          </span> 
         
        </div>
        <div class="like">
           <span class="api-title-2" v-for="(item, index) in sameDataList" :key="index" @click="goDataDetail(item)">
            <img :src="item.picPath" v-if="item.picPath"/>
            <img :src="logoUrl" v-if="!item.picPath"/>
           
            <span :title="item.name">{{item.name}}</span>
          </span> 
        </div>
      </div>

      <div class="index-notice">
        <div class="img-con">
          <img :src="noticeUrl"/>
        </div>
        <div class="notice">
          <p class="notice-title">
            <span class="tab" :class="{active: noticeTabNum == 1}" @click="changeTab(1)">推荐文档</span>
            <span class="tab" :class="{active: noticeTabNum == 2}" @click="changeTab(2)">通知公告</span>
            <span class="more" @click="moreDetail">更多 >></span>
          </p>
          <div class="doc-list"  v-if="noticeTabNum == 1">
            <p v-for="(item, index) in docList" :key="item.id" v-if="index < 4">
              <img :src="wordUrl" v-if="item.docType == 'doc' || item.docType == 'docx'"/>
              <img :src="pdfUrl" v-else-if="item.docType == 'pdf'"/>
              <img :src="pptUrl" v-else-if="item.docType == 'ppt'"/>
              <img :src="txtUrl" v-else-if="item.docType == 'txt'"/>
              <img :src="excelUrl" v-else-if="item.docType == 'xls' || item.docType == 'xlsx'"/>
              <img :src="elseUrl" v-else/>
              <router-link target="_blank" :to="{path: '/doc/detail', query: {id: item.id}}">
                <span class="name" >{{item.name}}</span>
              </router-link>
              <span class="time">{{item.createTime}}</span>
            </p>
          </div>
          <div class="doc-list" v-if="noticeTabNum == 2">
            <p v-for="(item, index) in noticeList" :key="item.id" v-if="index < 4">
              <span class="name" @click="goNoticeDetail(item)">{{item.name}}</span>
              <span class="time">{{item.createTime}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!--地图相关数据-->
    <div v-show="showMapData" class="front-main mar-top-40">
      <!--api-->
      <p class="index-title">
        <span class="label">API</span>
        <small>
          共检索出相关内容
          <span>{{mapApiTotal}}</span>
          条
        </small>
        <span class="map-more" @click="goMoreApi">更多 >></span>
      </p>
      <div class="api-condition mar-top-30 mar-b-20">
        <!-- <div class="api" v-for="(item, index) in mapApiList" :key="index" :title="item.apiName">
          <img :src="defaultUrl" v-if="!item.filePath"/>
          <img :src="item.filePath" v-if="item.filePath"/><br/>
          <span class="new" v-if="item.isNew">NEW</span>
          <span class="price" v-if="item.isFree == '1'">{{item.payStandard}}/次</span>
          <span class="free" v-if="item.isFree == '0'">免费</span><br/>
          <span class="api-name">{{item.apiName.substring(0, 10)}}</span>
          
          <el-button type="primary" class="btn" @click="goApiDetail(item)">立即订阅</el-button>
        </div> -->

         <div class="api" v-for="(item, index) in mapApiList" :key="index" @click="goApiDetail(item)">
            <img :src="defaultUrl" v-if="!item.filePath"/>
            <img :src="item.filePath" v-if="item.filePath"/><br/>
            <span class="new" v-if="item.isNew">NEW</span>
            <span class="api-name">{{item.apiName}}</span>
            <span class="api-shortdesc">{{item.apiShortDescription}}</span>
            <div class="text-left">
              <img :src="priceUrl" v-if="item.isFree == '1'" class="money-img">
              <span class="price" v-if="item.isFree == '1'">{{item.payStandard}}/次</span>
              <span class="free" v-if="item.isFree == '0'">免费</span>
            </div>
            <div>
              <div class="icon-data fl">
                <img :src="starUrl"/>
                <small v-if="item.apiCollectionTimes"> {{item.apiCollectionTimes}}</small>
                <small v-else> 0</small>
              </div>
              <div class="icon-data fr">
                <img :src="watchUrl"/>
                <small v-if="item.apiBookedTimes"> {{item.apiBookedTimes}}</small>
                <small v-else> 0</small>
              </div>
              <div class="clear-float"></div>
            </div>
          </div>
      </div>
      <!--数据-->
      <p class="index-title">
        <span class="label">数据</span>
        <small>
          共检索出相关内容
          <span>{{mapDataTotal}}</span>
          条
        </small>
        <span class="map-more" @click="goMoreData">更多 >></span>
      </p>
      <div class="api-condition mar-top-30 mar-b-20">
       <!--  <div class="api" v-for="(item, index) in mapDataList" :key="item.name + '_' +index" :title="item.apiName">
          <img :src="defaultUrl" v-if="!item.filePath"/>
          <img :src="item.filePath" v-if="item.filePath"/><br/>
          <span class="new" v-if="item.isNew">NEW</span>
          <span class="price" v-if="item.isFree == '1'">{{item.payStandard}}/次</span>
          <span class="free" v-if="item.isFree == '0'">免费</span><br/>
           <span class="api-name">{{item.name.substring(0, 10)}}</span>
          
          <el-button type="primary" class="btn" @click="goDataDetail(item)">立即下载</el-button>
        </div> -->

          <div class="api" v-for="(item, index) in mapDataList" :key="index" @click="goDataDetail(item)">
            <img :src="defaultUrl" v-if="!item.picPath"/>
            <img :src="item.picPath" v-if="item.picPath"/><br/>
            <span class="new" v-if="item.isNew">NEW</span>
            <span class="api-name">{{item.name}}</span>
            <span class="api-shortdesc">{{item.shortDescription}}</span>
            
            <div class="text-left">
              <img :src="priceUrl" v-if="item.isFree == '1'" class="money-img">
              <span class="price" v-if="item.isFree == '1'">{{item.payStandard}}/次</span>
              <span class="free" v-if="item.isFree == '0'">免费</span><br/>
            </div>
            <div>
              <div class="icon-data fl">
                <img :src="starUrl"/>
                <small> {{item.collectionTimes ? item.collectionTimes : 0}}</small>
              </div>
              <div class="icon-data fr">
                <img :src="downloadUrl"/>
                <small> {{item.downloadTimes ? item.downloadTimes : 0}}</small>
              </div>
              <div class="clear-float"></div>
            </div>
            
            <!-- <el-button type="primary" class="btn" @click="dataDetail(item)">立即下载</el-button> -->
          </div>
      </div>
      <!--文库-->
      <p class="index-title">
        <span class="label">文库</span>
        <small>
          共检索出相关内容
          <span>{{mapDocTotal}}</span>
          条
        </small>
        <span class="map-more" @click="goMoreDoc">更多 >></span>
      </p>
      <div class="map-doc-list">
        <el-table :data="mapDocList" border @cell-click="docDetail">
          <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
          <el-table-column label="标题" prop="name" class-name="text-left doc-name" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <router-link target="_blank" :to="{path: '/doc/detail', query: {id: scope.row.id}}">
                <img :src="wordUrl" class="doc-img" v-if="scope.row.docType == 'doc' || scope.row.docType == 'docx'"/>
                <img :src="pptdUrl" class="doc-img" v-else-if="scope.row.docType == 'ppt'"/>
                <img :src="pdfUrl" class="doc-img" v-else-if="scope.row.docType == 'pdf'"/>
                <img :src="txtUrl" class="doc-img" v-else-if="scope.row.docType == 'txt'"/>
                <img :src="excelUrl" class="doc-img" v-else-if="scope.row.docType == 'xlsx' || scope.row.docType == 'xls'"/>
                <img :src="elseUrl" class="doc-img" v-else/>
                {{scope.row.name}}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="作者" prop="author" width="100"></el-table-column>
          <el-table-column label="时间" prop="createTime" width="180" ></el-table-column>
          <el-table-column label="下载量" prop="downloadTimes" width="100" ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <!--公告列表-->
  <div v-show="showNotice">
    <div class="notice-list">
      <p class="notice-title">
        通知公告
        <span class="breadcrumb">
          <a @click="goIndex">首页</a>
          >>
          <a >通知公告</a>
        </span>
      </p>
      <el-table :data="allNoticeList" border>
        <el-table-column type="index" label="序号" width="50" ></el-table-column>
        <el-table-column prop="name" label="标题">
          <template slot-scope="scope">
            <a @click="goNoticeDetail(scope.row)">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间"></el-table-column>
      </el-table>
    </div>
    <div class="notice-page">
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
  <!--公告详情-->
  <div v-show="showNoticeDetail">
    <span class="breadcrumb-con">
      <a @click="goIndex">首页</a>
      >>
      <a @click="goList">通知公告</a>
      >>
      <a >公告详情</a>
    </span>
    <div class="notice-detail">
      <p class="notice-title">{{noticeData.name}}</p>
      <div v-html="noticeData.text">

      </div>
    </div>
  </div>
  <!--问题填报-->
  <div v-show="showReport">
    
    <div class="order-contaniner">
      <p class="breadcrumb-con breadcrumb-pos">
        <a @click="goIndex">首页</a>
        >>
        <a>需求填报</a>
      </p>
      <p class="order-title">需求提报</p>
      <el-form :model="orderForm" ref="orderForm" :rules="orderRule" label-width="100px">
        <el-form-item prop="title" label="标题：" class="order-detail">
          <el-input size="small" v-model="orderForm.title"></el-input>
        </el-form-item>
        <el-form-item prop="question" label="需求内容：" class="order-detail">
          <el-input size="small" v-model="orderForm.question" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <p class="order-btn">
        <el-button type="primary" size="small" @click="submitOrder">提交</el-button>
        <el-button size="small" @click="goIndex">返回</el-button>
      </p>
    </div>
  </div>
</div>
</template>

<script>
  import {getApiList, getClassify, getIndexApiList, getIndexData, getIndexDoc, getIndexNotice, getAllNotice, getMapData, visitorLog} from '@/api/front/index'
  import {getApiTypeArray} from '@/api/api/index'
  import { getMessageCount} from '@/api/message/index'
  import {  setToken, setUser, setLoginFlag, getToken } from '@/utils/auth'
  import {addOrder} from '@/api/order/index'
  import axios from 'axios'
  import gisMap from '@/components/map/map'
  export default {
    components: {
      gisMap
    },
    mounted() {
      this.getList()
      this.getClassifyType()
      this.$store.state.app.refreshIndex = false
      if (this.$route.path == '/third') {
        //第三方登陆
        this.init()
      }
      if (!getToken()) {//游客访问则记录日志
        this.addVisitorLog()
      }
    },
    watch: {
      refreshIndex() {
        this.showNotice = false
        this.showNoticeDetail = false
        this.showReport = false
        this.showMapData = false
        this.$store.state.app.refreshIndex = false
      }
    },
    computed: {
      refreshIndex() {
        return this.$store.state.app.refreshIndex
      }
    },
    data() {
      return {
        mapUrl: require('@/assets/images/map.png'),
        logoUrl: require('@/assets/images/logo-small.png'),
        basicUrl: require('@/assets/images/classify-basic.png'),
        basicUrl2: require('@/assets/images/classify-basic2.png'),
        bussinessUrl: require('@/assets/images/classify-bussiness.png'),
        bussinessUrl2: require('@/assets/images/classify-bussiness2.png'),
        linkApi: require('@/assets/images/link-api.png'),
        linkDoc: require('@/assets/images/link-doc.png'),
        linkData: require('@/assets/images/link-data.png'),
        linkReport: require('@/assets/images/link-report.png'),
        noticeUrl: require('@/assets/images/index-notice.jpg'),
        wordUrl: require('@/assets/images/doc_word.png'),
        pdfUrl: require('@/assets/images/doc_pdf.png'),
        pptUrl: require('@/assets/images/doc_ppt.png'),
        txtUrl: require('@/assets/images/doc_txt.png'),
        excelUrl: require('@/assets/images/doc_excel.png'),
        elseUrl: require('@/assets/images/doc_else.png'),
        defaultUrl: require('@/assets/images/default.png'),
        starUrl: require('@/assets/images/star.png'),
        watchUrl: require('@/assets/images/watch.png'),
        downloadUrl: require('@/assets/images/doc_download.png'),
        priceUrl: require('@/assets/images/price2.png'),
        form: {
          apiType: '',
          sort: '1',
          isPay: '2',
          isBasic: '0'
        },
        page: {
          page: 1,
          size: 10
        },
        total: 0,
        noticeTabNum: 1, //公告tab页
        apiList: [],
        apiTypeArray: [
          {name: '全部', codeExt: '', checked: true}
        ],
        isFreeArray: [
          {label: '全部', value: '2', checked: true},
          {label: '免费', value: '0'},
          {label: '付费', value: '1'}
        ],
        sortArray: [
          {label: '热门', value: '0'},
          {label: '最新', value: '1', checked: true}
        ],
        objArray: [
          {label: '全部', value: '0', checked: true},
          {label: '基础API', value: '1'},
          {label: '业务API', value: '2'},
        ],
        basicClassify: [],
        bussinessClassify: [],
        classifyId: '',
        typeFlag: 1,
        newApiList: [],//最新api
        hotApiList: [],//最热api
        commonApiList: [],//常用api
        bookDataList: [],//订阅数据
        sameDataList: [],//同类数据
        docList: [],//文档
        noticeList: [],//文档
        showNotice: false,//显示公告列表
        showNoticeDetail: false,//显示公告详情
        showReport: false,//显示问题填报
        showMapData: false,//显示地图相关数据
        allNoticeList: [], //公告列表数据
        noticeData: {}, //公告详情数据
        mapApiList: [],//地图相关api数据
        mapDocList: [],//地图相关文档数据
        mapDataList: [],//地图相关数据列表
        mapApiTotal: 0,//地图相关api数据总数
        mapDataTotal: 0,//地图相关数据列表总数
        mapDocTotal: 0,//地图相关文档数据总数
        orderForm: {

        },
        orderRule: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          question: [
            {required: true, message: '请输入需求内容', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      getClassifyType() {
        getClassify({type: '1',isChild: '1'}).then(resp => {
          this.basicClassify = resp.data
        }).catch(error => {

        })
        getClassify({type: '2',isChild: '1'}).then(resp => {
          this.bussinessClassify = resp.data
        })
      },
      init() {
        let url = window.location.href
        let token = url.split('?')[1]
        document.cookie = token
        getMessageCount().then(resp => {
          let cookie = decodeURIComponent(document.cookie)
          let arr = cookie.split(';')
          let obj = {}
          arr.forEach(v => {
            if (v.indexOf('token') > -1) {
              obj['token'] = v.split('=')[1]
            }
            if (v.indexOf('user') > -1) {
              obj['user'] = v.split('=')[1]
            }
          })
          setToken(obj.token)
          setUser(obj.user)
          setLoginFlag('third')
          //用户名
          this.$store.state.app.userName = JSON.parse(obj.user).name
          //消息
          this.$store.state.app.msgCount = resp.data
        })
        this.$router.push({
          name: 'index'
        })
      },
      addVisitorLog() {
        visitorLog()
      },
      getList() {
        //获取api列表
        getIndexApiList().then((resp) => {
          if (resp.code == 200) {
            this.newApiList = resp.data.newest
            this.hotApiList = resp.data.hot
            this.commonApiList = resp.data.common
          }
        })
        //获取数据列表
        getIndexData().then(resp => {
          if (resp.code == 200) {
            this.bookDataList = resp.data.hotList
            this.sameDataList = resp.data.lastedList
          }
        })
        //获取文档列表
        getIndexDoc().then(resp => {
          if (resp.code == 200) {
            this.docList = resp.data
          }
        })
        //获取公告列表
        getIndexNotice().then(resp => {
          if (resp.code == 200) {
            this.noticeList = resp.data
          }
        })
      },
      getAllNoticeList() {
        getAllNotice(this.page).then(resp => {
          this.allNoticeList = resp.data.list
          this.total = resp.data.total
        })
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      dataDetail(data) {
        if (data.apiMainType == '2') {
          this.$router.push({
            name: 'apiDetail',
            query: {
              id: data.id
            }
          })
        } else {
          this.$router.push({
            name: 'commonBasic',
            query: {
              id: data.id
            }
          })
        }
        
      },
      chooseApiType(item, index) {
        this.apiTypeArray.forEach((v, i) => {
          if (index != i) {
            v.checked = false
          } else {
            v.checked = true
          }
        })
        this.form.apiType = item.codeExt
        this.getList()
      },
      chooseIsFree(item, index) {
        this.isFreeArray.forEach((v, i) => {
          if (index != i) {
            v.checked = false
          } else {
            v.checked = true
          }
        })
        this.form.isPay = item.value
        this.getList()
      },
      chooseSort(item, index) {
        this.sortArray.forEach((v, i) => {
          if (index != i) {
            v.checked = false
          } else {
            v.checked = true
          }
        })
        this.form.sort = item.value
        this.getList()
      },
      chooseObj(item, index) {
        this.objArray.forEach((v, i) => {
          if (index != i) {
            v.checked = false
          } else {
            v.checked = true
          }
        })
        this.form.isBasic = item.value
        this.getList()
      },
      basicAPi() {
        this.$router.push({
          name: 'basicApi'
        })
      },
      chooseClassify(data) {
        if (!data.visible) {
          return false
        }
        
        if (this.classifyId == data.type) {
          this.classifyId = ''
          this.$refs.gisMap.addLayer(data.type, false)
        } else {
          this.$refs.gisMap.addLayer(data.type, true)
          this.classifyId = data.type
          getMapData({basicType: data.type}).then(resp => {
            this.mapApiList = resp.data.Api.list
            this.mapApiTotal = resp.data.Api.count
            this.mapDataList = resp.data.Data.list
            this.mapDataTotal = resp.data.Data.count
            this.mapDocList = resp.data.Document.document
            this.mapDocTotal = resp.data.Document.count
            this.showMapData = true
          })
        }
      },
      changeType(flag) {
        this.typeFlag = flag
      },
      changeTab(num) {
        this.noticeTabNum = num
        if (num == 1) {
          //获取文档列表
          getIndexDoc().then(resp => {
            if (resp.code == 200) {
              this.docList = resp.data
            }
          })
        } else {
          //获取公告列表
          getIndexNotice().then(resp => {
            if (resp.code == 200) {
              this.noticeList = resp.data
            }
          })
        }
      },
      goApi() {
        sessionStorage.setItem('tabNum', 2)
        this.$store.state.app.tabCount = 2
        this.$router.push({
          path: '/api'
        })

      },
      goMoreApi() {
        this.$store.state.app.tabCount = 2
        sessionStorage.setItem('tabNum', 2)
        this.$router.push({
          path: '/api/more',
          query: {
            basicType: this.classifyId
          }
        })
      },
      goData() {
        this.$store.state.app.tabCount = 3
        sessionStorage.setItem('tabNum', 3)
        this.$router.push({
          path: '/data'
        })
      },
      goMoreData() {
        this.$store.state.app.tabCount = 3
        sessionStorage.setItem('tabNum', 3)
        this.$router.push({
          path: '/data/more',
           query: {
            basicType: this.classifyId
          }
        })
      },
      goDoc() {
        this.$store.state.app.tabCount = 4
        sessionStorage.setItem('tabNum', 4)
        this.$router.push({
          path: '/doc'
        })
      },
      goMoreDoc() {
        this.$store.state.app.tabCount = 4
        sessionStorage.setItem('tabNum', 4)
        this.$router.push({
          path: '/doc/more',
           query: {
            basicType: this.classifyId
          }
        })
      },
      goReport() {
        this.showReport = true
      },
      goApiDetail(data) {
        this.$store.state.app.tabCount = 2
        sessionStorage.setItem('tabNum', 2)
        if (data.apiMainType == '2') {
          this.$router.push({
            name: 'apiDetail',
            query: {
              id: data.id
            }
          })
        } else {
          this.$router.push({
            name: 'commonBasic',
            query: {
              id: data.id
            }
          })
        }
      },
      goDataDetail(data) {
        this.$store.state.app.tabCount = 3
        sessionStorage.setItem('tabNum', 3)
        this.$router.push({
          name: 'dataDetail',
          query: {
            id: data.id,
            businessOrNormal: data.dataType
          }
        })
      },
      goDocDetail(data) {
        this.$store.state.app.tabCount = 4
        sessionStorage.setItem('tabNum', 4)
         this.$router.push({
            name: 'docDetail',
            query: {
              id: data.id
            }
          })
      },
      docDetail(row, column, cell, event) {
        // this.$store.state.app.tabCount = 4
        // sessionStorage.setItem('tabNum', 4)
        // if (column.label == '标题') {
        //   this.$router.push({
        //     name: 'docDetail',
        //     query: {
        //       id: row.id
        //     }
        //   })
        // }
      },
      goNoticeDetail(data) {
        this.noticeData = data
        this.showNoticeDetail = true
        this.showNotice = false
      },
      moreDetail() {
        if (this.noticeTabNum == 1) {
          this.$store.state.app.tabCount = 4
          sessionStorage.setItem('tabNum', 4)
          this.$router.push({
            path: '/doc'
          })
        } else {
          this.showNotice = true
          this.getAllNoticeList()
        }
      },
      goIndex() {
        this.showReport = false
        this.showNotice = false
        this.showNoticeDetail = false
      },
      goList() {
        this.showNotice = true
        this.getAllNoticeList()
        this.showReport = false
        this.showNoticeDetail = false
      },
      submitOrder() {
        this.$refs.orderForm.validate(valid => {
          if (valid) {
            addOrder(this.orderForm).then(resp => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
                this.showReport = false
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" >
   @import './front.less';
</style>

