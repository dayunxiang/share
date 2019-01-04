<template>
  <div class="front-index">
    <div class="front-main">
      <div class="doc-container">
        <div class="doc-type">
          <ul>
            <li v-for="(item, index) in apiTypeArray" :key="index" :class="{active: item.actived}" @click="changeTab(index)" :title="item.name">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="doc-detail">
          <el-row  :gutter="15" class="search-bar">
            <el-col :span="9">
              <span class="form-label">标题</span>
              <el-input v-model="form.name" size="mini" class="form-input" placeholder="请输入标题" maxlength="50"></el-input>
            </el-col>
            <el-col :span="9">
              <span class="form-label">时间</span>
              <el-date-picker
                v-model="createTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeTime"
                value-format="yyyy-MM-dd HH:mm:ss" size="mini"
                class="form-input">
              </el-date-picker>
            </el-col>
            <el-col :span="6" class="text-right">
              <el-button size="mini" type="primary" @click="getList">文档搜索</el-button>
            </el-col>
          </el-row>

          <el-table :data="list" border @cell-click="docDetail" @header-click="doSort">
            <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
            <el-table-column label="标题" prop="name" class-name="text-left doc-name" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <img :src="wordUrl" class="doc-img" v-if="scope.row.docType == 'doc' || scope.row.docType == 'docx'"/>
                <img :src="pptdUrl" class="doc-img" v-else-if="scope.row.docType == 'ppt'"/>
                <img :src="pdfUrl" class="doc-img" v-else-if="scope.row.docType == 'pdf'"/>
                <img :src="txtUrl" class="doc-img" v-else-if="scope.row.docType == 'txt'"/>
                <img :src="excelUrl" class="doc-img" v-else-if="scope.row.docType == 'xlsx' || scope.row.docType == 'xls'"/>
                <img :src="elseUrl" class="doc-img" v-else/>
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="docType" width="70"></el-table-column>
            <el-table-column label="作者" prop="author" width="100"></el-table-column>
            <el-table-column label="时间" prop="createTime" width="180" :class-name="timeClick ? 'sort-positive1' : 'sort-reverse1'"></el-table-column>
            <el-table-column label="下载量" prop="downloadTimes" width="100" :class-name="timesClick ? 'sort-positive2' : 'sort-reverse2'"></el-table-column>
          </el-table>
        </div>
      </div>

       <div class="footerPage mb40">
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
</template>

<script>
  import {getDocList} from '@/api/front/index'
  import {getDictDetailList} from '@/api/dict/index'
  import {getApiTypeArray} from '@/api/api/index'
  export default {
    components: {
    },
    mounted() {
      if (this.$store.state.app.searchDocName) {
        this.form.name = this.$store.state.app.searchDocName
        this.$store.state.app.searchDocName = ''
      }
      this.getList()
     // this.getType()
      this.getApiType()
    },
    computed: {
      searchName() {
        return this.$store.state.app.searchDocName
      }
    },
    watch: {
      searchName(val) {
        if (val) {
          this.form.name = val
          this.getList()
          this.$store.state.app.searchDocName = ''
        }
      }
    },
    data() {
      return {
        wordUrl: require('@/assets/images/doc_word.png'),
        pdfUrl: require('@/assets/images/doc_pdf.png'),
        pptUrl: require('@/assets/images/doc_ppt.png'),
        txtUrl: require('@/assets/images/doc_txt.png'),
        excelUrl: require('@/assets/images/doc_excel.png'),
        elseUrl: require('@/assets/images/doc_else.png'),
        searchUrl: require('@/assets/images/api-search.png'),
        defaultUrl: require('@/assets/images/default.png'),
        form: {
          type: '',
          name: '',
          beginTime: '',
          endTime: '',
          order: ''
        },
        page: {
          page: 1,
          size: 10
        },
        total: 0,
        createTime: [],
        list: [],
        apiTypeArray: [
           {name: '全部', codeExt: '', actived: true}
        ],
        timeClick: false,
        timesClick: false
       
      }
    },
    methods: {
      getApiType() {
        getApiTypeArray({type: '2', isChild: '0'}).then(resp => {
          this.apiTypeArray = this.apiTypeArray.concat(resp.data)
        })
      },
      getType() {
        getDictDetailList({
          dicCode: '10000001',
          page: 1,
          size: 999
        }).then(resp => {
          this.apiTypeArray = this.apiTypeArray.concat(resp.data.list)
        })
      },
      getList() {
        let param = Object.assign(this.form, this.page)
        getDocList(param).then((resp) => {
          if (resp.code == 200) {
            this.list = resp.data.list
            this.total = resp.data.total
          }
        })
      },
      search() {
        this.getList()
      },
      changeTab(index) {
        let oldIndex = -1
        this.apiTypeArray.forEach((v, i) => {
          if (v.actived) {
            oldIndex = i
          } 
        })
        this.$set(this.apiTypeArray[oldIndex], 'actived', false)
        this.$set(this.apiTypeArray[index], 'actived', true)
        this.form.type = this.apiTypeArray[index].codeExt
        this.getList()
      },
      changeTime() {
        if(this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.beginTime = this.createTime[0]
          this.form.endTime = this.createTime[1]
        } else {
          this.form.beginTime = ''
          this.form.endTime = ''
        }
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
 

      docDetail(row, column, cell, event) {
        if (column.label == '标题') {
          this.$router.push({
            name: 'docDetail',
            query: {
              id: row.id
            }
          })
        }
      },
      doSort(column, event) {
        if(column.property == 'createTime') {
          this.timeClick = !this.timeClick
          this.form.order = this.timeClick ? 1 : 0
          this.getList()
        } else if(column.property == 'downloadTimes') {
          this.timesClick = !this.timesClick
          this.form.order = this.timesClick ? 3 : 2
          this.getList()
        }
      }
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


