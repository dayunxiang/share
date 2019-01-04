<template>
  <div>
    <div class="front-detail">
      <div class="front-main">
        <div class="api-detail">
          <div class="api-img">
            <img :src="defaultUrl" v-if="!data.picPath"/>
            <img :src="data.picPath" v-if="data.picPath"/>
            <span class="count">
              <span class="count-detail">
                <img :src="starUrl"/><br/>
                <small> {{data.collectionTimes}}</small>
              </span>
              <span class="border"></span>
              <span class="count-detail">
                <img :src="downloadUrl" style="height: 14px;"/><br/>
                <small>{{data.downloadTimes}}</small>
              </span>
            </span>
          </div>
          <div class="api-info">
            <p class="title">{{data.name}}</p>
            <p class="desc" :title="data.shortDescription">{{data.shortDescription}}</p>
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
                立即下载
              </el-button>
               <el-button  @click="collectData">
                <img :src="starUrl2" v-if="data.isCollection == 0"/>
                <img :src="starUrl3" v-if="data.isCollection == 1"/>
                {{ data.isCollection == 1 ? '取消收藏' : '收藏' }}
              </el-button>
            </p>
          </div>
        </div>  
      </div>
    </div>
    <div class="detail-info">
      <div class="detail" v-if="businessOrNormal == 2">   
        <p class="table-title clear-top">数据示例：</p>
        <img :src="data.examplePicPath" class="example-img"/>

        <p class="table-title" id="dataList">数据列表：</p>
        <el-table :data="data.listAttachmentIdsVO" border  row-class-name="table-center" header-row-class-name="table-center">
          <el-table-column label="数据包名称" prop="attachmentName"></el-table-column>
          <el-table-column label="格式" prop="attachmentPattern"></el-table-column>
          <el-table-column label="大小(kb)" prop="attachmentSize"></el-table-column>
          <el-table-column label="发布时间" prop="attachmentTime"></el-table-column>
          <el-table-column label="操作" prop="" width="120">
            <template slot-scope="scope">
              <a @click="downloadFile(scope.row)" class="download-link">下载</a>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--  -->
      <div class="detail" v-if="businessOrNormal == 1">
        <p class="table-title">数据报表：</p>
        <el-table :data="data.fieldList" border>
          <el-table-column v-for=" (item, index) in columns" :label="item.wordExplain" :key="index" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row[item.word]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getBusinessDataDetail, addDataCollection, getDataCategory, getCategoryById, getTableDetail, minusWaterMoney, visitorDetail, beforeBasicDown} from '@/api/front/index'
  import { getBaseDetail, getBizeDetail } from '@/api/data/index'
  import { getUserInfoDetail } from '@/api/share/index'
  import {download,download2} from '@/api/common/common'
  import { getToken } from '@/utils/auth';
  import { cancelCollect } from '@/api/market/index'
  export default {
    components: {
    },
    mounted() {
      this.dataId = this.$route.query.id
      this.businessOrNormal = this.$route.query.businessOrNormal
      this.getDetail()
    },
    watch: {
      $route() {
        this.dataId = this.$route.query.id
        this.businessOrNormal = this.$route.query.businessOrNormal
        this.getDetail()
      }
    },
    data() {
      return {
        result: [],
        selectedKeys: [],
        dataId: '',
        businessOrNormal: '',
        isShowDesc: false,
        showBook: false,
        bookPrice: 0,
        bookCount: 50,
        bookTitle: '',
        data: {
          listAttachmentIdsVO: [],
          fieldList: []
        },
        columns: [],
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
        exampleImg: require('@/assets/images/exampleImg.png'),
        logoUrl: require('@/assets/images/logo.png'),
        defaultUrl: require('@/assets/images/default.png'),
        starUrl: require('@/assets/images/star.png'),
        starUrl2: require('@/assets/images/star2.png'),
        starUrl3: require('@/assets/images/star3.png'),
        watchUrl: require('@/assets/images/watch.png'),
        priceUrl: require('@/assets/images/price2.png'),
        downloadUrl: require('@/assets/images/doc_download.png')
      }
    },
    methods: {
      getDetail() {
        let param = {
          id: this.dataId
        }
        if (this.businessOrNormal == '2') {
          let tag = getToken() ? 'detail' : 'visitor'
          getBusinessDataDetail(tag, param).then(resp => {
            this.data = resp.data
            this.data.downloadTimes = this.data.downloadTimes ? this.data.downloadTimes : 0
            this.data.collectionTimes = this.data.collectionTimes ? this.data.collectionTimes : 0
          })
        } else {
          let tag2 = getToken() ? '' : 'detail/'
          getBaseDetail(tag2, this.dataId).then(resp => {
            this.data = resp.data
            this.data.downloadTimes = this.data.downloadTimes ? this.data.downloadTimes : 0
            this.data.collectionTimes = this.data.collectionTimes ? this.data.collectionTimes : 0
            //获取表名
            getCategoryById({categoryType: this.data.mainType}).then(res => {
              this.tableArray = res.data
              let tableId = this.data.subTableName
             
              getTableDetail({propertyTable: tableId}).then(resp => {
                let tableColumns = resp.data
                let columnsKeys = Object.keys(this.data.fields)
                this.columns = tableColumns.filter( val => {
                  return columnsKeys.indexOf(val.word) > -1
                })
              })
            })
          })
        }
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
      collectData() {
        let param = {
          dataId: this.dataId,
          businessOrNormal: this.businessOrNormal
        }
        if(this.data.isCollection == 0) {
          addDataCollection(param).then((resp) => {
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
        } else if(this.data.isCollection == 1){
          cancelCollect(param.dataId).then(resp => {
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
        if (this.businessOrNormal == '2') {
          let anchor = this.$el.querySelector('#dataList')
          document.body.scrollTop = anchor.offsetTop - 100
          document.documentElement.scrollTop = anchor.offsetTop - 100
        } else {
          // download('/webapp/data/form_excel?id=' + this.dataId, '数据报表', function() {

          // })
          beforeBasicDown({id:this.dataId}).then( res => {
            if(res.code == 200) {
              window.location.href = '/webapp/data/form_excel?id=' + this.dataId
              this.getDetail()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
          
        }
      },
      cancel() {
        this.showBook = false
      },
      
      changeCount() {
        this.bookPrice = this.data.payStandard * this.bookCount
      },
      downloadFile(row) {
        // if(this.data.payStandard != 0) {
          //扣除水利币
          minusWaterMoney({
            id: this.dataId,
            attachmentId: row.attachmentId
          }).then( res => {
            if(res.code == 200) {
              window.location.href = '/manage/attachment/' + row.attachmentId
              this.getDetail()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        // }
       
      }
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


