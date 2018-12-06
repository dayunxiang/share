<template>
  <div class="box search-box">
    <el-form label-width="100px" ref='searchForm' :model="form" style="max-width:100%">
      <el-row>
        <el-col :lg="6" :md="8">
          <el-form-item label="所属部门">
            <el-input placeholder="请输入所属部门"  v-model="form.logDataDept" size="mini" style="width: 100%;"></el-input>
           <!--  <el-select v-model="form.logDataDept" placeholder="请选择" size="mini" clearable>
              <el-option v-for="item in titleOptions" :value="item.value" :label="item.label" :key="item.value" ></el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8">
          <el-form-item label="用户名">
            <el-input placeholder="请输入用户名"  v-model="form.logUser" size="mini" style="width: 100%;"></el-input>
          </el-form-item>  
        </el-col>
        <el-col :lg="6" :md="8">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              value-format="yyyy-MM-dd"
              clear>
            </el-date-picker style="width: 100%;">
          </el-form-item>
        </el-col>
        <div class="btn-con">
          <el-button @click="search()" size="small">确定</el-button>
          <el-button @click="reset()" size="small">重置</el-button>
        </div>
      </el-row>
      <p class="desc">查找和搜索</p>
    </el-form>
  </div>
</template>

<script>
  import { getLogTitle } from '@/api/journal'
export default {
	data() {
		return {
      form: {
        logUser: '',
        logDataTitle: '',
        logDataModifyDept: '',
        logDataDept:'',
        time:''
      },
      titleOptions: []
		}
	},
  mounted() {
    getLogTitle().then(res => {
      this.titleOptions = res.data
    })
  },
  methods: {
    reset() {
      this.resetForm()
    },
    search() {
      let form = {
        logDataTitle: this.form.logDataTitle,
        beginTime: this.form.time[0],
        endTime: this.form.time[1],
        logDataDept: this.form.logDataDept,
      }
      this.$emit('changeCardVisible', form);
    },
    resetForm() {
      this.form = {
        logDataTitle: '',
        logDataModifyDept: '',
        logDataDept:'',
        time:''
      }
    }
  }
}
</script>

<style scoped>
</style>
