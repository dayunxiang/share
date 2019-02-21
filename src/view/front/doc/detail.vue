<template>
  <div  class="scroll">
    <front-header :hideNav="true"></front-header>
    <div class="mb325">
      <div class="front-main">
        <div class="doc-detail-container">
          <p>
            <span class="label">{{docDetail.name}}</span>
            <span v-if="docDetail.isFree != '2'">
              <img :src="priceUrl" />
              <span class="red">{{docDetail.payStander}}</span>
            </span>
            <span v-if="docDetail.isFree == '2'" class="status-success">
              免费
            </span>
          </p>
          <p class="editor">
            <span>发布人：{{docDetail.userName}}</span>
            <span>作者：{{docDetail.author}}</span>
            <span>{{docDetail.createTime}}</span>
            <span class="text-right">
              <img :src="downloadUrl" /> 
              {{docDetail.downloadTimes}}
              <span class="btn-space"></span>
              <img :src="starUrl" />  
              {{docDetail.collectionTimes}}
            </span>
          </p>

          <div class="preview-con">
            <iframe ref="iframe" id="iframe" :src="docDetail.previewUrl" frameborder="0" class="iframe"  @load="load"></iframe>
          </div>
        </div>
        <div class="doc-btn">
          <el-button type="primary" @click="download">{{docDetail.isDownload == 1 ? '再次下载' : '立即下载'}}</el-button>
          <el-button @click="collect">
            <img :src="starUrl2" v-if="docDetail.isCollect == 0"/>
            <img :src="starUrl3" v-if="docDetail.isCollect == 1"/>
            {{ docDetail.isCollect == 1 ? '取消收藏' : '收藏'}}
          </el-button>
        </div>
      </div>
    </div>
    <front-footer></front-footer>
  </div>
</template>

<script>
  import frontHeader from '../header'
  import frontFooter from '../footer'
  import {getApiList, getDocDetail, collectDoc, getDocId} from '@/api/front/index'
  import { getToken } from '@/utils/auth'
  import { cancelCollect } from '@/api/doc/index'
  import axios from 'axios'
  export default {
    components: {
      frontHeader,
      frontFooter
    },
    mounted() {
      this.getDetail()
    },
    data() {
      return {
       
        priceUrl: require('@/assets/images/price2.png'),
        downloadUrl: require('@/assets/images/doc_download.png'),
        starUrl: require('@/assets/images/doc_star.png'),
        form: {
          apiType: '',
          sort: '1',
          isPay: '2'
        },
        page: {
          page: 1,
          size: 20
        },
        total: 0,
        createTime: [],
        list: [],
        docDetail: {},
        starUrl2: require('@/assets/images/star2.png'),
        starUrl3: require('@/assets/images/star3.png')
       
      }
    },
    methods: {
      getDetail() {
         document.body.scrollTop = 0
         document.documentElement.scrollTop = 0
         window.pageYOffset = 0
        sessionStorage.setItem('tabNum', 4)
        let tag = getToken() ? '' : 'tourists/'
        getDocDetail(tag, this.$route.query.id).then(resp => {
          this.docDetail = resp.data
        })
      },
      collect() {
        if(this.docDetail.isCollect == 0) {
          collectDoc({
            id: this.$route.query.id
          }).then(resp => {
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
        } else if(this.docDetail.isCollect == 1) {
          cancelCollect(this.docDetail.collectId).then(resp => {
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
      download() {
        let param = {
          id: this.$route.query.id
        }
        getDocId(param).then(resp => {
          if (resp.code == 200) {
            window.location.href = '/manage/attachment/' + resp.data.attachmentId + '?name=' + resp.data.name
            this.getDetail()
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      load() {
        console.log(111,this.$refs.iframe)
        //this.$refs.iframe.body
        this.$refs.iframe.contentWindow.document.body.addEventListener('click', function() {
          console.log(222222)
        })
        this.$refs.iframe.contentWindow.document.addEventListener('click', function() {
          console.log(3333)
        })
        this.$refs.iframe.contentWindow.addEventListener('click', function() {
          console.log(2224444222)
        })
        this.$refs.iframe.addEventListener('click', function() {
          console.log(55555)
        })
        this.$refs.iframe.contentWindow.document.body.addEventListener('selectstart', function() {
          console.log(333333)
        })
      }



   
  
      
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
   .iframe {
     width: 100%;
     height: 100%;
     overflow: hidden;
   }
   .status-success {
    color: #13b979;
   }
</style>


