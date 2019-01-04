<template>
  <div>
    <p class="page-title">工单详情</p>
    <div class="main-container"> 
      <div class="detail-container">
        <p class="title">{{data.title}}</p>
        <el-row>
          <el-col :span="6">
            <label>工单编号:</label>
            <span>{{data.num}}</span>
          </el-col>
          <el-col :span="6">
            <label>申请人:</label>
            <span>{{data.applicant}}</span>
          </el-col>
          <el-col :span="7">
            <label>申请时间:</label>
            <span>{{data.applicantDate}}</span>
          </el-col>
          <el-col :span="5">
            <label>状态:</label>
            <span v-if="data.status == '1'" class="text-blue">待受理</span>
            <span v-if="data.status == '2'" class="text-red">待回复</span>
            <span v-if="data.status == '3'" class="text-gray">已解决</span>
            <span v-if="data.status == '4'" class="text-gray">已关闭</span>
          </el-col>
        </el-row>
        <el-row v-if="data.status == 2 || data.status == 3 || data.status == 4" class="mar-t-20">
          <el-col :span="6">
            <label>受理时间:</label>
            <span >{{data.acceptDate}}</span>
          </el-col>
          <el-col :span="6">
            <label>受理人:</label>
            <span >{{data.acceptor}}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="main-container"> 
      <div class="detail-container">
        <el-row :gutter="20"> 
          <el-col :span="5">
            <img :src="data.applicantPhoto" class="avator-img" v-if="data.applicantPhoto.length > 0"/>
            <img :src="avatorUrl2" class="avator-img" v-if="data.applicantPhoto.length == 0"/>
            <span class="avator-name">{{data.applicant}}</span>
          </el-col>
          <el-col :span="19">
            <span>{{data.question}}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="main-container" v-for="(item, index) in data.answerList" :key="index"> 
      <div class="detail-container">
        <el-row :gutter="20">
          <el-col :span="5">
            <img class="avator-img" :src="item.photo" v-if="item.photo.length > 0"/>
            <img :src="avatorUrl2" class="avator-img" v-if="item.photo.length == 0"/>
            <span class="avator-name">{{item.answor}}</span>
          </el-col>
          <el-col :span="19">
            <span class="reply-con">{{item.content}}</span>
            <span class="time">{{item.answerTime}}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="main-container" v-if="tabNum == 1 || tabNum == 2"> 
      <div class="detail-container">
        <el-row>
          <el-col :span="5">
            <img :src="userInfo.photo" class="avator-img" v-if="userInfo.photo.length > 0"/>
            <img :src="avatorUrl" class="avator-img" v-if="userInfo.photo.length == 0 && userInfo.isAdmin == '1'"/>
            <img :src="avatorUrl2" class="avator-img" v-if="userInfo.photo.length == 0 && userInfo.isAdmin == '0'"/>
            <span class="avator-name">{{userName}}</span>
            <br/>
            <span class="deal-check" v-if="tabNum == 2">
              <el-checkbox v-model="isResolve"> </el-checkbox>
              如该工单<span class="red">已解决</span>请勾选
            </span>
          </el-col>
          <el-col :span="19">
            <el-input type="textarea" class="quesDesc" v-model="content" maxlength="200"></el-input>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="btn-group btn-container">
      <el-button type="primary" size="mini" @click="save" v-if="tabNum == 1 || tabNum == 2">提交</el-button>
      <el-button size="mini" @click="back" >返回</el-button>
    </div>
  </div>
</template>

<script>
  import {getOrderDetail, saveContent} from '@/api/order/index'
  import {getUser} from '@/utils/auth'
  export default {
    name: 'orderDetail',
    components: {
      
    },
    props: {
      
    },
    watch: {
      $route() {
        if (this.$route.params.id) {
          this.dataId = this.$route.params.id
          this.tabNum = this.$route.params.tabNum
          this.type = this.$route.params.type
          this.getDetail()
        }
      }
    },
    activated() {
      if (getUser()) {
        this.userInfo = JSON.parse(getUser())
        this.userName = JSON.parse(getUser()).name
      }
    },
    mounted() {
      this.dataId = this.$route.params.id
      this.tabNum = this.$route.params.tabNum
      this.type = this.$route.params.type
      if (!this.dataId) {
        this.dataId = localStorage.getItem('orderId')
        this.tabNum = localStorage.getItem('tabNum')
        this.type = localStorage.getItem('type')
      } else {  
        localStorage.setItem('orderId', this.dataId)
        localStorage.setItem('tabNum', this.tabNum)
        localStorage.setItem('type', this.type)
      }
      this.getDetail()
    },
    data() {
      return {
        dataId: '',
        content: '',
        userName: '',
        userInfo: {},
        isResolve: '',
        tabNum: '',
        type: '',
        data: {
          answerList: []
        },
        form: {
          queryModule: ''
        },
        avatorUrl: require('@/assets/images/default-avator.jpg'),
        avatorUrl2: require('@/assets/images/default-admin.jpg')
        
      }
    },
    computed: {

    },
    methods: {
      getDetail() {
        getOrderDetail(this.dataId).then(resp => {
          if (resp.code == 200) {
            this.data = resp.data
          } 
        })
      },
      save() {
        let param = {
          workOrderId: this.data.id,
          content: this.content
        }
        if (this.tabNum == 2) {
          param.isResolve = this.isResolve ? '1' : '0'
        }
        saveContent(param).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '回复成功'
            })
            if (this.type == 'admin') {
              this.$router.push({
                name: 'orderManage',
                params: {
                  type: 'init'
                }
              })
            } else {
              this.$router.push({
                name: 'myOrder',
                params: {
                  type: 'init'
                }
              })
            }
            this.$store.commit('closeTag', 'orderDetail')
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      back() {
        if (this.type == 'admin') {
          this.$router.push({
            name: 'orderManage'
          })
        } else {
          this.$router.push({
            name: 'myOrder'
          })
        }
        
        this.$store.commit('closeTag', 'orderDetail')
      }
 
    }
  }
</script>

<style scoped lang="less">
  button a {
    color: #606266;
  }
  button:hover a {
    color: #3a8ee6;
  }
  .box-outer{
    table-layout: fixed;
  }
  .search-box{
    width: 100%
  }
  .btn-box{
    vertical-align: top;
    height: 100%;
  }
  .btnhide{
    position: absolute;
    right: 0;
    height: 0;
    bottom: 0;
  }
  .btnhide{
    width: 0;
  }
  .deal-check{
    display: inline-block;
    font-size: 12px;
    margin-top: 60px;
  }
  .deal-check .red {
    color: #EE3323;
  }

</style>

