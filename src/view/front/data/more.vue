<template>
  <div class="front-index">
    <div class="front-main">

        <div class="api-condition">
         
          <div class="api" v-for="(item, index) in apiList" :key="index" :title="item.name">
            <img :src="defaultUrl" v-if="!item.picPath"/>
            <img :src="item.picPath" v-if="item.picPath"/><br/>
            <span class="new" v-if="item.isNew">NEW</span>
            <span class="price" v-if="item.isFree == '1'">{{item.payStandard}}/次</span>
            <span class="free" v-if="item.isFree == '0'">免费</span><br/>
            <span class="api-name">{{item.name.substring(0, 10)}}</span>
            
            <el-button type="primary" class="btn" @click="dataDetail(item)">立即下载</el-button>
          </div>

        </div>
        <div class="footerPage mb40">
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
  import {getDataList} from '@/api/front/index'
  import {getApiTypeArray} from '@/api/api/index'
  import { getToken } from '@/utils/auth'
  export default {
    components: {
    },
    mounted() {
      this.form.basicType = this.$route.query.basicType
      this.getList()
    },
    data() {
      return {
        logoUrl: require('@/assets/images/logo.png'),
        searchUrl: require('@/assets/images/api-search.png'),
        defaultUrl: require('@/assets/images/default.png'),
        customUrl: require('@/assets/images/api-custom.png'),
        form: {
          type: '',
          sort: '1',
          businessOrNormal: '0'
        },
        page: {
          page: 1,
          size: 20
        },
        total: 0,
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
          {label: '全部', value: '0',  checked: true},
          {label: '基础数据', value: '1'},
          {label: '业务数据', value: '2'}
        ]
      }
    },
    methods: {
    
      getList() {
        let param = Object.assign(this.form, this.page)
        getDataList(param).then((resp) => {
          if (resp.code == 200) {
            this.apiList = resp.data.data
            this.total = resp.data.total
          }
        })
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      dataDetail(data) {
        this.$router.push({
          name: 'dataDetail',
          query: {
            id: data.id,
            businessOrNormal: data.businessOrNormal
          }
        })
      },
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


