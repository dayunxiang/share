<template>
  <div class="">
    <div class="center-outer main-container bgff">
      <p class="welcome">欢迎您，<span>{{userName}}</span></p>
      <el-row class="account-statistic">
        <el-col :span="11" class="account-balance">
            <p class="title">账户余(水利币)</p>
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
      
    
      <el-dialog title="充值申请" :visible="showApply" v-if="showApply"  :append-to-body="true" @close="cancel" width="375px">
        <div >
          <p style="margin-bottom: 20px;">
            <label>申请金额：</label>
            <el-input size="mini" v-model="applyCount" class="form-input" maxlength="20"></el-input>
          </p> 
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
        this.showApply = true;
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
              message: '申请成功'
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


