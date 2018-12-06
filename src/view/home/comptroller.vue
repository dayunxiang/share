<template>
  <div class="puFraming homeIndex">
    <el-row :gutter="20" class="height-230">
      <el-col :span="16">
        <el-card class="userinfo-con vertical-center">
          <!-- <div solt="header" class="card-header">
            <span>用户信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="userCenter">更多 ></el-button>
          </div> -->
          <el-row class="flex">
            <el-col :span="8">
              <div class="card-body">
                <b class="font-22">{{userInfo.userName}}</b><span class="role">{{userInfo.userRole}}</span>
                <div class="text-padding-top">
                  <p>所属部门：{{userInfo.userDept}}</p>
                  <p>行政区划：{{userInfo.areaName}}</p>
                  <p>联系电话：{{userInfo.userTel}}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="card-body">
                <p>上次登录</p>
                <div class="text-padding-top text-padding-left">
                  <p>IP：192.168.2.1</p>
                  <p>时间：2018-10-08</p>
                </div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="card-body">
                <p>状态统计</p>
                <div class="text-padding-top inline-box">
                  <div class="grey-box">
                    <b class="font-22">2</b>
                    <span>已复核</span>
                  </div>
                  <div class="grey-box">
                    <b class="font-22">3</b>
                    <span>待审核</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
     <!--  <el-col :span="8" >
        <el-card class="userinfo-con">
          <div solt="header" class="card-header">
            <span>状态统计</span>
          </div>
          <div class="card-body height-250">
           <div class="static">
            <p>
              <span class="title">草稿</span>
              <span class="bar-con">
                <span class="bar yellow" :style="dataStatus[1].percent">
                  <span class="count font-yellow">{{dataStatus[1].number}}</span>
                </span>
              </span>
            </p>
            <p>
                <span class="title">已复核</span>
                <span class="bar-con">
                  <span class="bar green" :style="dataStatus[0].percent">
                    <span class="count font-green">{{dataStatus[0].number}}</span>
                  </span>
                </span>
              </p>
              
              <p>
                <span class="title">待审核</span>
                <span class="bar-con">
                  <span class="bar red" :style="dataStatus[2].percent">
                    <span class="count ">{{dataStatus[2].number}}</span>
                  </span>
                </span>
              </p>
              <p>
                <span class="title">已审核</span>
                <span class="bar-con">
                  <span class="bar blue" :style="dataStatus[3].percent">
                    <span class="count">{{dataStatus[3].number}}</span>
                  </span>
                </span>
              </p>
            </div>
          </div>
        </el-card>
      </el-col> -->
      <el-col :span="8">
        <el-card class="userinfo-con">
          <div solt="header" class="card-header">
            <span>快捷入口</span>
          </div>
          <div class="card-center" style="display: flex;flex-direction: column;">
            <div class="card-body">
              <div class="sub-link" v-if="userRoleType != 'province'">
                <div class="logo"><img :src="editUrl"></div>
                <div class="title">
                  <h5>我有新的数据希望添加新数据录入</h5>
                  <a @click="newData">新增项目</a>
                </div>
              </div>
              <div class="sub-link" v-if="userRoleType != 'country'">
                <div class="logo"><img :src="emailUrl"></div>
                <div class="title">
                  <h5>我已提交了数据想看是否审核</h5>
                  <a @click="approvalList">待审核项目</a>
                </div>
              </div>
              <div class="sub-link">
                <div class="logo"><img :src="searchUrl"></div>
                <div class="title">
                  <h5>我想查询某个项目的具体信息情况</h5>
                  <a @click="rectifyList">项目汇总列表</a>
                </div>
              </div>  
            </div>
          </div>
          
        </el-card>
      </el-col>
    </el-row>
    <div style="padding-top: 20px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="userinfo-con">
            <div solt="header" class="card-header">
              <span>全省项目数量统计 - 共 {{platform0}} 个项目</span>
            </div>
            <div class="card-body height-500">
              <count-chart :data="countData" ></count-chart>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="userinfo-con">
            <div solt="header" class="card-header">
              <span>审核管理流程</span>
            </div>
            <div class="card-body height-500">
              <h5 class="c-h5">县上报数据到市，市级部门先对县级上报的数据和材料进行审核，通过则自动上报到省（不通过则告知县数据市审核未通过，并可查看原因），省级审核，省复审通过则系统修改真正的数据，未通过则告知县级单位，县级单位可查看未通过原因。</h5>
              <img class="approval-img" :src="approvalUrl"/>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {getNumber,getMessage, getUserInfo, getDataStateList, getCityCount} from '@/api/index/index';
  import {getMessageUpdate} from '@/api/message/index';
  import {getCity, setHistory} from '@/utils/auth';
  import countChart from './countChart'
  export default {
    name: 'home',
    components: {
      countChart
    },
    created() {
      this.getDate()
      this.getUser()
      this.getApprove()
      this.getCityCountData()
    },
    data() {
      return {
        dialogVisible: false,
        nameType:1,
        plDate:[{number: 0, hystProp: 0}],
        platformName: '',
        platform0:0,
        platform1:0,
        platform2:0,
        platform3:0,
        platform4:0,
        platform5:0,
        userRoleType: '',
        messages:[],
        countData: [],
        labelArray: [],
        details: {
          msgRdataId: '',
          msgStatus: '',
          msgTitle: "",
          msgContent: "",
          msgAddDate: ""
        },
        userInfo: {},
        dataStatus: [{},{},{},{}],
        provinceUrl: require('@/assets/images/province.png'),
        buildUrl: require('@/assets/images/build.png'),
        workingUrl: require('@/assets/images/working.png'),
        offlineUrl: require('@/assets/images/offline.png'),
        rejectUrl: require('@/assets/images/reject.png'),
        deleteUrl: require('@/assets/images/delete.png'),
        editUrl: require('@/assets/images/edit.png'),
        emailUrl: require('@/assets/images/email.png'),
        searchUrl: require('@/assets/images/search.png'),
        approvalUrl: require('@/assets/images/approve.png')
      }
    },
    methods: {
      getCityCountData() {
        getCityCount().then((resp) => {
          this.countData = resp.data.map((v, index) => {
            let color = ''
            switch (index) {
              case 0: color = '#37A2DA'; break;
              case 1: color = '#32C5E9'; break;
              case 2: color = '#64DFE3'; break;
              case 3: color = '#9FE6B8'; break;
              case 4: color = '#FFDB5C'; break;
              case 5: color = '#FF9F7F'; break;
              case 6: color = '#FB7293'; break;
              case 7: color = '#E062AE'; break;
              case 8: color = '#e841e3'; break;
              case 9: color = '#E690D1'; break;
              case 10: color = '#E7BCF3'; break;
              case 11: color = '#8224e8'; break;
              case 12: color = '#281bea'; break;
              default: color = '#ccc';
            }
            return {
              value: v.number,
              name: v.cityName,
              itemStyle: {
                color: color
              }
            }
          })
        })
      },
      getApprove() {
        getDataStateList().then((resp) => {
          this.dataStatus = resp.data
          let countArray = resp.data.map((v) => {
            return v.number
          }).sort((a, b) => {
            return b - a
          })
          let maxCount = countArray[0]
          this.dataStatus.forEach((v) => {
            let num = (v.number / maxCount).toFixed(4) * 100;
            if(num==0){
              num = 0.5
            }
            v.percent = 'width: ' + num + '%'
          })
        })
      },
      getUser() {
        getUserInfo().then((resp) => {
          this.userInfo = resp.data[0]
        })
      },
      getDate() {
        getNumber().then(res => {
          this.plDate = res.data;
          for(let i=0;i<res.data.length;i++){
            if(this.plDate[i].hystProp=='0'){
              this.platform1 = this.plDate[i].number;
            }
            if(this.plDate[i].hystProp=='1'){
              this.platform2 = this.plDate[i].number;
            }
            if(this.plDate[i].hystProp=='2'){
              this.platform3 = this.plDate[i].number;
            }
            if(this.plDate[i].hystProp=='3'){
              this.platform4 = this.plDate[i].number;
            }
            if(this.plDate[i].hystProp=='4'){
              this.platform5 = this.plDate[i].number;
            }
          }
          this.platform0 = this.platform2 + this.platform3 + this.platform4;
          if(getCity().length==2){
            this.platformName = '全省'
            this.userRoleType = 'province'
          }
          if(getCity().length==4){
            this.platformName = '全市'
            this.userRoleType = 'city'
          }
          if(getCity().length==6){
            this.platformName = '全县'
            this.userRoleType = 'country'
          }
        });
        /**getMessage().then(res => {
          this.messages = res.data
        });*/
      },
      onDoing(row){
        getMessageUpdate(row.id).then(res=>{
          if(res.code==200){
            this.details = res.data;
            this.dialogVisible = true;
            if(row.msgStatus==0){
              row.msgStatus=1
            }
          }
        });
      },
      userCenter() {
        let route = this.$route.path
        setHistory(route)
        this.$router.push({
          path: '/home/center/0'
        })
      },
      newData() {
        this.$router.push({
          path: '/rectify/add'
        })
      },
      approvalList() {
        this.$router.push({
          path: '/supervision'
        })
      },
      rectifyList() {
        this.$router.push({
          path: '/rectify/regulate'
        })
      },
      dataDetail(status) {
        let param = {
          status: status,
          type: '1'
        }
        this.$router.push({
          name: 'regulate',
          params: param
        })
      }
    },
    computed: {
      elements () {
        return this.$store.state.user.elements
      }
    },
  }
</script>

<style scoped>
  .puFraming {
    background: none;
  }
  .more {
    color: #0b89c7;
    float: right;
  }
  .c-h5{
    font-weight: bold;
    font-size: 14px;
    line-height: 24px;
    color: #666;
  }
</style>


