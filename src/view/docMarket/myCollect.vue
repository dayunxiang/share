<template>
  <div>
    <div class="page-title">我的收藏</div>
    <div class="main-container">
      <div class="mar-20">
      <el-row class="searchBar">
        <div>
          <el-row :gutter="15">
            <el-col :span="8" >
              <span class="form-label">名称</span>
              <el-input v-model="form.name" size="mini" class="form-input" placeholder="请输入名称"></el-input>
            </el-col>
            <el-col :span="8" class="height-28" >
              <span class="form-label">收藏时间</span>
              <el-date-picker
                v-model="createTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeCreateTime"
                value-format="yyyy-MM-dd HH:mm:ss" size="mini"
                class="form-input">
              </el-date-picker>
            </el-col>
           
          </el-row>
        </div>
        <div class=" box right-btn-box search-box">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div> 
      </el-row>


      <el-table :data="list"   border >
        <!-- <el-table-column fixed type="selection" width="40"></el-table-column> -->
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="名称" prop="name"  :show-overflow-tooltip="true" class-name="first-column"></el-table-column>
        <el-table-column label="作者" prop="author"  width="140"></el-table-column>  
        <el-table-column label="收藏时间" prop="collectionTime"  width="180"></el-table-column>
        <el-table-column label="收藏量" prop="collectionTimes"  width="180"></el-table-column>

        <el-table-column label="操作"  width="120" >
          <template slot-scope="scope">
              <a  @click="cancel(scope.row)">取消收藏</a>
            </template>
        </el-table-column>

       
      </el-table>
      <div class="footerPage">
        <span></span>
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
  import {getCollect, cancelCollect} from '@/api/doc/index'
  export default {
    name: 'myDocCollect',
    components: {
    },
    props: {

    },
    created() {
    },
    mounted() {
     
      this.getList()
    },
    activated() {
      if (this.$route.params.type == 'init') {
        this.getList()
      }
    },
    watch:{

    },
    data() {
      return {
        total: 0,
        list: [],
       
        createTime: [],
        statusArray:[
          {label: '全部', value: '0'},
          {label: '草稿', value: '1'},
          {label: '上架', value: '2'},
          {label: '下架', value: '3'},
        ],
        form: {
          name: '',
          beginTime:'',
          endTime: ''
        },
        page: {
          page: 1,
          size: 10
        },
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      getList(obj = this.form) {
        let param = Object.assign(this.page, this.form)
        getCollect(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      levelChangeSearch(val) {//搜索
        this.form = val
        this.formBak = val
        this.getList()
      },

      handleCurrentChange(val) {//分页
        this.page.page = val
        this.getList(this.form);
      },
     
      changeCreateTime() {
        if (this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.beginTime = this.createTime[0]
          this.form.endTime = this.createTime[1]
        } else {
          this.form.beginTime = ''
          this.form.endTime = ''
        }
      },
      resetIndex(row, column, cellValue, index) {
        return index + 1 + (this.page.page - 1) * this.page.size
      },
     
      search() {
        this.page.page = 1
        this.getList()
      },
      reset() {
        this.form = {
          name: '',
          beginTime: '',
          endTime: '',
          status: '0'
        }
        this.createTime = ''
      },
      changeStatus(row, status, message,info) {
        this.$confirm(info, '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            id: row.id
          }
          operateBase(status, param.id).then((resp) => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: message
              })
              this.getList()
            }
          })
        }).catch( error => {
          console.log(error)
        })
      },
      cancel(data) {
        this.$confirm('确认取消收藏', '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            id: data.id
          }
          cancelCollect(param.id).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '取消成功'
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        })
       
      }
    }
  }
</script>

<style lang="less">
  @import '../../assets/scss/self.less';
   .right-btn-box{
    width: 145px;
    text-align: right;
  }
  .left-btn-box{
    margin-bottom: 20px;
  }
</style>


