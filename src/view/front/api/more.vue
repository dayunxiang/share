<template>
  <div class="front-index">
    <div class="front-main">
        <div class="api-condition">
          
          <div class="api" v-for="(item, index) in apiList" :key="index" :title="item.apiName">
            <img :src="defaultUrl" v-if="!item.filePath"/>
            <img :src="item.filePath" v-if="item.filePath"/><br/>
            <span class="new" v-if="item.isNew">NEW</span>
            <span class="price" v-if="item.isFree == '1'">{{item.payStandard}}/次</span>
            <span class="free" v-if="item.isFree == '0'">免费</span><br/>
            <span class="api-name">{{item.apiName}}</span>
            
            <el-button type="primary" class="btn" @click="dataDetail(item)">立即订阅</el-button>
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
       <!--  <div class="page">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="page.page"
            :page-size="page.size"
            layout="prev, pager, next"
            prev-text="&lt; 上一页"
            next-text="下一页 &gt;"
            :total="total">
          </el-pagination>
        </div> -->
    </div>
  </div>
</template>

<script>
  import {getApiList} from '@/api/front/index'
  import axios from 'axios'
  import { getToken } from '@/utils/auth'
  export default {
    components: {
    },
    mounted() {
      this.form.basicType = this.$route.query.basicType
      this.getList()
    },
    computed: {
      searchName() {
        return this.$store.state.app.searchApiName
      }
    },
    watch: {
      searchName(val) {
        if (val) {
          this.form.apiName = val
          this.getList()
          this.$store.state.app.searchApiName = ''
        }
      }
    },
    data() {
      return {
        logoUrl: require('@/assets/images/logo.png'),
        searchUrl: require('@/assets/images/api-search.png'),
        defaultUrl: require('@/assets/images/default.png'),
        customUrl: require('@/assets/images/api-custom.png'),
        form: {
        
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
          {label: '全部', value: '0', checked: true},
          {label: '基础API', value: '1'},
          {label: '业务API', value: '2'},
        ],
      }
    },
    methods: {

      getList() {
        let param = Object.assign(this.form, this.page)
        getApiList(param).then((resp) => {
          if (resp.code == 200) {
            this.apiList = resp.data.list
            this.total = resp.data.total
          }
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
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


