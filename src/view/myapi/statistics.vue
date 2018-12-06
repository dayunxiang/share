<template>
 <div class="my-api main-container">
    <div class="page-tab">
      <span class="tabs" :class="form.type == '1' ? 'active' : ''" @click="changeTab('1')">当天</span>
      <span class="tabs" :class="form.type == '2' ? 'active' : ''" @click="changeTab('2')">近15日</span>
    </div>
    <div class="chart-outer">
      <chart :data="data" :name="$route.params.name":xAxis="xAxis" :historyTotal="historyTotal" :todayTotal="todayTotal"></chart>
    </div>
  </div>
</template>

<script>
  import {getStatistics} from '@/api/myapi/index'
  import chart from './chart'
  export default {
    name: 'apiStatistics',
    components: {
      chart
    },
    activated() {
      let code = this.$route.params.code 
      if (code) {
        this.form.apiAuthorizeCode = code
        this.getList()
      }
    },
    watch:{
      
    },
    mounted() {
      let code = this.$route.params.code 
      if (!code) {
        this.$router.push({
          name: 'myApi'
        })
        this.$store.commit('closeTag', 'apiStatistics')
      } 
    },
    data() {
      return {
        data: [],
        xAxis: [],
        chartData: [],
        todayTotal: 0,
        historyTotal: 0,
        form: {
            apiAuthorizeCode: '',
            type: '1'
        },
      }
    },
    computed: {

    },
    methods: {
      getList() {
        getStatistics(this.form).then((resp) => {
          this.chartData = resp.data.list
          this.historyTotal = resp.data.historyTotal
          this.todayTotal = resp.data.todayTotal
          this.resetData()
        })
      },
      changeTab(type) {
        this.form.type = type
        this.getList()
      },
      resetData() {
        if (this.form.type == '2') {
          let date = new Date()
          let dateTime = date.getTime() 
          let xAxis = []
          for (let i = 14; i >= 0; i--) {
            let time = dateTime - 3600 * 24 * 1000 * i
            let historyDate = this.getDate(time)
            xAxis.push(historyDate)
          }
          this.xAxis = xAxis
          let data = []
          this.data = xAxis.map((v, index) => {
            let result = false
            let data = ''
            this.chartData.forEach(value => {
              if (value.apiCallDate == v) {
                result = true
                data = value.apiCallTimes
              }
            })
            if (result) {
              return data
            } else {
              return 0
            }
          })
        } else {
          this.data = []
           this.xAxis = []
          for (let i = 1; i < 25; i++) {
            let result = false
            let data = ''
            this.chartData.forEach(value => {
              if (value.apiCallDate == i + '') {
                result = true
                data = value.apiCallTimes
              }
            })
            this.data.push(result ? data : 0)
            this.xAxis.push(i + '点')
          }
        }
      },
      getDate(time) {
        let date = new Date(time)
        let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
        let day = date.getDate() > 9 ? (date.getDate()) : ('0' + date.getDate())
        return month + '-' + day
      }
    
    }
  }
</script>

<style scoped>

</style>


