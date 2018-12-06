<template>
  <div class="pu-toolbar approve">
    <div class="el-row--flex is-justify-end puCommand">
      <div class="btnList">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-form-item label="日志标题">
              <el-select v-model="form.logDataTitle" placeholder="请选择" size="mini">
                <el-option v-for="item in titleOptions" :value="item.value" :label="item.label" :key="item.value" ></el-option>
              </el-select>
              <!-- <el-input v-model="form.logDataTitle" size="mini" placeholder="请输入标题" clear></el-input> -->
            </el-form-item>

            <el-form-item label="所属部门">
              <el-input v-model="form.logDataDept" size="mini" placeholder="请输入部门"></el-input>
            </el-form-item>
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
              </el-date-picker>
            </el-form-item>

            <div class="footer">
              <el-button @click="sDsearch('searchForm')" type="info" plain size="mini">搜索</el-button>
              <el-button @click="reset()" size="small">重置</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
    </div>


  </div>
</template>

<script>
  import { getLogTitle } from '@/api/journal'
  export default {
    props: {
      dataArray: {
        type: Array
      }
    },
    data() {
      return {
        dateLength:0,
        dialogVisibleDele: false,
        form: {
          logDataTitle: '',
          logDataModifyDept: '',
          logDataDept:'',
          time:''
        },
        titleOptions: []
      }
    },
    created() {
      getLogTitle().then(res => {
        this.titleOptions = res.data
        //console.log(this.titleOptions)
      })
    },
    methods: {
      sDsearch(){
        this.$emit('changeSearch',{
          logDataTitle:this.form.logDataTitle,
          logDataModifyDept:this.form.logDataModifyDept,
          logDataDept:this.form.logDataDept,
          beginTime:this.form.time[0],
          endTime:this.form.time[1]
        });
      }
    }
  }
</script>

<style scoped>

</style>


