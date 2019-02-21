<template>
 <div class="my-api main-container">
    <div class="page-tab">
      <span class="tabs" :class="form.type == '1' ? 'active' : ''" @click="changeTab('1')">当天</span>
      <span class="tabs" :class="form.type == '2' ? 'active' : ''" @click="changeTab('2')">近一月</span>
      <span class="tabs" :class="form.type == '3' ? 'active' : ''" @click="changeTab('3')">近半年</span>
    </div>
    <div class="chart-outer">
      <chart :data="data" :xAxis="xAxis"></chart>
    </div>
  </div>
</template>

<script>
  import {getStatistics} from '@/api/system/index'
  import chart from './chart'
  export default {
    name: 'logStatistics',
    components: {
      chart
    },
    activated() {
     
    },
    watch:{
      
    },
    mounted() {
      this.getList()
    },
    data() {
      return {
        data: [],
        xAxis: [],
        chartData: [],
        todayTotal: 0,
        historyTotal: 0,
        form: {
            apiAuthorizeCode: '1001',
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
          this.xAxis = []
          this.data = []
          for (let i = 29; i >= 0; i--) {
            let time = dateTime - 3600 * 24 * 1000 * i
            let historyDate = this.getDate(time)
            this.xAxis.push(historyDate)
            this.data.push(this.chartData[ 29 - i] ? this.chartData[29 - i].count : 0)
          }
        } else if (this.form.type == '1') {
          this.data = []
          this.xAxis = []
          for (let i = 1; i < 25; i++) {
            this.data.push(this.chartData[i - 1] ? this.chartData[i - 1].count : 0)
            this.xAxis.push(i + '点')
          }
        } else {
          this.data = []
          this.xAxis = []
          for (let i = 5; i >= 0; i--) {
            this.data.push(this.chartData[5 - i] ? this.chartData[5 - i].count : 0)
            let month = new Date().getMonth() + 1
            this.xAxis.push(month - i > 0 ? month - i : month - i + 12  + '月')
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


