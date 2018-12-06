<template>
  <div>
    <p class="page-title">我的充值记录</p>
    <div class="center-outer backbg main-container">
      <div class="mar-20">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
          <el-table-column label="充值账户" prop="rechargeAccountName"></el-table-column>
          <el-table-column label="充值时间" prop="rechargeTime"></el-table-column>
          <el-table-column label="充值金额（水利币）" prop="rechargeAmount"></el-table-column>
        </el-table>
        <div class="footerPage">
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
  </div>
</template>

<script>
  import {getRechargeRecord} from '@/api/share/index'
  export default {
    components: {
    },
    mounted() {
      this.getList()
    },
    data() {
      return {
        total: 0,
        showApply: false,
        priceUrl: require('@/assets/images/price2.png'),
        balanceUrl: require('@/assets/images/balance.png'),
        detailUrl: require('@/assets/images/detail.png'),
        defaultUrl: require('@/assets/images/default.png'),
        list: [],
        selection: [],
        applyCount: '',
        form: {

        },
        page: {
          page: 1,
          size: 10
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
        let param = Object.assign(this.page, this.form)
        getRechargeRecord(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      apply () {
        this.showApply = true;
      },
      cancel () {
        this.showApply = false
      },
      ensure () {
        this.showApply = false
      },
      renew(data) {
        this.$router.push({
          name: 'apiDetail',
          query: {
            id: data.id
          }
        })
      },
      recharge() {
        this.$router.push({
          name: 'shareRecharge'
        })
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      }
    }
  }
</script>

<style scoped>
  /*.puFraming {
    padding-top: 10px;
    padding-bottom: 40px;
  }*/
  .puTableHeader {
    border: 1px solid #ccc;
    border-bottom: none;
    text-align: center;
    margin: 0;
  }
  .backbg {
    margin: 16px;
    background: #fff;
  }
  .footerPage {
    margin-top: 10px;
  }
</style>


