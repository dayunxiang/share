<template>
<div class="basic-container">
  <p class="page-title">创建基础API</p>
  <div class="main-container">
    <p class="tab">
      <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)" class="text-gray">定制API</span>
      <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)" class="text-gray">产品详情</span>
    </p>
    <div class="basic-outer pad-top-0" v-if="tabNum == 1">
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="基础对象：" prop="tableName" class="is-required">
          <el-select v-model="form.objMainId" size="small" @change="getChildCategory" class="category" filterable>
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

    <el-form ref="form2" :model="form2" :rules="rules2" label-width="100px" label-position="left"  v-if="tabNum == 2">
      <p class="basic-title">基本信息</p>
      <div class="basic-tab">
        <div class="tab-container">
          <el-form-item label="API标题：" prop="apiName">
            <el-input size="mini" class="form-input" placeholder="请输入API标题" v-model="form2.apiName" maxlength="50"></el-input>
            <el-button size="mini" type="primary" style="margin-left:15px;" @click="uploadImg">
              <img :src="uploadUrl"/>
            </el-button>
          </el-form-item>
          <el-form-item label="API类型：" prop="apiType">
            <div class="height-40-copy">
            <el-checkbox-group v-model="apiTypeList" @change="changeApiTypeList">
              <el-checkbox :label="item.codeExt" class="checkbox-mar" :checked="item.checked" v-for="(item, index) in apiTypeArray" :key="'key0' + index">{{item.name}}</el-checkbox>              
            </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="对象类型：" prop="basicType" class="is-required">
            <el-button type="primary" size="mini" @click="chooseBasic">选择对象</el-button>
            <el-input v-model="form2.basicType" class="hide"></el-input>
            <span class="basic-span" v-for="(item, index) in chooseTypeArray" :key="index">{{item.tableNote}} <i class="el-icon-close" @click="closeBasic(item, index)"></i></span>
          </el-form-item>
          <el-form-item label="API简介：" prop="apiShortDescription">
            <el-input size="mini" class="radius" placeholder="请输入API简介" v-model="form2.apiShortDescription" maxlength="100" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="功能介绍：" prop="apiDescription">
            <el-input type="textarea" size="mini" class="radius" placeholder="请输入功能介绍" v-model="form2.apiDescription" maxlength="800"></el-input>
          </el-form-item>
          <template v-if="delImgVisible">
          <div class="img-preview" v-for="(n, index) in imgList" :key="index" :data-index="index">
            <img @click="preview($event)" :src="n.url"/>
            <i class="el-icon-error img-close" @click="delImg"></i>
          </div>
        </template>
        </div>
      </div>

      <p class="basic-title" >收费方式</p>
      <div class="tab-container">
        <el-form-item label="是否收费：" prop="isFree">
          <el-radio-group v-model="form2.isFree">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
         <!--  <span class="radio-btn" @click="changeRadio('1')" :class="form2.isFree == '1' ? 'active' : ''">是</span>
          <span class="radio-btn" @click="changeRadio('0')" :class="form2.isFree == '0' ? 'active' : ''">否</span> -->
        </el-form-item>
        <el-form-item label="收费标准：" prop="payStandard" v-if="form2.isFree == '1'">
          <el-input size="mini" v-model="form2.payStandard" placeholder="" class="form-input width-300" maxlength="9">
             <template slot="append">水利币/次</template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="收费标准：" prop="payStandard" v-if="form2.isFree == '1'">
          <el-input size="mini" v-model="form2.payStandard" class="form-input" maxlength="8">
             <template slot="append">水利币/次</template>
          </el-input>
        </el-form-item> -->
      </div>
    </el-form>
  </div>

  

  <div class="btn-outer" v-if="tabNum == 1">
    <el-button type="primary" @click="addBasic">生成API详情</el-button>
  </div>

  <div class="basic-detail" v-if="isShowDetail && tabNum == 1">
    <div class="detail-outer">
      <label>API链接：</label>
      <div class="detail font-0">
        <el-input size="mini" class="link" :readonly="true" v-model="apiDetail.url"></el-input>
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
          <el-table-column label="必填" prop="isMust"></el-table-column>
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



    <div class="btn-group" v-if="isShowDetail || tabNum == 2">
      <el-button type="primary" size="mini" @click="save">保存</el-button>
      <el-button type="primary" size="mini" @click="submit" v-if="tabNum == 2">提交</el-button>
      <el-button type="primary" size="mini" @click="nextStep" v-if="tabNum == 1">下一步</el-button>
      <el-button size="mini" @click="preStep" v-if="tabNum == 2">返回上一步</el-button>
      <el-button size="mini" v-if="tabNum == 1" @click="back">取消</el-button>
    </div>
   
    <el-dialog title="上传图片" :visible="showUploadImg"  :append-to-body="true" @close="cancel" width="80%">
      <div >
        <p class="dialog-tab">
          <span :class="defaultImg ? 'active' : ''" @click="changeImgTab(1)">默认图片</span>
          <span :class="!defaultImg ? 'active' : ''" @click="changeImgTab(2)">自定义图片</span>
        </p>

        <!-- <span class="img-outer" v-show="defaultImg">
          <img :src="defaultUrl"/>
        </span> -->

        <div v-show="defaultImg" class="default-con">
          <span v-for="(item, index) in urlObjArray" :key="index" @click="chooseImg(index)" :class="{'active': item.actived}">
            <img :src="urlObj[item.url]">{{item.name}}
          </span>
        </div>

        <span class="img-outer" v-show="!defaultImg && !fileImg" @click="$refs.imgFile.click()">
          <img :src="fileUrl" style="width: 40px;"/><br/>
          <small>点击上传图片</small>
        </span>
        <span class="img-outer2" v-show="!defaultImg && fileImg" @click="$refs.imgFile.click()">
          <img :src="chooseFileUrl"/>
        </span>
        <input id="upload" ref="imgFile" class="hide" type="file" @change="doUploadImg"/>
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="addImg" size="small">确定</el-button>
        <el-button  @click="cancel" size="small">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="预览" :visible="previewVisible" :append-to-body="true" fullscreen lock-scroll @close="cancel">
      <div class="vertival-view">
        <img :src="imgList[0].url" class="img-size"/>
      </div>
    </el-dialog>
     <el-dialog title="对象类型" :visible="showBasic" :append-to-body="true"   @close="cancel" width="600px">
      <div class="basic-list">
        <p class="filter-con">
          <label>筛选条件：</label>
          <span>
            <el-input v-model="filterVal" size="small"></el-input>
          </span>
        </p>
        <!-- <span v-for="(item, index) in basicTypeArray" :key="index" @click="chooseBasicType(item, index)">{{item.name}}</span> -->
        <el-checkbox-group v-model="basicTypeList">
          <el-checkbox :label="item.type" class="checkbox-mar" :checked="item.checked" v-for="(item, index) in basicTypeFilterArray" :key="'key0' + index">{{item.tableNote}}</el-checkbox>              
        </el-checkbox-group>
      </div>
      <div class="rightPage">
        <el-button size="mini" type="primary" @click="chooseBasicType">确定</el-button>
        <el-button  size="mini" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
  import {uploadFile, saveBasicApiStep1, saveBasicApiStep2, getApiTypeArray, getBasicTypeArray} from '@/api/api/index'
  import {getDataCategory, getCategoryById, getTableDetail, addBasicApi, bookBasicApi} from '@/api/front/index'
  export default {
    name: 'addBasicApi',
    components: {
    },
    props: {
      
    },
    mounted() {
       this.getCategory()
       this.getApiType()
    },
    data() {
      return {
        switchFlag: false,
        previewVisible: false,
        delImgVisible: false,
        showBasic: false, // 显示、隐藏基础对象选择框
        apiTypeList: [],
        basicTypeList: [],
        filterVal: '', //过滤条件
        tabNum: 1,
        dataId: '', //数据id
        defaultImg: true,
        fileImg: false,
        imgList: [{
          url: '',
          width: 1000,
          height: 600
        }],
        showUploadImg: false,
        form: {
          tableName: '',
          sortRuleList: []
        },
        rules: {
          tableName: [
            {validator: this.checkCategory, trigger: 'change'}
          ],
          // interfaceParameter: [
          //   {validator: this.checkParam, trigger: 'change'}
          // ],
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
        isSave: false,
        categoryArray: [],
        childCategoryArray: [],
        requestParam: [],
        respParam: [],
        changeFlag: false, //
        showApply: false,
        checkAllParam: false,
        checkAllResponseParam: false,
        isIndeterminate: false,
        isRespIndeterminate: false,
        showApiName: false,
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


        form2: {
          apiName: '',
          apiShortDescription: '',
          apiType: '',
          basicType: '',
          apiDescription: '',
          picAttachmentId: '',//附件id
          payStandard: '',
          isFree: '1',
          id: ''
        },
        uploadUrl: require('@/assets/images/file.png'),
        defaultUrl: require('@/assets/images/default.png'),
        fileUrl: require('@/assets/images/file2.png'),
        chooseFileUrl: '',
        rules2: {
          apiName: [
            {required: true, message: '请输入API标题', trigger: 'blur'}
          ],
          apiType: [
            {required: true, message: '请选择API类型', trigger: 'blur'}
          ],
          basicType: [
            {validator: this.checkBasicType, trigger: 'change'}
          ],
          apiShortDescription: [
            {required: true, message: '请输入API简介', trigger: 'blur'}
          ],
          apiDescription: [
            {required: true, message: '请输入功能介绍', trigger: 'blur'}
          ],
           payStandard: [
            {required: true, message: '请输入收费标准', trigger: 'blur'},
            {validator: this.checkPay, trigger: 'change'}
          ],
          isFree: [
            {required: true, message: '请选择是否收费', trigger: 'blur'}
          ],
        },
        apiTypeArray: [],
        basicTypeArray: [],
        chooseTypeArray: []
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      },
      basicTypeFilterArray() {
        if (this.filterVal) {
          return this.basicTypeArray.filter(v => {
            return v.tableNote.indexOf(this.filterVal) > -1
          })
        } else {
          return this.basicTypeArray
        }
      },
      urlObj() {
        return JSON.parse(JSON.stringify(this.$store.state.app.urlObj))
      },
      urlObjArray() {
        return JSON.parse(JSON.stringify(this.$store.state.app.urlObjArray))
      }
    },
    methods: {
      chooseImg(index) {//选中默认图片
        this.urlObjArray.forEach(v => {
          v.actived = false
        })
        this.urlObjArray[index].actived = true
        this.$forceUpdate()
        this.chooseIndex = index
      },
      getApiType() {
        getApiTypeArray({type: '2', isChild: '0'}).then(resp => {
          this.apiTypeArray = resp.data
        })
        getBasicTypeArray().then(resp => {
          this.basicTypeArray = resp.data
        })
      },
      getCategory() {
        getDataCategory().then(resp => {
          this.categoryArray = resp.data
        })
      },
      getChildCategory() {
         //去掉全选样式
        this.checkAllParam = false
        this.isIndeterminate = false
        this.checkAllResponseParam = false
        this.isRespIndeterminate = false

        this.switchFlag = true

        let param = {
          categoryType: this.form.objMainId
        }
        getCategoryById(param).then(resp => {
          this.childCategoryArray = resp.data
          this.form.tableName = ''
          this.changeFlag = false
          this.list = [{}, {}]
        })
      },
      changeChild() {
        //去掉全选样式
        this.checkAllParam = false
        this.isIndeterminate = false
        this.checkAllResponseParam = false
        this.isRespIndeterminate = false
        

        this.changeFlag = true
        this.switchFlag = true
        //清空接口参数、返回参数
        this.requestParam = []
        this.respParam = []
        this.form.interfaceParameter = ''
        this.form.returnParameter = ''

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
      checkPay(rule, value, callback) {
        value += ''
        //收费标准
        if(/[^\d^\.]+/g.test(value)) {

          this.form2.payStandard = value.replace(/[^\d^\.]+/g,'')
          callback()

        } else if(value.indexOf('.') > -1 && value.charAt(0) !== '.'){
          //有小数点
          this.form2.payStandard = value.slice(0,value.indexOf('.')+3)
          callback()
        } else if(value.indexOf('.') < 0) {
          //没有小数点
          this.form2.payStandard = value.slice(0,6)
          callback()
        } else if(value.charAt(0) == '.'){
          //没有整数，有小数点
          this.form2.payStandard = '0'+value
          callback()
        } else {
          callback()
        }
      },
      changeAllRequest(e) {
       this.requestParamArray.forEach((v, index) => {
          v.checked = e
        })
        let arr = JSON.parse(JSON.stringify(this.requestParamArray))

        this.form.interfaceParameter = this.requestParamArray.filter( ele => {
          return ele.checked
        }).map(v => {
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
          if (this.form.objMainId == '' || this.form.objMainId == null || this.form.objMainId == undefined) {
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
        if (this.respParam.length == 0 && !this.switchFlag) {
          callback(new Error('请选择返回参数'))
        } else {
          this.switchFlag = false
          callback()
        }
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
            this.form.sortRuleList = this.list
            addBasicApi(this.form).then(resp => {
              if (resp.code == 200) {
                this.apiDetail = resp.data[0]
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
















      changeApiTypeList() {
        this.form2.apiType = this.apiTypeList.join()
      },
      changeTab(num) {
   
      },
      nextStep() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.sortRuleList = this.list
            saveBasicApiStep1(this.form).then(resp => {
              if (resp.code == 200) {
                if (this.isSave) {
                  this.$router.push({
                    name: 'apiCenter',
                    params: {
                      type: 'init'
                    }
                  })
                  this.$store.commit('closeTag', 'addApi')
                } else {
                  this.dataId = resp.data
                  this.tabNum = 2
                }
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
      save() {
        this.isSave = true
        if (this.tabNum == 1) {
          this.nextStep()
        } else if (this.tabNum == 2) {
          this.saveStep2()
        }
      },
      saveStep2() {
        this.$refs.form2.validate(valid => {
          if (valid) {
            this.form2.id = this.dataId
            this.form2.status = 1
            this.form2.payStandard = this.form2.isFree == '1' ? this.form2.payStandard : ''
            saveBasicApiStep2(this.form2).then((resp) => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.$router.push({
                  name: 'apiCenter',
                  params: {
                    type: 'init'
                  }
                })
                this.$store.commit('closeTag', 'addApi')
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
     
      submit() {
        this.$refs.form2.validate(valid => {
          if (valid) {
            this.form2.id = this.dataId
            this.form2.status = 2
            this.form2.payStandard = this.form2.isFree == '1' ? this.form2.payStandard : ''
            saveBasicApiStep2(this.form2).then((resp) => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
                this.$router.push({
                  name: 'apiCenter',
                  params: {
                    type: 'init'
                  }
                })
                this.$store.commit('closeTag', 'addApi')
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
      preStep() {
        this.tabNum -= 1
      },

      cancel() {
        this.showUploadImg = false
        this.previewVisible = false
        this.showBasic = false
      },
      changeRadio(val) {
        this.form2.isFree = val
      },
      back() {
        if(this.$refs['form'] !== undefined) {
          this.$refs.form.resetFields()
        }
          
        if(this.$refs['form2'] !== undefined) {
          this.$refs.form2.resetFields()
        }
        
        this.$router.push({
          name: 'apiCenter',
          params: {
            type: 'init'
          }
        })
        this.$store.commit('closeTag', 'addBasicApi')
      },
      
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      uploadImg() {
        this.showUploadImg = true
      },
      dataURLtoFile(dataurl, filename) {//将base64转换为文件
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        //return new File([u8arr], filename, {type:mime}) // ie不兼容
        return new Blob([u8arr], {type:mime})
      },
      addImg() {
        if (this.defaultImg) {
          this.file = this.dataURLtoFile(this.urlObj[this.urlObjArray[this.chooseIndex].url], this.urlObjArray[this.chooseIndex].name + '.png')
          this.file.name = this.urlObjArray[this.chooseIndex].name + '.png'
        } else {
          if (this.file == '' || this.file == null || this.file == undefined) {
            this.$message({
              type: 'warning',
              message: '图片不能为空！'
            })
            return false
          }
           if (this.file.size > 3 * 1024 * 1024) {
            this.$message({
              type: 'warning',
              message: '图片大小不能超过3M！'
            })
            return false
          }
          let type = this.file.name.substring(this.file.name.lastIndexOf('.') + 1).toLowerCase()
          let typeArray = ['jpg', 'jpeg', 'tiff', 'raw', 'bmp', 'gif', 'png']
          if (typeArray.indexOf(type) < 0) {
            this.$message({
              type: 'warning',
              message: '图片格式不正确！'
            })
            return false
          }
        }
        let formData = new FormData()
        formData.append('file', this.file, this.file.name)
        uploadFile(formData).then(resp => {
          if (resp.code == 200) {
            if (!this.defaultImg) {
              this.$message({
                type: 'success',
                message: '上传成功'
              })
            }
            this.imgList[0].url = resp.data.attachmentPath
            this.form2.picAttachmentId =  resp.data.attachmentId
            this.showUploadImg = false
            this.delImgVisible = true
          } else {
             this.$message({
              type: 'success',
              message: resp.message
            })
          }
        })
      },
      delImg() {
        this.form.picAttachmentId =  ''
        this.imgList[0].url = ''
        this.chooseFileUrl = ''
        this.fileImg = false
        this.delImgVisible = false
      },
      changeImgTab(flag) {
        if (flag == 1) {
          this.defaultImg = true
        } else {
          this.defaultImg = false
        }
      },

      
      
     
      doUploadImg (e) {
        if (!e || !window.FileReader) {
          return false
        }
        this.fileImg = true
        let file = e.target.files[0]
        this.file = file
        let reader = new FileReader()
        let _this = this
        reader.readAsDataURL(file)
        this.chooseFileUrl = reader.result
        reader.onloadend = function() {
          _this.chooseFileUrl = this.result
        }
      },
      preview(e) {
        this.previewVisible = true
      },
       chooseBasic() {//显示对象选择框
        this.showBasic = true
      },
      chooseBasicType(data) {// 选择对象
        this.form2.basicType = this.basicTypeList.join()
        this.showBasic = false
        this.chooseTypeArray = []
        this.basicTypeArray.forEach(v => {
          if (this.basicTypeList.indexOf(v.type) > -1) {
            this.chooseTypeArray.push(v)
          }
        })
      },
      closeBasic(data, index) {
        this.chooseTypeArray.splice(index, 1)
        this.basicTypeList.splice(this.basicTypeList.indexOf(data.type), 1)
        this.form2.basicType = this.basicTypeList.join()
      },
      checkBasicType(rule, value, callback) {
        if(this.basicTypeList.length > 0) {
          callback()
        } else {
          callback(new Error ('请选择对象类型'))
        }
      }
    }
  }
</script>

<style  lang="less" >
  @import '../front/front.less';
  .basic-container .btn-group,
  .basic-container .btn-outer {
    width: 100%;
    padding: 0 16px;
    margin: 16px 0;
    text-align: right;
  }
  .basic-detail {
    margin: 0 16px;
    padding: 30px 46px;
    box-sizing: border-box;
  }
  .text-gray {
    color: #999;
  }
</style>


