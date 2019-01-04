<template>
  <div class="front-index">
    <div class="front-main">
      <div class="basic-outer">
        <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
          <el-form-item label="账户：" class="line-30 pl10">
            <div class="user-info">
              <div class="api-count">
                <div class="api-price">
                  <span class="title">每次下载水利币</span><br/>
                  <img :src="priceUrl" />
                  <span class="price">{{userPrice}}</span>/次
                </div>
                <div class="user-count">
                  <span class="title">当前账户水利币</span><br/>
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
          <!-- <div class="flex-box"> -->
            <!-- <span class="red">*</span> -->
            <el-form-item label="数据类型：" prop="categoryId" class="is-required">
              <el-select  v-model="form.categoryId" size="mini" @change="changeCategory" class="width-300" filterable>
                <el-option v-for="item in bigCatesArr" :label="item.tableNote" :value="item.type" :key="item.id"></el-option>
              </el-select>
              <el-select  v-model="form.propertyTableId" size="mini" @change="changePropertyTable" class="width-300" filterable>
                <el-option v-for="item in propertyTableArr" :label="item.propertyTableName" :value="item.tableName" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          <!-- </div> -->
          <!-- <div class="flex-box"> -->
            <!-- <span class="red red-pos">*</span> -->
            <el-form-item label="字段：" prop="checkedFileds" class="is-required">

              <div class="field-color">
                <div v-if="form.propertyTableId">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox>
                <el-checkbox-group v-model="form.checkedFileds" @change="handleCheckedChange">
                  <div v-for="field in fieldsArr" :key="field.id" class="mr-30 line-block">
                    <el-checkbox   :label="field">{{field.wordExplain}}</el-checkbox>
                    <div class="bigCircle" @click="defineField(field)"><div class="smallCircle"></div></div>
                  </div>
                </el-checkbox-group>
              </div>
              </div>
            </el-form-item>
          <!-- </div> -->
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
   
    <el-dialog title="充值申请" :visible="showApply" v-if="showApply"  :append-to-body="true" @close="cancel" width="390px">
      <div>
        <label><span class="red">* </span>申请金额：</label>
        <div class="form-input el-input el-input--mini">
          <input type="text" v-model="applyCount" class="el-input__inner" maxlength="9" @input="checkPay(applyCount)"/>
        </div>
        <p style="margin-bottom: 20px;"></p> 
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="ensure" size="small">提交</el-button>
        <el-button  @click="cancel" size="small">返回</el-button>
      </span>
    </el-dialog>
    <template v-if="defineDialogVisible">
      <el-dialog title="查询内容" :visible.sync="defineDialogVisible" width="500px" :append-to-body="true" class="myFieldDialog">
        <el-form>
          <el-form-item label="查询内容: " label-width="80px">
          <template v-if="myField.wordType == 'DATE'">
            <el-date-picker
              v-model="content"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss" size="mini"
              style="width: 380px;">
            </el-date-picker>
          </template>
          <template v-if="myField.wordType != 'DATE'">
            <el-input v-model="content" size="mini"></el-input>
          </template>
        </el-form-item>
        </el-form>
        <span class="button-con-right">
          <el-button type="primary" size="small" @click="saveContent">确定</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </span>
      </el-dialog>
    </template>
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
  import {getUserInfoDetail, moneyApply} from '@/api/share/index'
  import { getBigCates, getSonCates, getFields, getTable } from '@/api/data/index'
  import {download} from '@/api/common/common'
  import { getDataMoney } from '@/api/system/common/index'
  import { beforeOwnBasicDown } from '@/api/front/index'
  export default {
    components: {
    },
    mounted() {
      this.getUserInfo()
      getBigCates().then( res =>{
        this.bigCatesArr = res.data
        this.form.categoryId = this.bigCatesArr[0].type
        getSonCates(this.form.categoryId).then( res =>{
          this.propertyTableArr = res.data
          this.form.propertyTableId = this.propertyTableArr[0].tableName
          getFields(this.form.propertyTableId).then( res =>{
            this.fieldsArr = res.data
          })
        })
      })
    },
    watch: {
      
    },
    data() {
      return {
        myField: '',
        markVisible: false,
        firstCreate: false,
        defineDialogVisible: false,
        fileNameDialogVisible: false,
        content: '',
        contentKey:'',
        bigCatesArr: [],
        propertyTableArr: [],
        fieldsArr:[],
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
            {validator: this.checkField, key:'checkedFileds', message:'请选择字段', trigger: 'change'}
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
      checkPay(value) {
        value += ''
        //收费标准
        if(/[^\d^\.]+/g.test(value)) {

          this.applyCount = value.replace(/[^\d^\.]+/g,'')
         
          
        } else if(value.indexOf('.') > -1 && value.charAt(0) !== '.'){
          //有小数点
          this.applyCount = value.slice(0,value.indexOf('.')+3)
          
        } else if(value.indexOf('.') < 0) {
          //没有小数点
          this.applyCount = value.slice(0,6)
          
        } else if(value.charAt(0) == '.'){
          //没有整数，有小数点
          this.applyCount = '0'+value
          
        } else {
          //callback()
        }
      },
      checkField(rule, value, callback) {
        if(this.form[rule.key].length == 0 && !this.switchFlag) {
          callback(new Error (rule.message))
        } else {
          this.switchFlag = false
          callback()
        }
      },
      checkMupltiBox(rule, value, callback) {
        if(this[rule.key].length == 0) {
          callback(new Error (rule.message))
        } else {
          callback()
        }
      },
      changeCategory() {
        this.switchFlag = true
        getSonCates(this.form.categoryId).then( res => {
          this.propertyTableArr = res.data

          if(this.propertyTableArr.length > 0) {
            this.form.propertyTableId  = this.propertyTableArr[0].tableName
            this.changePropertyTable()
                        
          } else {
            this.form.propertyTableId = ''
          }
          
        })
      },
      changePropertyTable() {
        let _this = this
        this.checkAll = false
        this.isIndeterminate = false
        setTimeout( () => {
          _this.switchFlag = true
            getFields(_this.form.propertyTableId).then( res => {
            let id = _this.form.categoryId
            let pid = _this.form.propertyTableId
            _this.form = {
              categoryId: id,
              propertyTableId: pid,
              checkedFileds: [] 
            }
            _this.fieldsArr = res.data
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
      handleCurrentChange(tag) {//分页
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
      apply () {
        this.showApply = true;
      },
      cancel () {
        this.showApply = false
        this.showApiName = false
        this.defineDialogVisible = false
        this.fileNameDialogVisible = false
        this.markVisible = false
      },
      ensure () {
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
      defineField(field) {
        this.myField = field
        this.defineDialogVisible = true
        this.content = this.form[field.word]
        this.contentKey = field.word
      },
      saveContent() {
        this.form[this.contentKey] = this.content
        this.defineDialogVisible = false
      },
      getParams() {
        //点击生成报表，参数
        let json = {}
        let keys = []
        for(let key in this.form) {
          keys.push(key)
        }
        this.form.checkedFileds.map( v => {
          if (keys.indexOf(v.word) > -1) {
            //
            json[v.word] = v.wordType == 'DATE' ? this.form[v.word].join() : this.form[v.word]
          } else {
            json[v.word] = ''
          }
        })
        return json
      },
      getParams2() {
        //点击保存，参数
        let param = []
        let keys = []
        for(let key in this.form) {
          keys.push(key)
        }

        this.form.checkedFileds.map( v => {
          let json = {}
          if (keys.indexOf(v.word) > -1) {
            json.value = v.wordType == 'DATE' ? this.form[v.word].join() : this.form[v.word]
          } else {
            json.value = ''
          }
          json.field = v.word
          json.fieldName = v.wordExplain
          param.push(json)          
        })
        return param
      },
      createTable(tag) {
        if(this.form.checkedFileds.length > 0) { //判断是否选择字段
          this.firstCreate = true
          let json = {}
          this.selectedKeys = this.form.checkedFileds
          json.tableName = this.form.propertyTableId
          this.page.page = tag ? tag : 1
          let param = Object.assign({},json,this.page,this.getParams())
          getTable(param).then( res =>{
            
            this.result = res.data.result
            this.total = res.data.total
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
        
        json2.fieldsList = this.getParams2()
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
          if(res.code == 200) {
            this.markVisible = false
            let name2 = this.markForm.markContent.length > 0 ? this.markForm.markContent : '基础数据个人定制'
              download(this.getParams3(), '/webapp/data/tailor_made_form' , name2+'.xlsx', function() {
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
</style>




