<template>
  <div class="front-index">
    <div class="front-main">
        <div class="search-container">
          <p class="search-condition">
            <label>API类型：</label>
            <span class="condition">
              <span @click="chooseApiType(item, index)" v-for="(item, index) in apiTypeArray" :key="index" :class="item.checked ? 'active' : ''">{{item.name}}</span>
            </span>
          </p>
          <p class="search-condition">
            <label>是否付费：</label>
            <span class="condition">
              <span  @click="chooseIsFree(item, index)"  v-for="(item, index) in isFreeArray" :key="index" :class="item.checked ? 'active' : ''">{{item.label}}</span>
            </span>
          </p>
          <p class="search-condition">
            <label>排序规则：</label>
            <span class="condition">
              <span  @click="chooseSort(item, index)" v-for="(item, index) in sortArray" :key="index" :class="item.checked ? 'active' : ''">{{item.label}}</span>
            </span>
          </p>
          <p class="search-condition">
            <label>是否基础：</label>
            <span class="condition">
              <span  @click="chooseObj(item, index)" v-for="(item, index) in objArray" :key="index" :class="item.checked ? 'active' : ''">{{item.label}}</span>
            </span>
          </p>
          <p class="search-condition ">
            <label>API标题：</label>
            <span class="condition clear-space">
              <el-input size="small" class="search-input" v-model="form.apiName" placeholder="请输入您要查找的API标题"></el-input>
              <el-button size="small" type="primary" @click="getList">
                <img :Src="searchUrl"/>
                搜索
              </el-button>
            </span>
            <span class="search-total">查找到 <span class="msg-count">{{total}}</span> 条相关内容</span>
          </p>
        </div>

        <div class="api-condition">
          <div class="api api-custom" v-if="page.page == 1">
            <img :src="customUrl" /><br/>
            <span class="api-name white-color">基础API订制</span><br/>
            <el-button type="primary" class="btn custom-btn" @click="basicAPi()">立即订制</el-button>
          </div>
          <div class="api" v-for="(item, index) in apiList" :key="index" :title="item.apiName">
            <img :src="defaultUrl" v-if="!item.filePath"/>
            <img :src="item.filePath" v-if="item.filePath"/><br/>
            <span class="new" v-if="item.isNew">NEW</span>
            <span class="price" v-if="item.isFree == '1'">{{item.payStandard}}/次</span>
            <span class="free" v-if="item.isFree == '0'">免费</span><br/>
            <span class="api-name">{{item.apiName}}</span>
            
            <el-button type="primary" class="btn" @click="dataDetail(item)">立即下单</el-button>
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
  import {getApiTypeArray} from '@/api/api/index'
  import axios from 'axios'
  export default {
    components: {
    },
    mounted() {
      this.getApiType()
      this.getList()
      
    },
    data() {
      return {
        logoUrl: require('@/assets/images/logo.png'),
        searchUrl: require('@/assets/images/api-search.png'),
        defaultUrl: require('@/assets/images/default.png'),
        customUrl: require('@/assets/images/api-custom.png'),
        form: {
          apiType: '',
          sort: '1',
          isPay: '2',
          isBasic: '0'
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
      getApiType() {
        getApiTypeArray({type: '2', isChild: '0'}).then(resp => {
          this.apiTypeArray = this.apiTypeArray.concat(resp.data)
        })
      },
      init() {
        let url = window.location.protocol + '//' + windwo.location.host + ':8080/manage/third_party_login' 
        axios({
          url: url,
          method: 'get',
          params: {} 
        }).then( resp => {
          console.log(resp)
        })
      },
      getList() {
        this.page.size = this.page.page == 1 ? 19 : 20
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
      }
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


