<template>
  <div class="front-index">
    <div class="front-main">
      <div class="basic-outer">
        <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
          <el-form-item label="账户：" class="line-30 pl10">
            <div class="user-info">
              <div class="api-count">
                <div class="api-price">
                  <span class="title">每次下载水利币</span><br />
                  <img :src="priceUrl" />
                  <span class="price">{{userPrice}}</span>/次
                </div>
                <div class="user-count">
                  <span class="title">当前账户水利币</span><br />
                  <img :src="priceUrl" />
                  <span class="price">{{userCount}}</span>
                </div>
              </div>
              <div class="renew">
                <img :src="balanceUrl" />
                <el-button type="primary" class="account-btn" @click="apply">充值申请</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="数据类型：" prop="categoryId" class="is-required">
            <el-select v-model="form.categoryId" size="mini" @change="changeCategory" class="width-300" filterable>
              <el-option v-for="item in bigCatesArr" :label="item.tableNote" :value="item.type" :key="item.id"></el-option>
            </el-select>
            <el-select v-model="form.propertyTableId" size="mini" @change="changePropertyTable" class="width-300" filterable>
              <el-option v-for="item in propertyTableArr" :label="item.propertyTableName" :value="item.tableName" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段：" prop="checkedFileds" class="is-required">
            <div class="field-color">
              <div v-if="form.propertyTableId">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="form.checkedFileds" @change="handleCheckedChange">
                  <div v-for="field in fieldsArr" :key="field.id" class="mr-30 line-block">
                    <el-checkbox :label="field">{{field.wordExplain}}</el-checkbox>
                    <!-- <div class="bigCircle" @click="defineField(field)"><div class="smallCircle"></div></div> -->
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
          <div>
            <el-form-item label="筛选字段：">
              <div class="search-table2">
                <div class="table-cell">
                  <p v-for="(item, index) in searchForm" :key="index" class="serach-con-form">
                    <span  class="input-con">
                <el-select v-model="item.field" size="mini" @change="changeField(item.field,index)">
                  <el-option v-for="child in form.checkedFileds" :key="child.id" :value="child.word" :label="child.wordExplain"></el-option>
                </el-select>
              </span>
                    <span  class="input-con width-150">
                <el-select v-model="item.conditions" size="mini">
                  <el-option v-for="child in conditionArray" :key="child.id" :value="child.value" :label="child.label" :disabled="(typeObj[item.field] == 'DATE' && child.label != '=')"></el-option>
                </el-select>
              </span>
                    <span class="input-con width-250">
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
                  <div class="table-cell2">
                    <el-button size="mini" @click="reset">重置</el-button>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="btn-outer">
        <el-button type="primary" @click="createTable()">生成报表</el-button>
      </div>
      <div class="basic-outer" v-if="firstCreate">
        <el-button class="download-btn" size="small" @click="downloadData" type="primary">下载数据</el-button>
        <el-table :data="result" border>
          <el-table-column v-for=" (item, index) in selectedKeys" :label="item.wordExplain" :key="index">
            <template slot-scope="scope">
              <span>{{scope.row[item.word]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="footerPage">
          <span></span>
          <div class="rightPage">
            <el-pagination background @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="btn-outer"></div>
    </div>
    <el-dialog title="充值申请" :visible="showApply" v-if="showApply" :append-to-body="true" @close="cancel" width="390px">
      <div>
        <label><span class="red">* </span>申请金额：</label>
        <div class="form-input el-input el-input--mini">
          <input type="text" v-model="applyCount" class="el-input__inner" maxlength="9" @input="checkPay(applyCount)" />
        </div>
        <p style="margin-bottom: 20px;"></p>
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="ensure" size="small">提交</el-button>
        <el-button  @click="cancel" size="small">返回</el-button>
      </span>
    </el-dialog>
   
    <el-dialog title="数据名称" width="500px" :visible="markVisible" :append-to-body="true" @close="cancel">
      <el-form label-width="100px" @submit.native.prevent :rules="markRule" :model="markForm">
        <el-form-item label="数据名称：" prop="markContent">
          <el-input size="small" v-model="markForm.markContent" placeholder="请输入您的数据名称" max-length="50"></el-input>
        </el-form-item>
        <div class="rightPage">
          <el-button type="primary" size="mini" @click="addDataName">确定</el-button>
          <el-button size="mini" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getUserInfoDetail, moneyApply } from '@/api/share/index'
import { getBigCates, getSonCates, getFields, getTable } from '@/api/data/index'
import { download } from '@/api/common/common'
import { getDataMoney } from '@/api/system/common/index'
import { beforeOwnBasicDown, mapDataTo } from '@/api/front/index'
export default {
  components: {},
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
      
    this.getUserInfo()
    this.getDetail()
    this.getCate()


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

  },
  data() {
    return {

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
      myField: '',
      markVisible: false,
      firstCreate: false,
      defineDialogVisible: false,
      fileNameDialogVisible: false,
      content: '',
      contentKey: '',
      bigCatesArr: [],
      propertyTableArr: [],
      fieldsArr: [],
      isIndeterminate: false,
      checkAll: false,
      result: [],
      selectedKeys: [],
      form2: {
        name: ''
      },
      form: {
        categoryId: '',
        propertyTableId: '',
        checkedFileds: []
      },
      rules: {
        checkedFileds: [
          { validator: this.checkField, key: 'checkedFileds', message: '请选择字段', trigger: 'change' }
        ]
      },
      markForm: {
        markContent: ''
      },
      markRule: {
        markContent: [{ validator: this.validatePass }]
      },
      page: {
        page: 1,
        size: 10
      },
      total: 0,
      //apiDetail: {},
      //isShowDetail: false,
      showApply: false,
      showApiName: false,
      switchFlag: false,
      apiName: '',
      applyCount: '',
      userCount: '',
      userPrice: 0.00,
      defaultUrl: require('@/assets/images/default.png'),
      priceUrl: require('@/assets/images/price2.png'),
      balanceUrl: require('@/assets/images/balance.png'),
    }
  },
  methods: {
    getCate() {

      getBigCates().then(res => {
        this.bigCatesArr = res.data
      })
    },
    getDetail() {
      this.selectedKeys = []
      let form = {
        basicType: this.$route.params.basicType,
        name: this.$route.params.name,
        code: this.$route.params.code,
      }
      mapDataTo(form).then(res => {
        let param = res.data
        this.form.categoryId = param.mainType
        this.form.propertyTableId = param.subTableName

        getSonCates(this.form.categoryId).then(res => {
          this.propertyTableArr = res.data
          this.fieldsArr = []
          //this.form.propertyTableId = this.propertyTableArr[0].tableName
          getFields(this.form.propertyTableId).then(res => {
            this.fieldsArr = res.data
            //获取字段对应类型
            this.fieldsArr.forEach(v => {
              this.typeObj[v.word] = (v.wordType == 'DATE' || v.wordType.indexOf('TIMESTAMP') > -1) ? 'DATE' : (v.controlType == 'SELECT' ? 'SELECT' : v.wordType)
              if (v.controlType == 'SELECT') {
                this.typeObj[v.word + '-option'] = v.enumList //下拉框时的下拉数据
              }
              this.typeObj[v.word + '-desc'] = v.wordExplain
            })
             //勾选字段
            for (let key in param.fields) {

              this.fieldsArr.forEach(v => {
                if (v.word == key) {
                  v.checked = true
                  let json = {}
                  json.word = v.word
                  json.wordExplain = v.wordExplain
                  this.selectedKeys.push(json)
                  this.form.checkedFileds.push(v)
                }
              })
            }
             
            this.createTable()

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

          })
        })

        this.$nextTick(() => {
          //初始化搜索条件
          for (let key in param.fields) {
            param.fields[key][0] = param.fields[key][0].replace(/(conditions\"=)/g, 'conditions\":').replace(/(value\"=)/g, 'value\":')
            param.fields[key][0] = JSON.parse(param.fields[key][0])

            if (param.fields[key][0].value) { //判断有无搜索条件
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
    },
    checkPay(value) {
      value += ''
      //收费标准
      if (/[^\d^\.]+/g.test(value)) {

        this.applyCount = value.replace(/[^\d^\.]+/g, '')


      } else if (value.indexOf('.') > -1 && value.charAt(0) !== '.') {
        //有小数点
        this.applyCount = value.slice(0, value.indexOf('.') + 3)

      } else if (value.indexOf('.') < 0) {
        //没有小数点
        this.applyCount = value.slice(0, 6)

      } else if (value.charAt(0) == '.') {
        //没有整数，有小数点
        this.applyCount = '0' + value

      } else {
        //callback()
      }
    },
    checkField(rule, value, callback) {
      if (this.form[rule.key].length == 0 && !this.switchFlag) {
        callback(new Error(rule.message))
      } else {
        this.switchFlag = false
        callback()
      }
    },
    checkMupltiBox(rule, value, callback) {
      if (this[rule.key].length == 0) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    changeCategory() {
      this.switchFlag = true
      getSonCates(this.form.categoryId).then(res => {
        this.propertyTableArr = res.data

        if (this.propertyTableArr.length > 0) {
          this.form.propertyTableId = this.propertyTableArr[0].tableName
          this.changePropertyTable()

        } else {
          this.form.propertyTableId = ''
        }

      })
    },
    reset() { // 重置
      this.searchForm = [{}]
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
    addData(index) { //新增一行筛选条件
      let param = {

      }
      this.searchForm.splice(index + 1, 0, param)
    },
    deleteData(index) { //删除一行筛选条件
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
    },
    changePropertyTable() {
      let _this = this
      this.checkAll = false
      this.isIndeterminate = false
      setTimeout(() => {
        _this.switchFlag = true
        getFields(_this.form.propertyTableId).then(res => {
          let id = _this.form.categoryId
          let pid = _this.form.propertyTableId
          _this.form = {
            categoryId: id,
            propertyTableId: pid,
            checkedFileds: []
          }
          _this.fieldsArr = res.data
          _this.searchForm = [{}] //清空查询条件
          //获取字段对应类型
          _this.fieldsArr.forEach(v => {
            _this.typeObj[v.word] = (v.wordType == 'DATE' || v.wordType.indexOf('TIMESTAMP') > -1) ? 'DATE' : (v.controlType == 'SELECT' ? 'SELECT' : v.wordType)
            if (v.controlType == 'SELECT') {
              _this.typeObj[v.word + '-option'] = v.enumList //下拉框时的下拉数据
            }
            _this.typeObj[v.word + '-desc'] = v.wordExplain
          })
        })
      }, 100)
      // this.switchFlag = true

    },

    handleCheckAllChange(val) {
      this.form.checkedFileds = val ? this.fieldsArr : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.fieldsArr.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fieldsArr.length;
    },
    handleCurrentChange(tag) { //分页
      this.page.page = tag
      this.createTable(tag)
    },
    getUserInfo() {
      getUserInfoDetail().then(resp => {
        this.userCount = resp.data
      })
      getDataMoney().then(res => {
        this.userPrice = Number(res.data.list[0].payStandard).toFixed(2)
      })
    },
    apply() {
      this.showApply = true;
    },
    cancel() {
      this.showApply = false
      this.showApiName = false
      this.defineDialogVisible = false
      this.fileNameDialogVisible = false
      this.markVisible = false
    },
    ensure() {
      let param = {
        money: this.applyCount
      }
      moneyApply(param).then((resp) => {
        if (resp.code == 200) {
          this.$message({
            type: 'success',
            message: '充值申请提交成功，待管理员审批，审批后会立即到账'
          })
          this.applyCount = ''
          this.showApply = false
        } else {
          this.$message({
            type: 'success',
            message: resp.message
          })
        }
      })
    },
    
    createTable(tag) {

      if (this.form.checkedFileds.length > 0) { //判断是否选择字段
        
        let json = {}


        let flag = Object.keys(this.searchForm[0]).length > 0 //判断是否有搜索条件

        if(flag) {
          this.searchForm.forEach( ve => {
            ve.value = (this.typeObj[ve.field] == 'DATE') ? ve.rangeDate.join() : ve.value
          })

          if (this.checkParam(this.searchForm) == 'same') {
            this.$message({
              type: 'warning',
              message: '筛选字段不能重复'
            })
            return false
          }
          if (this.checkParam(this.searchForm) == 'empty') {
            this.$message({
              type: 'warning',
              message: '筛选字段不能为空'
            })
            return false
          }

          if (this.checkParam(this.searchForm).indexOf('number') > -1) {
            this.$message({
              type: 'warning',
              message: this.checkParam(this.searchForm).slice(6)
            })
            return false
          }
        }
          
          
          //置空保存提交参数
          this.fieldParams = []

          let arr = [].concat(this.form.checkedFileds)
          arr.forEach( (v, i) => {
            this.searchForm.forEach( ele => {
              if(ele.field == v.word) {
                arr[i] = ele
              }
            })
          })

          arr.map( ele => {
            if(ele.field) {
              json[ele.field] = [{ conditions: ele.conditions, value: ele.value }]

              //赋值保存提交参数
              this.fieldParams.push({
                conditions: ele.conditions,
                field: ele.field,
                value: ele.value,
                fieldName: this.typeObj[ele.field + '-desc']
              })

            } else {
              json[ele.word] = [{ conditions: '', value: '' }]
              //赋值保存提交参数
                this.fieldParams.push({
                  conditions: '',
                  field: ele.word,
                  value: '',
                  fieldName: ele.wordExplain
                })
            }
          })


        json.tableName = this.form.propertyTableId

      
        this.page.page = tag ? tag : 1
        let param = Object.assign({}, json, this.page)
        getTable(param).then(res => {
          if(res.code == 200) {
            
            this.firstCreate = true //首次生成报表
            this.selectedKeys = this.form.checkedFileds //报表表头
            this.result = res.data.result
            this.total = res.data.total
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择字段',
          duration: 1300
        })
      }
    },
    getParams3() {
      let param2 = []
      let json2 = {}
      json2.mainType = this.form.categoryId
      json2.subTableName = this.form.propertyTableId

      json2.fieldsList = this.fieldParams
      json2.mainType = this.form.categoryId
      json2.price = this.userPrice
      json2.name = this.markForm.markContent.length > 0 ? this.markForm.markContent : '基础数据个人定制'

      return json2
    },
    downloadData() {
      this.markForm.markContent = ''
      this.markVisible = true
    },
    addDataName() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      beforeOwnBasicDown(this.getParams3()).then(res => {
        if (res.code == 200) {
          this.markVisible = false
          let name2 = this.markForm.markContent.length > 0 ? this.markForm.markContent : '基础数据个人定制'
          download(this.getParams3(), '/webapp/data/tailor_made_form', name2 + '.xlsx', function() {
            loading.close()
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  }
}

</script>
<style lang="less">
@import '../front.less';
@import '../../../assets/scss/self.less';

.el-pagination {
  margin: 10px auto;
}

.el-dialog__header {
  padding: 10px 20px;
  background: #f3f3f3;
}

.serach-con-form {
  margin-bottom: 20px;
}

</style>
