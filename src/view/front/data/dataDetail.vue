<template>
  <div>
    <div class="front-detail">
      <div class="front-main">
        <div class="api-detail">
          <div class="api-img">
            <img :src="defaultUrl" v-if="!data.picPath"/>
            <img :src="data.picPath" v-if="data.picPath"/>
            <span class="count">
              <span class="count-detail">
                <img :src="starUrl"/><br/>
                <small> {{data.collectionTimes}}</small>
              </span>
              <span class="border"></span>
              <span class="count-detail">
                <img :src="downloadUrl" style="height: 14px;"/><br/>
                <small>{{data.downloadTimes}}</small>
              </span>
            </span>
          </div>
          <div class="api-info">
            <p class="title">{{data.name}}</p>
            <p class="desc" :title="data.shortDescription">{{data.shortDescription}}</p>
            <p class="price" v-if="data.isFree == '1'">
              <img :src="priceUrl"/>
              <span>{{data.payStandard}}</span>
              水利币/次
            </p>
            <p class="free" v-if="data.isFree != '1'">
              免费
            </p>
            <p>
              <el-button type="primary" @click="bookOrRenew">
                立即下载
              </el-button>
               <el-button  @click="collectData">
                <img :src="starUrl2" v-if="data.isCollection == 0"/>
                <img :src="starUrl3" v-if="data.isCollection == 1"/>
                {{ data.isCollection == 1 ? '取消收藏' : '收藏' }}
              </el-button>
            </p>
          </div>
        </div>  
      </div>
    </div>
    <div class="detail-info">
      <div class="detail" v-if="businessOrNormal == 2">   
        <p class="table-title clear-top">数据示例：</p>
        <img :src="data.examplePicPath" class="example-img"/>

        <p class="table-title" id="dataList">数据列表：</p>
        <el-table :data="data.listAttachmentIdsVO" border  row-class-name="table-center" header-row-class-name="table-center">
          <el-table-column label="数据包名称" prop="attachmentName"></el-table-column>
          <el-table-column label="格式" prop="attachmentPattern"></el-table-column>
          <el-table-column label="大小(kb)" prop="attachmentSize"></el-table-column>
          <el-table-column label="发布时间" prop="attachmentTime"></el-table-column>
          <el-table-column label="操作" prop="" width="120">
            <template slot-scope="scope">
              <a @click="downloadFile(scope.row)" class="download-link">下载</a>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--  基础数据  -->
      <div class="detail" v-if="businessOrNormal == 1">
        <div class="search-table">
          <div class="table-cell">
            <p v-for="(item, index) in searchForm" :key="index" class="data-search-form">
              <span  class="input-con">
                <el-select v-model="item.field" size="mini" @change="changeField(item.field,index)">
                  <el-option v-for="child in columns" :key="child.id" :value="child.word" :label="child.wordExplain"></el-option>
                </el-select>
              </span>
              <span  class="input-con width-150">
                <el-select v-model="item.conditions" size="mini">
                  <el-option v-for="child in conditionArray" :key="child.id" :value="child.value" :label="child.label" :disabled="(typeObj[item.field] == 'DATE' && child.label != '=')"></el-option>
                </el-select>
              </span>
              <span class="input-con width-280">
                <el-input size="mini" v-model="item.value" maxlength="200" v-if="typeObj[item.field] != 'DATE' && typeObj[item.field] != 'SELECT'"></el-input>
                <el-select v-model="item.value" size="mini"  v-if="typeObj[item.field] == 'SELECT'">
                  <el-option v-for="option in typeObj[item.field + '-option']" :key="option.id" :value="option.enumValue" :label="option.enumName"></el-option>
                </el-select>
                <el-date-picker
                  v-model="item.rangeDate"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss" size="mini"
                  v-if="typeObj[item.field] == 'DATE'">
                </el-date-picker>
              </span>
              <span class="btn-con">
                <el-button  size="mini" @click="addData(index)" class="plusBtn"><i class="plusBg"></i></el-button>
                <el-button v-if="searchForm.length > 1" size="mini" @click="deleteData(index)" class="minusBtn"><i class="minusBg"></i></el-button>
              </span>
            </p>
          </div>
          <div class="table-cell2">
            <el-button type="primary"  size="mini" @click="search('search')">查询</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
            <el-button size="mini"  @click="search('download')">下载</el-button>
          </div>
        </div>

        <p class="table-title">数据报表：</p>
        <el-table :data="data.fieldList" border>
          <el-table-column v-for=" (item, index) in tableColumns" :label="item.wordExplain" :key="index" show-overflow-tooltip :width="item.word == 'xuhao' ? 60 : ''">
            <template slot-scope="scope">
              <span>{{scope.row[item.word]}}</span>
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
  import {getBusinessDataDetail, addDataCollection, getDataCategory, getCategoryById, getTableDetail, minusWaterMoney, visitorDetail, beforeBasicDown} from '@/api/front/index'
  import { getBaseDetail, getBizeDetail, getDataList } from '@/api/data/index'
  import { getUserInfoDetail } from '@/api/share/index'
  import {download,download2} from '@/api/common/common'
  import { getToken } from '@/utils/auth';
  import { cancelCollect } from '@/api/market/index'
  export default {
    components: {
    },
    mounted() {
      this.dataId = this.$route.query.id
      this.businessOrNormal = this.$route.query.businessOrNormal
      this.getDetail()

      //禁止复制
      document.addEventListener('copy', function (event) {
          var clipboardData = event.clipboardData || window.clipboardData;
          if (!clipboardData) { return; }
          var text = window.getSelection().toString();
          if (text) {
              event.preventDefault();
              clipboardData.setData('text/plain', '');
          }
      });
    },
    destroyed() {
      //页面销毁，可以复制
      document.addEventListener('copy', function (event) {
          var clipboardData = event.clipboardData || window.clipboardData;
          if (!clipboardData) { return; }
          var text = window.getSelection().toString();
          if (text) {
              event.preventDefault();
              clipboardData.setData('text/plain', text);
          }
      });
    },
    watch: {
      $route() {
        this.dataId = this.$route.query.id
        this.businessOrNormal = this.$route.query.businessOrNormal
        this.getDetail()
      }
    },
    data() {
      return {
        searchWay: false, //是否点击查询
        result: [],
        selectedKeys: [],
        searchForm: [{}],
        dataId: '',
        rangeDate: [], //时间控件时间
        businessOrNormal: '',
        isShowDesc: false,
        showBook: false,
        bookPrice: 0,
        bookCount: 50,
        bookTitle: '',
        data: {
          listAttachmentIdsVO: [],
          fieldList: []
        },
        tempFieldList: [],
        searchFieldList: [],
        tableColumns: [],
        columns: [],
        countArray: [
          {label: '50', value: '50'},
          {label: '100', value: '100'},
          {label: '200', value: '200'},
          {label: '500', value: '500'},
          {label: '1000', value: '1000'},
          {label: '2000', value: '2000'}
        ],
        apiDesc: '',
        tabNum: 1,
        contact: [
          {key: '联系电话', detail: '0791-8835672'}
        ],
        exampleImg: require('@/assets/images/exampleImg.png'),
        logoUrl: require('@/assets/images/logo.png'),
        defaultUrl: require('@/assets/images/default.png'),
        starUrl: require('@/assets/images/star.png'),
        starUrl2: require('@/assets/images/star2.png'),
        starUrl3: require('@/assets/images/star3.png'),
        watchUrl: require('@/assets/images/watch.png'),
        priceUrl: require('@/assets/images/price2.png'),
        downloadUrl: require('@/assets/images/doc_download.png'),
        conditionArray: [
          { value: '=', label: '=' },
          { value: '!=', label: '!=' },
          { value: '&gt;', label: '>' },
          { value: '&gt;=', label: '>=' },
          { value: '&lt;', label: '<' },
          { value: '&lt;=', label: '<=' },
          { value: 'like', label: '包含' }
        ],
        typeObj: {}, //字段-类型对应关系
        page: {
          page: 1,
          size: 10
        },
        total: 0,
        form: {}
      }
    },
    methods: {
      getDetail2() {
        let param = {
          id: this.dataId
        }
        if (this.businessOrNormal == '2') {
          let tag = getToken() ? 'detail' : 'visitor'
          getBusinessDataDetail(tag, param).then(resp => {
            this.data = resp.data
            this.data.downloadTimes = this.data.downloadTimes ? this.data.downloadTimes : 0
            this.data.collectionTimes = this.data.collectionTimes ? this.data.collectionTimes : 0
          })
        } else {
          let tag2 = getToken() ? '' : 'detail/'
          getBaseDetail(tag2, this.dataId).then(resp => {

            //添加序号一列
            resp.data.fieldList.forEach((v, index) => {
              v.xuhao = index + 1
            })

            this.data = resp.data
            this.data.fieldList = JSON.parse(JSON.stringify(this.searchWay ? this.searchFieldList : resp.data.fieldList)) //赋值搜索条件表格

            this.data.downloadTimes = this.data.downloadTimes ? this.data.downloadTimes : 0
            this.data.collectionTimes = this.data.collectionTimes ? this.data.collectionTimes : 0
          })
        }
      },
      getDetail(page) {
        let param = {
          id: this.dataId
        }
        if (this.businessOrNormal == '2') {
          let tag = getToken() ? 'detail' : 'visitor'
          getBusinessDataDetail(tag, param).then(resp => {
            this.data = resp.data
            this.data.downloadTimes = this.data.downloadTimes ? this.data.downloadTimes : 0
            this.data.collectionTimes = this.data.collectionTimes ? this.data.collectionTimes : 0
          })
        } else {
          let tag2 = getToken() ? '' : 'detail/'
          getBaseDetail(tag2, this.dataId, page).then(resp => {

            //添加序号一列
            resp.data.fieldList.forEach((v, index) => {
              v.xuhao = index + 1
            })

            this.total = resp.data.fieldTotal
            this.data = resp.data
            this.data.downloadTimes = this.data.downloadTimes ? this.data.downloadTimes : 0
            this.data.collectionTimes = this.data.collectionTimes ? this.data.collectionTimes : 0
            
            let tableId = this.data.subTableName
            getTableDetail({propertyTable: tableId}).then(res => {
              this.tableColumns = res.data
              let columnsKeys = Object.keys(this.data.fields)

              this.columns = res.data.filter( val => {
                return columnsKeys.indexOf(val.word) > -1
              })

              //添加序号一列
              this.tableColumns.unshift({wordExplain: '序号', word: 'xuhao'})

              //获取字段对应类型
              this.typeObj = {}
              this.columns.filter(ele => {return ele.word !== 'xuhao'}).forEach(v => {
                this.typeObj[v.word] = (v.wordType == 'DATE' || v.wordType.indexOf('TIMESTAMP') > -1) ? 'DATE' : (v.controlType == 'SELECT' ? 'SELECT' : v.wordType)
                if ( v.controlType == 'SELECT') {
                  this.typeObj[v.word + '-option'] = v.enumList //下拉框时的下拉数据
                }
                this.typeObj[v.word + '-desc'] = v.wordExplain
              })
            })
          })
        }
      },
      handleCurrentChange(val) {//分页
        this.page.page = val
        if(this.searchWay) { //点击查询，分页
          let param = Object.assign({},this.form,this.page)
          getDataList(param).then( res => {
            this.total = res.data.total
            //添加序号一列
            res.data.list.forEach((v, index) => {
              v.xuhao = index + 1
            })
            this.data.fieldList = res.data.list
          })
        } else {
          this.getDetail(this.page)
        }
      },
      reset() {// 重置
        this.searchForm = [{}]
        this.searchWay = false
        this.page = {page: 1, size: 10}
        this.getDetail(this.page)
      },
      search(type) {// 根据查询条件查询数据或者下载

        let downloadFlag = false //带查询条件的下载
        let param = this.searchForm.map(v => {
          return {
            conditions: v.conditions,
            field: v.field,
            value: (this.typeObj[v.field] == 'DATE') ? v.rangeDate.join() : v.value,
            fieldName: this.typeObj[v.field + '-desc']
          }
        })
        if (this.checkParam(param) == 'same') {
          this.$message({
            type: 'warning',
            message: '查询字段不能重复'
          })
          return false
        }
        if (this.checkParam(param) == 'empty' && type == 'search') {
          this.$message({
            type: 'warning',
            message: '查询字段不能为空'
          })
          return false
        }
        if (this.checkParam2(param) == 'someEmpty' && type == 'download') {
          this.$message({
            type: 'warning',
            message: '查询字段不能为空'
          })
          return false
        } else {
          downloadFlag = true
        }
        if (this.checkParam(this.searchForm).indexOf('number') > -1) {
          this.$message({
            type: 'warning',
            message: this.checkParam(this.searchForm).slice(6)
          })
          return false
        }
        this.form = {
          id: this.dataId,
          paramList: param
        }
        if (type == 'search') {
          getDataList(Object.assign({}, this.form, {page: 1, size: 10})).then(resp => {
            if (resp.code == 200) {
              this.searchWay = true
              this.total = resp.data.total
              //添加序号一列
              resp.data.list.forEach((v, index) => {
                v.xuhao = index + 1
              })
              this.data.fieldList = resp.data.list
              this.searchFieldList = JSON.parse(JSON.stringify(resp.data.list)) //暂存搜索数据
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        } else if(downloadFlag && Object.keys(this.searchForm[0]).length == 0) { //不带查询条件下载
          this.bookOrRenew()
        } else {
          beforeBasicDown({id: this.dataId}).then( res => {
            if(res.code == 200) {
              const loading = this.$loading({
                lock: true,
                text: '报表生成中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
              });
              download(this.form, 'webapp/data/form_excel', this.data.name + '.xlsx', () => {
                loading.close()
                this.getDetail2()
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        }
      },
      checkParam(data) { //校验查询参数格式
        let idArr = []
        let result = ''
        data.forEach( v => {
          if(this.typeObj[v.field] == 'NUMBER' && isNaN(v.value)  ) {
            result = 'number' + '字段[' + this.typeObj[v.field + '-desc'] +']的值必须为数值类型'
          }
          if (idArr.indexOf(v.field) > -1) {
            result = 'same'
          } else {
            idArr.push(v.field)
          }
          if (!v.field || !v.conditions || !v.value) {
            result = 'empty'
          }
        })
        return result
      },
      checkParam2(data) { //校验下载参数格式
        let result = ''
        data.forEach( v => {
          if (result !== 'someEmpty') {
            if (!v.field && !v.conditions && !v.value) {
              result = 'allEmpty'
            } else if (!v.field || !v.conditions || !v.value) {
              result = 'someEmpty'
            }
          }
        })
        return result
      },
      changeTab(num) {
        this.tabNum = num
      },
      showDesc(row,column) {
        if (column.label == '标题') {
          this.apiDesc = row.exampleCode
          this.isShowDesc = true 
         }
      },
      collectData() {
        let param = {
          dataId: this.dataId,
          businessOrNormal: this.businessOrNormal
        }
        if(this.data.isCollection == 0) {
          addDataCollection(param).then((resp) => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '收藏成功'
              })
              this.getDetail2()
              
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        } else if(this.data.isCollection == 1){
          cancelCollect(param.dataId).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '取消成功'
              })
              this.getDetail2()
             
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        }
      },
      bookOrRenew() {
        if (this.businessOrNormal == '2') {
          let anchor = this.$el.querySelector('#dataList')
          document.body.scrollTop = anchor.offsetTop - 100
          document.documentElement.scrollTop = anchor.offsetTop - 100
        } else {
          // download('/webapp/data/form_excel?id=' + this.dataId, '数据报表', function() {

          // })
          beforeBasicDown({id:this.dataId}).then( res => {
            if(res.code == 200) {
              // window.location.href = '/webapp/data/form_excel?id=' + this.dataId
              // this.getDetail()
              let form = {
                id: this.dataId,
                paramList: []
              }
              const loading = this.$loading({
                lock: true,
                text: '报表生成中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
              });
              download(form, 'webapp/data/form_excel', this.data.name + '.xlsx', () => {
                loading.close()
                this.getDetail2()

              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
          
        }
      },
      cancel() {
        this.showBook = false
      },
      
      changeCount() {
        this.bookPrice = this.data.payStandard * this.bookCount
      },
      downloadFile(row) {
        // if(this.data.payStandard != 0) {
          //扣除水利币
          minusWaterMoney({
            id: this.dataId,
            attachmentId: row.attachmentId
          }).then( res => {
            if(res.code == 200) {
              window.location.href = '/manage/attachment/' + row.attachmentId
              this.getDetail()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        // }
       
      },
      addData(index) {//新增一行筛选条件
        let param = {

        }
        this.searchForm.splice(index + 1, 0, param)
      },
      deleteData(index) {//删除一行筛选条件
        this.searchForm.splice(index, 1)
      },
      changeField(val, index) {
        //判断字段为时间，筛选条件只能选'='
        if (this.typeObj[val] == 'DATE') {
          this.$set(this.searchForm[index], 'conditions', '=')
          this.$set(this.searchForm[index], 'value', '')
          this.$set(this.searchForm[index], 'rangeDate', [])
        } else if(this.typeObj[val] == 'SELECT') {
          this.$set(this.searchForm[index], 'value', '')
        }
      }

    }
  }
</script>

<style lang="less" >
   @import '../front.less';
</style>


