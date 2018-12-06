<template>
  <div class="front-index">
    <div class="index-container">
      <div class="classify">
        <div class="classify-con">
          <img :src="typeFlag == 1 ? bussinessUrl2 : bussinessUrl" class="classify-bussiness " :class="{active: typeFlag == 1}" @click="changeType(1)"/>
          <img :src="typeFlag == 2 ? basicUrl2 : basicUrl" class="classify-basic" :class="{active: typeFlag == 2}" @click="changeType(2)"/>
        </div>
        <div class="classify-detail">
          <div v-for="(item, index) in basicClassify" :key="item.id" class="detail-con" v-if="typeFlag == 1">
            <p><i class="classify-icon" :class="{'icon': index == 0, 'icon1': index == 1, 'icon2': index == 2, 'icon3': index == 3, 'icon4': index == 4, 'icon5': index == 5}"></i>{{item.name}}</p>
            <span v-for="child in item.children" :key="child.id" :class="{active: child.id == classifyId}" @click="chooseClassify(child)">{{child.name}}</span>
          </div>
          <div v-for="(item, index) in bussinessClassify" :key="item.id" class="detail-con" v-if="typeFlag == 2">
            <p><i class="classify-icon" :class="{'icon': index == 0, 'icon1': index == 1, 'icon2': index == 2, 'icon3': index == 3, 'icon4': index == 4, 'icon5': index == 5}"></i>{{item.name}}</p>
            <span v-for="child in item.children" :key="child.id" :class="{active: child.id == classifyId}" @click="chooseClassify(child)">{{child.name}}</span>
          </div>
        </div>
      </div>
      <div class="map-container">
        <img :src="mapUrl" />
      </div>
    </div>
  </div>
</template>

<script>
  import {getApiList, getClassify} from '@/api/front/index'
  import {getApiTypeArray} from '@/api/api/index'
  import axios from 'axios'
  export default {
    components: {
    },
    mounted() {
      //this.getList()
      this.getClassifyType()
      if (this.$route.path == '/third') {
        //第三方登陆
        this.init()
      }
    },
    data() {
      return {
        mapUrl: require('@/assets/images/map.png'),
        basicUrl: require('@/assets/images/classify-basic.png'),
        basicUrl2: require('@/assets/images/classify-basic2.png'),
        bussinessUrl: require('@/assets/images/classify-bussiness.png'),
        bussinessUrl2: require('@/assets/images/classify-bussiness2.png'),
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
        basicClassify: [],
        bussinessClassify: [],
        classifyId: '',
        typeFlag: '1'
      }
    },
    methods: {
      getClassifyType() {
        getClassify({type: '1',isChild: '1'}).then(resp => {
          this.basicClassify = resp.data
        })
        getClassify({type: '2',isChild: '1'}).then(resp => {
          this.bussinessClassify = resp.data
        })
      },
      init() {
        let url = window.location.protocol + '//' + window.location.host + ':8080/manage/third_party_login' 
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
      },
      chooseClassify(data) {
        if (this.classifyId == data.id) {
          this.classifyId = ''
        } else {
          this.classifyId = data.id
        }
      },
      changeType(flag) {
        this.typeFlag = flag
      }
    }
  }
</script>

<style lang="less" >
   @import './front.less';
</style>


