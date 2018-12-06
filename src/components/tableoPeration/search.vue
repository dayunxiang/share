<template>
  <div>
    <el-form label-width="110px" ref='searc大hForm' v-model="searchForm">
      <el-form-item label="问题大类">
       <el-select v-model="searchForm.quescate" placeholder="请选择问题大类" size="small">
         <el-option v-for="item in quesOptions" :value="item" :label="item" :key="item"></el-option>
       </el-select>
     </el-form-item>
       <el-form-item label="问题类型">
       <el-select v-model="searchForm.name" placeholder="请选择问题类型" size="small">
         <el-option v-for="item in nameOptions" :value="item" :label="item" :key="item"></el-option>
       </el-select>
     </el-form-item>
     <!--  <el-form-item label="整改类型">
       <el-select v-model="searchForm.cate" placeholder="请选择整改类型" size="small">
         <el-option v-for="item in cateOptions" :value="item" :label="item" :key="item"></el-option>
       </el-select>
     </el-form-item> -->
      <el-form-item label="责任单位">
       <el-select v-model="searchForm.issue" placeholder="请选择责任单位" size="small">
         <el-option v-for="item in unitOptions" :value="item" :label="item" :key="item"></el-option>
       </el-select>
     </el-form-item>
     <el-form-item label="业务部门">
       <el-select v-model="searchForm.duty" placeholder="请选择业务部门" size="small">
         <el-option v-for="item in departOptions" :value="item" :label="item" :key="item"></el-option>
       </el-select>
     </el-form-item>
     <el-form-item label="分管领导">
       <el-select v-model="searchForm.leader" placeholder="请选择分管领导" size="small">
        <el-option v-for="item in leaderOptions" :value="item" :label="item" :key="item"></el-option>
       </el-select>
     </el-form-item>
     <el-form-item label="问题时间">
       <el-date-picker
         size="small"
         v-model="searchForm.date1"
         type="month"
         placeholder="请选择">
       </el-date-picker>
     </el-form-item>
     <el-form-item label="是否下发">
       <el-select v-model="searchForm.edit" placeholder="请选择" size="small">
        <el-option v-for="item in stateOptions" :value="item" :label="item" :key="item"></el-option>
       </el-select>
     </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="reset()" size="small">重置</el-button>
      <!-- <el-button @click="cancel('searchForm')" size="small">取消</el-button> -->
      <el-button @click="search()" type="primary" size="small">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        quescate:'',
        name:'',
        issue: '',
        duty: '',
        leader: '',
        date1: '2018-08',
        edit: ''
        //date2: '2018'
      },
      quesOptions: ['年度', '专项'],
      //cateOptions: ['年报', '专项报', '季度报'],
      nameOptions: ['遵守中央“八项规定”精神', '工程管理'],
      unitOptions: ['江西省水投生态资源开发集团有限公司', '江西省水务集团有限公司'],
      departOptions: ['人力资源部', '财务部'],
      leaderOptions: ['分管领导1', '分管领导2'],
      stateOptions: ['已下发', '未下发', '已退回'],
    }
  },
  methods: {
    reset() {
      this.resetForm()
    },
   /* cancel() {
      this.$emit('changeCardVisible')
    },*/
    search() {
      this.$emit('changeCardVisible')
    },
    resetForm() {
      this.searchForm = {
        quescate:'',
        name:'',
        issue: '',
        duty: '',
        leader: '',
        date1: '2018-08',
        edit: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
