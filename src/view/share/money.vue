<template>
  <div class="">
    <div class="center-outer main-container bgff pt-twoline-nomar">
      <p class="welcome">欢迎您，<span>{{userName}}</span></p>
      <el-row class="account-statistic">
        <el-col :span="11" class="account-balance">
            <p class="title">账户余额(水利币)</p>
            <img :src="priceUrl" />
            <span class="price">{{balance}}</span>
        </el-col>
        <el-col :span="13" style="padding-top: 10px;">
          <el-row>
            <el-col :span="24">
              <img :src="balanceUrl"/>
              <el-button type="primary" class="account-btn" @click="apply">充值申请</el-button>
            </el-col>
            
          </el-row>
        </el-col>
      </el-row>
      
    
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
      }
    }
  }
</script>

<style scoped>
  .mt6 {
    margin-top: 6px;
  }
</style>


