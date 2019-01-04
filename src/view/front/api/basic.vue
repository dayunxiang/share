<template>
  <div class="front-index">
    <div class="front-main">
      <div class="basic-outer">
        <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
          <el-form-item label="账户：" class="line-30">
            <div class="user-info">
              <div class="api-count">
                <div class="api-price">
                  <span class="title">每次调用水利币</span><br/>
                  <img :src="priceUrl" />
                  <span class="price">{{ userPrice }}</span>/次
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
          <el-form-item label="基础对象：" prop="tableName" class="is-required">
            <el-select v-model="category" size="small" @change="getChildCategory" class="category" filterable>
              <el-option v-for="(item, index) in categoryArray" :key="index" :value="item.type" :label="item.tableNote"></el-option>
            </el-select>
            <el-select v-model="form.tableName" size="small" class="category" @change="changeChild" filterable>
              <el-option v-for="(item, index) in childCategoryArray" :key="index" :value="item.tableName" :label="item.propertyTableName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口参数：" prop="interfaceParameter">
            <input type="text" class="hide" v-model="form.interfaceParameter"/>
            <div class="check-outer">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllParam" @change="changeAllRequest($event)">全选</el-checkbox>
              <el-checkbox-group v-model="requestParam" @change="changeRequestParam">
                <el-checkbox  v-for="(item, index) in requestParamArray" :key="index" :checked="item.checked" :label="item.word">{{item.wordExplain}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="返回参数：" prop="returnParameter" class="is-required">
            <input type="text" class="hide" v-model="form.returnParameter"/>
            <div class="check-outer">
              <el-checkbox :indeterminate="isRespIndeterminate" v-model="checkAllResponseParam" @change="changeAllResponse($event)">全选</el-checkbox>
              <el-checkbox-group  v-model="respParam" @change="changeResponseParam">
                <el-checkbox  v-for="(item, index) in respParamArray" :key="index"  :checked="item.checked" :label="item.word">{{item.wordExplain}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="排序规则：">
            <div>
              <el-table :data="list" border>
                <el-table-column label="参数">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.parameter" size="mini" style="width: 100%">
                      <el-option v-for="(item, index) in paramArray" :key="index" :label="item.wordExplain" :value="item.word"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="排序规则">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.sortRule" size="mini" style="width: 100%">
                      <el-option v-for="(item, index) in ascArray" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="" class-name="text-center">
                  <template slot-scope="scope">
                   <el-button size="mini" class="plusBtn" @click="addrow">
                     <i class="plusBg"></i>
                   </el-button>
                   <el-button size="mini" class="minusBtn" v-if="list.length > 1" @click="deleteRow(scope.$index)">
                      <i class="minusBg"></i>
                   </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="每次返回：" prop="number">
            <el-select v-model="form.number" size="small">
              <el-option v-for="(item, index) in numberArray" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="返回类型：" prop="returnType">
            <el-select v-model="form.returnType" size="small">
              <el-option v-for="(item, index) in typeArray" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="btn-outer">
        <el-button type="primary" @click="addBasic">生成API详情</el-button>
      </div>

      <div class="basic-detail" v-if="isShowDetail">
        <div class="detail-outer">
          <label>API链接：</label>
          <div class="detail font-0">
            <el-input size="mini" class="link" :readonly="true" v-model="apiDetail.url"></el-input>
            <el-button size="mini" class="btn-book" @click="bookApi" type="primary">立即订阅</el-button>
          </div>

        </div>
        <div class="detail-outer">
          <label>请求说明：</label>
          <div class="detail border">
             <ul>
              <li>请求地址：{{apiDetail.requestDescriptionList[0].url}}</li>
              <li>请求方式：{{apiDetail.requestDescriptionList[0].requestMethod}}</li>
              <li>返回格式：{{apiDetail.requestDescriptionList[0].returnType}}</li>
              <li>请求参数：</li>
             </ul>
          </div>
          <div class="detail">
            <el-table :data="apiDetail.requestDescriptionList[0].requestParameterList" border cell-class-name="text-center">
              <el-table-column label="名称" prop="columnName"></el-table-column>
              <el-table-column label="必填" prop="isMust">
                <template slot-scope="scope">
                  <span v-if="scope.row.isMust == 1">是</span>
                  <span v-if="scope.row.isMust != 1">否</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="type"></el-table-column>
              <el-table-column label="说明" prop="explain"></el-table-column>
            </el-table>
          </div>
        </div>
        
        <div class="detail-outer">
          <label>返回示例：</label>
          <div class="detail border">
             <pre>{{apiDetail.dataReturnExampleMap}}</pre>
          </div>
          <div class="detail">
            <el-table :data="apiDetail.returnExampleMapList" border cell-class-name="text-center">
              <el-table-column label="名称" prop="columnName"></el-table-column>
              <el-table-column label="类型" prop="type"></el-table-column>
              <el-table-column label="说明" prop="explain"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="detail-outer">
          <label>错误码：</label>
          <div class="detail">
            <el-table :data="errorArray" border >
              <el-table-column label="错误码" prop="code" width="200" class-name="text-center"></el-table-column>
              <el-table-column label="说明" prop="desc" class-name="text-left"></el-table-column>
            </el-table>
          </div>
        </div>

      </div>
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

    <el-dialog title="立即订阅" :visible="showApiName"  :append-to-body="true" @close="cancel" width="375px">
      <div >
        <p style="margin-bottom: 20px;">
          <label>API名称：</label>
          <el-input size="mini" v-model="apiName" class="form-input" maxlength="20"></el-input>
        </p> 
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="doBook" size="small">确定</el-button>
        <el-button  @click="cancel" size="small">取消</el-button>
      </span>
    </el-dialog>

    <div role="alert" class="el-message el-message--success is-closable showMyMessage" style="z-index: 2014;" v-if="showMyMessage">
      <i class="el-message__icon el-icon-success"></i>
      <p class="el-message__content">
        <span>{{ myMessageCon }}，</span>
        <router-link class="toLink" :to="'/api/myApi'">请到个人中心 =&gt; API中心中查看 &nbsp;</router-link>
      </p>
      <i class="el-message__closeBtn el-icon-close" @click="closeMyMessage"></i>
    </div>

    
  </div>
</template>

<script>
  import {getDataCategory, getCategoryById, getTableDetail, addBasicApi, bookBasicApi} from '@/api/front/index'
  import {getUserInfoDetail, moneyApply} from '@/api/share/index'
  import { getApiMoney } from '@/api/system/common/index'
  export default {
    components: {
    },
    mounted() {
      this.getUserInfo()
      this.getCategory()
    },
    watch: {
      
    },
    data() {
      return {
        myMessageCon: '',
        showMyMessage: false,
        userPrice: '',
        form: {
          tableName: '',
          sortRuleList: []
        },
        rules: {
          tableName: [
            {validator: this.checkCategory, trigger: 'change'}
          ],
          interfaceParameter: [
            //{validator: this.checkParam, trigger: 'change'}
          ],
          returnParameter: [
            {validator: this.checkParam2, trigger: 'change'}
          ],
          number: [
            {required: true, message: '请选择每次返回'}
          ],
          returnType: [
            {required: true, message: '请选择返回类型'}
          ],
        },
        checkAllParam: [],
        paramArray: [],
        requestParamArray: [],
        respParamArray: [],
        category: '',
        apiDetail: {},
        isShowDetail: false,
        categoryArray: [],
        childCategoryArray: [],
        paramArray: [{name: '1'}],
        requestParam: [],
        respParam: [],
        changeFlag: false, //
        showApply: false,
        checkAllParam: false,
        checkAllResponseParam: false,
        isIndeterminate: false,
        isRespIndeterminate: false,
        showApiName: false,
        apiName: '',
        applyCount: '',
        userCount: '',
        errorArray: [
          {code: '200', desc: '请求成功'},
          {code: '207', desc: '频繁操作'},
          {code: '400', desc: '请求参数出错'},
          {code: '401', desc: '没有登录'},
          {code: '402', desc: '登录失败'},
          {code: '403', desc: '没有权限'},
          {code: '404', desc: '找不到页面'},
          {code: '405', desc: '请求方法不能被用于请求相应的资源'},
          {code: '406', desc: '内容特性不满足'},
          {code: '408', desc: '请求超时'},
          {code: '409', desc: '发生冲突'},
          {code: '410', desc: '已被删除'},
          {code: '411', desc: '没有定义长度'},
          {code: '412', desc: '条件不满足'},
          {code: '413', desc: '数据太大'},
          {code: '415', desc: '不是服务器中所支持的格式'},
          {code: '421', desc: '连接数过多'},
          {code: '423', desc: '已被锁定'},
          {code: '451', desc: '法律不允许'},
          {code: '500', desc: '服务器出错'},
          {code: '501', desc: '不支持当前请求所需要的某个功能'},
          {code: '503', desc: '服务器升级中,暂时不可用'},
          {code: '510', desc: '获取资源所需要的策略并没有被满足'}
        ],
        ascArray: [
          {value: 'asc', label: '升序'},
          {value: 'desc', label: '降序'}
        ],
        numberArray: [
          {value: '10', label: '10'},
          {value: '15', label: '15'},
          {value: '20', label: '20'},
          {value: '30', label: '30'},
          {value: '50', label: '50'}
        ],
        typeArray: [
          {value: 'json', label: 'JSON'},
          {value: 'xml', label: 'XML'}
        ],
        list: [{}, {}],
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
      getUserInfo() {
        getUserInfoDetail().then(resp => {
          this.userCount = resp.data
        })
        getApiMoney().then(res => {
          this.userPrice = Number(res.data.list[0].payStandard).toFixed(2)
        })
      },
      getCategory() {
        getDataCategory().then(resp => {
          this.categoryArray = resp.data
        })
      },
      getChildCategory() {
        let param = {
          categoryType: this.category
        }
        getCategoryById(param).then(resp => {
          this.childCategoryArray = resp.data
          this.form.tableName = ''
          this.changeFlag = false
          this.list = [{}, {}]
        })
      },
      changeChild() {
        this.changeFlag = true
        let param = {
          propertyTable: this.form.tableName
        }
        getTableDetail(param).then(resp => {
          this.paramArray = resp.data
          this.requestParamArray = JSON.parse(JSON.stringify(resp.data))
          this.respParamArray = JSON.parse(JSON.stringify(resp.data))
          this.list = [{}, {}]
        })
      },
      changeAllRequest(e) {
        this.requestParamArray.forEach((v, index) => {
          v.checked = e
        })
        let arr = JSON.parse(JSON.stringify(this.requestParamArray))

        this.form.interfaceParameter = this.requestParamArray.map(v => {
          return v.word
        }).join()

        this.requestParamArray = []
        this.$nextTick(() => {
          this.requestParamArray = arr
        }, 1)
        this.requestParam = JSON.parse(JSON.stringify(this.requestParamArray))
        this.isIndeterminate = false
      },
      changeRequestParam() {
        this.form.interfaceParameter = this.requestParam.join()
        if (this.requestParam.length == this.paramArray.length) {
          this.checkAllParam = true
          this.isIndeterminate = false
        } else if (this.requestParam.length ==0) {
          this.checkAllParam = false
          this.isIndeterminate = false
        } else {
          this.checkAllParam = false
          this.isIndeterminate = true
        }
      },
      changeResponseParam() {
        this.form.returnParameter = this.respParam.join()
        if (this.respParam.length == this.paramArray.length) {
          this.checkAllResponseParam = true
          this.isRespIndeterminate = false
        } else if (this.respParam.length ==0) {
          this.checkAllResponseParam = false
          this.isRespIndeterminate = false
        } else {
          this.checkAllResponseParam = false
          this.isRespIndeterminate = true
        }
      },
      changeAllResponse(e) {
        this.respParamArray.forEach((v, index) => {
          v.checked = e
        })
        let arr = JSON.parse(JSON.stringify(this.respParamArray))

        this.form.returnParameter = this.respParamArray.map(v => {
          return v.word
        }).join()

        this.respParamArray = []
        this.$nextTick(() => {
          this.respParamArray = arr
        }, 1)
        this.respParam = JSON.parse(JSON.stringify(this.respParamArray))
        this.isRespIndeterminate = false
      },
      checkCategory(rule, value, callback) {
        if (this.changeFlag) {
          if (value == '' || value == null || value == undefined) {
            callback(new Error('请选择基础对象'))
          } else {
            callback()
          }
        } else {
          if (this.category == '' || this.category == null || this.category == undefined) {
            callback(new Error('请选择基础对象'))
          } else {
            callback()
          }
        }
      },
      checkParam(rule, value, callback) {
        if (this.requestParam.length == 0) {
          callback(new Error('请选择接口参数'))
        } else {
          callback()
        }
      },
      checkParam2(rule, value, callback) {
        if (this.respParam.length == 0) {
          callback(new Error('请选择返回参数'))
        } else {
          callback()
        }
      },
      apply () {
        this.showApply = true;
      },
      cancel () {
        this.showApply = false
        this.showApiName = false
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
      addrow() {
        let param = {}
        this.list.push(param)
      },
      deleteRow(index) {
        this.list.splice(index, 1)
      },
      addBasic() {
        this.$refs.form.validate(valid => {
          if (valid) {
            //删除排序规则内容存在为空的数据
      
            this.form.sortRuleList = this.list
            addBasicApi(this.form).then(resp => {
              if (resp.code == 200) {
                this.apiDetail = resp.data[0]
                this.apiDetail.requestDescriptionList[0].url = this.apiDetail.requestDescriptionList[0].url.replace(/\&amp;/g,'&')
                this.isShowDetail = true
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          }
        })
        
      },
      bookApi() {
        this.showApiName = true
      },
      closeMyMessage() {
        this.showMyMessage = false
      },
      doBook() {
        let param = Object.assign({apiName: this.apiName}, this.form)
        bookBasicApi(param).then(resp => {
          if (resp.code == 200) {
            this.showApiName = false
            this.showMyMessage = true
            this.myMessageCon = '订阅成功'
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" >
   @import '../front.less';
   .toLink {
    color: #009dec;
    cursor: pointer;
    text-decoration: underline;
   }
</style>


