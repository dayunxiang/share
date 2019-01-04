<template>
  <div class="front-index">
    <div class="front-main">
      <div class="doc-container">
        
        <div class="doc-detail">
          
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
      this.form.basicType = this.$route.query.basicType
      this.getList()
     
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
    
      getList() {
        let param = Object.assign(this.form, this.page)
        getDocList(param).then((resp) => {
          if (resp.code == 200) {
            this.list = resp.data.list
            this.total = resp.data.total
          }
        })
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


