<template>
  <div class="center-outer">
    <div class="share-info mb10">
      <p class="welcome">欢迎您，<span>{{userName}}</span></p>
      <el-row class="account-statistic">
        <el-col :span="8" class="account-balance">
            <p class="title">账户余额(水利币)</p>
            <img :src="priceUrl" />
            <span class="price">{{balance}}</span>
        </el-col>
        <el-col :span="16" style="padding-top: 10px;">
          <el-row>
            <el-col :span="8">
              <img :src="balanceUrl"/>
              <el-button type="primary" class="account-btn" @click="apply">充值申请</el-button>
            </el-col>
            <el-col :span="8">
              <img :src="detailUrl"/>
              <el-button type="success" class="account-btn mt6" @click="recharge">充值记录</el-button>
            </el-col>
            <el-col :span="8">
              <img :src="flowUrl"/>
              <el-button type="info" class="account-btn mt6" @click="flow">账户流水</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="share-info">
      <p class="account-title">已申请的数据({{total}})</p>
      <el-row :gutter="30">
        <el-col :span="12" v-for="(item, index) in dataArray" :key="index" :title="item.apiName">
          <div class="account-detail-outer">
            <div class="img-out">
              <img :src="defaultUrl" v-if="!item.picUrl"/>
              <img :src="item.picUrl" v-if="item.picUrl"/>
            </div>
            <div class="detail">
              <p class="title">{{item.apiName}}</p>
              <p>申请时间：{{item.apiBoughtTime}}</p>
              <p>
                剩余
                <span class="count">{{item.apiRestTimes}}</span>
                次
              </p>
              <p class="btn-outer">
                <el-button @click="renew(item)">立即续费</el-button>
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="充值申请" :visible="showApply" v-if="showApply"  :append-to-body="true" @close="cancel" width="390px">
      <div>
        <label><span class="red">* </span>申请金额：</label>
        <div class="form-input el-input el-input--mini">
          <input type="text" v-model="applyCount" class="el-input__inner" maxlength="9" @input="checkPay(applyCount)"/>
        </div>
        <p style="margin-bottom: 20px;"></p> 
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="ensure" size="mini">提交</el-button>
        <el-button  @click="cancel" size="mini">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getUser } from '@/utils/auth'
  import {getShareList, getUserInfoDetail, moneyApply} from '@/api/share/index'
  export default {
    components: {
    },
    mounted() {
      this.userName = JSON.parse(getUser()).name
      this.getUserInfo()
      this.getList()
    },
    data() {
      return {
        userName: '',
        total: 0,
        balance: 0,
        showApply: false,
        priceUrl: require('@/assets/images/price2.png'),
        balanceUrl: require('@/assets/images/balance.png'),
        detailUrl: require('@/assets/images/detail.png'),
        flowUrl: require('@/assets/images/flow.png'),
        defaultUrl: require('@/assets/images/default.png'),
        list: [],
        selection: [],
        applyCount: '',
        dataArray: [],
        form: {

        }
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      checkPay(value) {
        //收费标准
        if(/[^\d^\.]+/g.test(value)) {

          this.applyCount = value.replace(/[^\d^\.]+/g,'')
         
          
        } else if(value.indexOf('.') > -1 && value.charAt(0) !== '.'){
          //有小数点
          this.applyCount = value.slice(0,value.indexOf('.')+3)
          
        } else if(value.indexOf('.') < 0) {
          //没有小数点
          this.applyCount = value.slice(0,6)
          
        } else if(value.charAt(0) == '.'){
          //没有整数，有小数点
          this.applyCount = '0'+value
          
        } else {
          //callback()
        }
      },
      getList() {
        getShareList().then((resp) => {
          this.dataArray = resp.data.list
          this.total = resp.data.total
        })
      },
      getUserInfo() {
        getUserInfoDetail().then((resp) => {
          this.balance = resp.data
        })
      },
      apply () {
        this.showApply = true
        this.applyCount = ''
      },
      cancel () {
        this.showApply = false
      },
      ensure () {
        let param = {
          money: this.applyCount
        }
        moneyApply(param).then((resp) => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '充值申请提交成功，待管理员审批，审批后会立即到账'
            })
            this.showApply = false
          } else {
            this.$message({
              type: 'success',
              message: resp.message
            })
          }
        })
      },
      renew(data) {
        this.$router.push({
          name: 'apiDetail',
          query: {
            id: data.apiId
          },
          params: {
            type: 'recharge'
          }
        })
      },
       recharge() {
        this.$router.push({
          name: 'shareRecharge'
        })
      },
      flow() {
        this.$router.push({
          name: 'serialList'
        })
      }
    }
  }
</script>

<style scoped>
  .mt6 {
    margin-top: 6px;
  }
</style>


