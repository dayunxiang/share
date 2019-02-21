<template>
  <div class="front-index">
    <div class="front-main">
      <div class="basic-outer basic-disable">
        <el-form ref="form" label-position="left" label-width="100px">
          
            <el-form-item label="数据类型：" prop="categoryId" class="is-required">
              <el-select  v-model="form.categoryId" size="mini" class="width-300" disabled>
                <el-option v-for="item in bigCatesArr" :label="item.tableNote" :value="item.type" :key="item.id"></el-option>
              </el-select>
              <el-select  v-model="form.propertyTableId" size="mini" class="width-300" disabled>
                <el-option v-for="item in propertyTableArr" :label="item.propertyTableName" :value="item.tableName" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
         
            <el-form-item label="字段：" prop="checkedFileds" class="is-required">
              <div class="field-color" v-if="form.propertyTableId">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" disabled>全选</el-checkbox>
                <el-checkbox-group v-model="form.checkedFileds" disabled>
                  <div v-for="(field, index) in fieldsArr" :key="field.id" class="mr-30 line-block">
                    <el-checkbox :label="field" :checked="field.checked">{{field.wordExplain}}</el-checkbox>
                   
                  </div>
                </el-checkbox-group>
              </div>
            </el-form-item>
            
            <div>
              <el-form-item label="筛选字段：" v-if="searchForm.length > 0">
                <div class="search-table2">
                  <div class="table-cell">
                    <p v-for="(item, index) in searchForm" :key="index" class="serach-con-form">
                      <span  class="input-con">
                <el-select v-model="item.field" size="mini" disabled>
                  <el-option v-for="child in form.checkedFileds" :key="child.id" :value="child.word" :label="child.wordExplain"></el-option>
                </el-select>
              </span>
                      <span  class="input-con width-150">
                <el-select v-model="item.conditions" size="mini" disabled>
                  <el-option v-for="child in conditionArray" :key="child.id" :value="child.value" :label="child.label" :disabled="(typeObj[item.field] == 'DATE' && child.label != '=')"></el-option>
                </el-select>
              </span>
                      <span class="input-con width-250">
                <el-input size="mini" v-model="item.value" maxlength="200" v-if="typeObj[item.field] != 'DATE' && typeObj[item.field] != 'SELECT'" disabled></el-input>
                <el-select v-model="item.value" size="mini"  v-if="typeObj[item.field] == 'SELECT'" disabled>
                  <el-option v-for="option in typeObj[item.field + '-option']" :key="option.id" :value="option.enumValue" :label="option.enumName"></el-option>
                </el-select>
                <el-date-picker
                  v-model="item.rangeDate"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss" size="mini"
                  v-if="typeObj[item.field] == 'DATE'" disabled>
                </el-date-picker>
              </span>
                    </p>
                   
                  </div>
                </div>
              </el-form-item>
            </div>
        </el-form>
      </div>
      <div class="btn-outer"></div>
      <div class="basic-outer">
        <el-button class="download-btn" size="small" @click="downloadFile" type="primary">下载数据</el-button>
        
        <el-table :data="result" border>
          <el-table-column v-for=" (item, index) in selectedKeys" :label="item.wordExplain" :key="index" show-overflow-tooltip>
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
      <div class="btn-outer"></div>
    </div>
  </div>
</template>

<script>
  import { getUserInfoDetail } from '@/api/share/index'
  import { getBigCates, getSonCates, getFields, getTable, getBaseDetail } from '@/api/data/index'
  import { getToken } from '@/utils/auth'
  import {download} from '@/api/common/common'
  import { beforeBasicDown } from '@/api/front/index'
  export default {
    components: {

    },
    mounted() {
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

    	this.id = this.$route.query.id
      this.getDetail()
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
        this.id = this.$route.query.id
        this.getDetail()
      }
    },
    data() {
      return {
        fileName: '',
      fieldParams: [],
      columns: [],
      searchForm: [],
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
        bigCatesArr: [],
        propertyTableArr: [],
        fieldsArr:[],
        isIndeterminate: false,
        checkAll: false,
        result: [],
        selectedKeys: [],
        id: '',
        form: {
          categoryId: '',
          propertyTableId: '',
          checkedFileds: []
        },
        page: {
          page: 1,
          size: 10
        },
        total: 0,
        defaultUrl: require('@/assets/images/default.png'),
        balanceUrl: require('@/assets/images/balance.png')
      }
    },
    methods: {
    	 getDetail() {
    	 	getBigCates().then(res => {
          this.bigCatesArr = res.data
        })

        let tag2 = getToken() ? '' : 'detail/'
        getBaseDetail(tag2, this.id).then(res => {

          let param = res.data
          this.fileName = param.name
          this.form = Object.assign({},param.fields)
         
          this.form.categoryId = param.mainType
          this.form.propertyTableId = param.subTableName
          getSonCates(param.mainType).then( res => {
            this.propertyTableArr = res.data
           
           
            getFields(param.subTableName).then( res => {
              this.fieldsArr = res.data

              //获取字段对应类型
              this.fieldsArr.forEach(v => {
                this.typeObj[v.word] = (v.wordType == 'DATE' || v.wordType.indexOf('TIMESTAMP') > -1) ? 'DATE' : (v.controlType == 'SELECT' ? 'SELECT' : v.wordType)
                if (v.controlType == 'SELECT') {
                  this.typeObj[v.word + '-option'] = v.enumList //下拉框时的下拉数据
                }
                this.typeObj[v.word + '-desc'] = v.wordExplain
              })
              
              for( let key in param.fields) {
                this.fieldsArr.forEach( v => {
                  if(v.word == key) {
                    v.checked = true
                    let json = {}
                    json.word = v.word
                    json.wordExplain = v.wordExplain
                    this.selectedKeys.push(json)
                  }
                })
              }

              //全选
            if (this.fieldsArr.length == this.selectedKeys.length) {
              this.checkAll = true
              this.isIndeterminate = false
            } else if(this.selectedKeys.length == 0){
              this.checkAll = false
              this.isIndeterminate = false
            } else {
              this.checkAll = false
              this.isIndeterminate = true
            }

              //this.$nextTick(() => {
                this.form.checkedFileds = JSON.parse(JSON.stringify(this.selectedKeys))
              //}, 1)
              
              //初始化搜索条件
              for(let key in param.fields) {
                param.fields[key][0] = JSON.parse(param.fields[key][0])
               
                if(param.fields[key][0].conditions) {
                  this.searchForm.push({
                    field: key,
                    conditions: param.fields[key][0].conditions,
                    rangeDate: (this.typeObj[key] == 'DATE') ? param.fields[key][0].value.split(',') : [],
                    value: param.fields[key][0].value
                  })
                }
              }
              if(this.searchForm.length == 0) {
                this.searchForm = [{}]
              }
            })
          })
         
          this.result = param.fieldList
          this.total = this.result.length
        })
      },
      handleCheckAllChange(val) {
        this.form.checkedFileds = val ? this.fieldsArr : []
        this.isIndeterminate = false
      },
      handleCurrentChange(page) {//分页
        this.page.page = page
      },
      downloadFile() {
        let form = {
          id: this.id,
          paramList: []
        }
        beforeBasicDown({id: this.id}).then( res => {
            if(res.code == 200) {
              const loading = this.$loading({
                lock: true,
                text: '报表生成中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
              });
              download(form, 'webapp/data/form_excel', this.fileName + '.xlsx', () => {
                loading.close()
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })

        // getUserInfoDetail().then( res => {
        //   if(res.code == 200) {
        //     let param = this.searchForm.map(v => {
        //       return {
        //         conditions: v.conditions,
        //         field: v.field,
        //         value: (this.typeObj[v.field] == 'DATE') ? v.rangeDate.join() : v.value,
        //         fieldName: this.typeObj[v.field + '-desc']
        //       }
        //     })
        //     let form = {
        //       id: this.dataId,
        //       paramList: param
        //     }
        //     // download(form, 'webapp/data/form_excel', this.data.name + '.xlsx', () => {
        //     //     loading.close()
        //     //   })
        //     window.location.href = '/webapp/data/form_excel?id=' + this.id
        //   }
        // })
      }
    }
  }
</script>



<style lang="less" >
   @import '../front.less';
   @import '../../../assets/scss/self.less';
  .el-pagination {
    margin: 10px auto;
  }
  .el-dialog__header {
    padding: 10px 20px;
    background: #f3f3f3;
  }
  .basic-outer .download-btn {
    margin-bottom: 20px;
  }
  .basic-disable .el-input.is-disabled .el-input__inner {
    color: #333;
  }
  .basic-disable .el-checkbox__input.is-disabled+span.el-checkbox__label {
    color: #333;
    font-weight: normal;
  }
  .basic-disable .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    border-color: #009dec;
    background-color: #009dec;
  }
  .basic-disable .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
    border-color: #009dec;
    background-color: #009dec;
  }
  .basic-disable .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner::before {
    border-color: #fff;
    background-color: #fff;
  }
  .basic-disable .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
  .basic-disable .el-range-editor.is-disabled input {
    color: #333;
  }
</style>




