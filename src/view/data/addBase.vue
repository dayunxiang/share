<template>
  <div>
    <div class="page-title">发布基础数据</div>
    <div class="page-container main-container">
      <div class="mar-20 info-block">
        <p class="title">报表配置</p>
        <div class="tab-container">
          <el-form label-width="96px" label-position="left" ref="formBase" :model="formBase" :rules="rules2">
            <div>
              <!-- <span class="red">*</span> -->
              <el-form-item label="数据类型：" prop="categoryId" class="is-required">
                <el-select v-model="formBase.categoryId" size="mini" @change="changeCategory" class="width-300" filterable>
                  <el-option v-for="item in bigCatesArr" :label="item.tableNote" :value="item.type" :key="item.id"></el-option>
                </el-select>
                <el-select v-model="formBase.propertyTableId" size="mini" @change="changePropertyTable" class="width-300" filterable>
                  <el-option v-for="item in propertyTableArr" :label="item.propertyTableName" :value="item.tableName" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="">
              <!-- <span class="red mr-4 red-pos">*</span> -->
              <el-form-item label="字段：" prop="checkedFileds" class="is-required">
                <div class="field-color">
                  <div v-if="formBase.propertyTableId">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="formBase.checkedFileds" @change="handleCheckedChange">
                      <div v-for="(field, index) in fieldsArr" :key="field.id" class="mr-30 line-block">
                        <el-checkbox :label="field">{{field.wordExplain}}</el-checkbox>
                        <div class="bigCircle" @click="defineField(field)">
                          <div class="smallCircle"></div>
                        </div>
                      </div>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="rightPage mb-20">
        <el-button type="primary" size="small" @click="createTable()">生成报表</el-button>
      </div>
      <div class="mar-20 info-block" v-if="firstCreate">
        <div class="tab-container">
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
              <el-pagination background @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="mar-20 info-block" v-if="firstCreate">
        <p class="title">基本信息</p>
        <div class="tab-container">
          <el-form ref="form" :model="form" :rules="rules" label-width="96px" label-position="left">
            <el-form-item label="数据名称：" prop="name">
              <el-input size="mini" class="form-input" v-model="form.name" maxlength="50" placeholder="请输入数据名称"></el-input>
              <el-button size="mini" type="primary" class="ml-15" @click="uploadImg">
                <img :src="uploadUrl"/>
              </el-button>
            </el-form-item>
            <el-form-item label="类型：" prop="type" class="is-required">
              <div class="height-40-copy">
                <el-checkbox-group v-model="typeList" @change="changeTypeList">
                  <el-checkbox v-for="(item, index) in typeArray" :label="item.codeExt" :checked="item.checked" :key="'key0' + index">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item label="对象类型：" prop="basicType" class="is-required">
              <el-button type="primary" size="mini" @click="chooseBasic">选择对象</el-button>
              <el-input v-model="form.basicType" class="hide"></el-input>
              <span class="basic-span" v-for="(item, index) in chooseTypeArray" :key="index">{{item.tableNote}} <i class="el-icon-close" @click="closeBasic(item, index)"></i></span>
            </el-form-item>
            <el-form-item label="数据简介：" prop="shortDescription">
              <el-input type="textarea" size="mini" class="radius" v-model="form.shortDescription" maxlength="500" placeholder="请输入数据简介"></el-input>
            </el-form-item>
            <el-form-item label="是否收费：" prop="isFree" class="line-block">
              <el-radio-group v-model="form.isFree">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="收费标准:" prop="payStandard" v-if="form.isFree == '1'">
              <el-input size="mini" v-model="form.payStandard" class="form-input width-300" maxlength="9">
                <template slot="append">水利币/次</template>
              </el-input>
            </el-form-item>
            <!-- <span v-if="form.isFree == '1'">
              <el-input-number v-model="form.payStandard" :precision="2" :min="0" :max="999999.99" size="mini" class="mgn" ></el-input-number><span>水利币/份</span>
            </span> -->
            </el-form-item>
          </el-form>
          <template v-if="delImgVisible">
          <div class="img-preview" v-for="(n, index) in imgList" :key="index" :data-index="index">
            <img @click="preview($event)" :src="n.url"/>
            <i class="el-icon-error img-close" @click="delImg" v-if="delImgVisible"></i>
          </div>
        </template>
        </div>
      </div>
      <div class="rightPage" v-if="firstCreate">
        <el-button type="primary" size="mini" @click="save">保存</el-button>
        <el-button type="primary" size="mini" @click="submit">提交</el-button>
        <el-button size="mini" @click="back">返回</el-button>
      </div>
    </div>
    <el-dialog title="上传图片" :visible="showUploadImg" :append-to-body="true" @close="cancel" width="500px">
      <div>
        <p class="dialog-tab">
          <span :class="defaultImg ? 'active' : ''" @click="changeImgTab(1)">默认图片</span>
          <span :class="!defaultImg ? 'active' : ''" @click="changeImgTab(2)">自定义图片</span>
        </p>
        <span class="img-outer" v-show="defaultImg">
          <img :src="defaultUrl"/>
        </span>
        <span class="img-outer" v-show="!defaultImg && !fileImg" @click="$refs.imgFile.click()">
          <img :src="fileUrl" style="width: 40px;"/><br/>
          <small>点击上传图片</small>
        </span>
        <span class="img-outer2" v-show="!defaultImg && fileImg" @click="$refs.imgFile.click()">
          <img :src="chooseFileUrl"/>
        </span>
        <input id="upload" ref="imgFile" class="hide" type="file" @change="doUploadImg" />
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="addImg" size="small">确定</el-button>
        <el-button  @click="cancel" size="small">取消</el-button>
      </span>
    </el-dialog>
    <template v-if="defineDialogVisible">
      <el-dialog title="查询内容" :visible.sync="defineDialogVisible" width="500px" :append-to-body="true" class="myFieldDialog">
        <el-form>
          <el-form-item label="查询内容: " label-width="80px">
            <template v-if="myField.wordType == 'DATE'">
              <el-date-picker v-model="content" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" size="mini" style="width: 380px;">
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
    <el-dialog title="预览" :visible="previewVisible" :append-to-body="true" fullscreen lock-scroll @close="cancel">
      <div class="vertival-view">
        <img :src="form.picPath" class="img-size"/>
      </div>
    </el-dialog>
    <el-dialog title="对象类型" :visible="showBasic" :append-to-body="true" @close="cancel" width="600px">
      <div class="basic-list">
        <!-- <span v-for="(item, index) in basicTypeArray" :key="index" @click="chooseBasicType(item, index)">{{item.name}}</span> -->
        <el-checkbox-group v-model="basicTypeList">
          <el-checkbox :label="item.type" class="checkbox-mar" :checked="item.checked" v-for="(item, index) in basicTypeArray" :key="'key0' + index">{{item.tableNote}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="rightPage">
        <el-button size="mini" type="primary" @click="chooseBasicType">确定</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { uploadFile, getBasicTypeArray, getApiTypeArray } from '@/api/api/index'
import { getBigCates, getSonCates, getFields, getTable, saveBase, submitBase } from '@/api/data/index'
import { getType } from '@/api/common/common.js'
export default {
  name: 'addBase',
  data() {
    return {
      myField: '',
      showBasic: false, // 显示、隐藏基础对象选择框
      basicTypeArray: [],
      chooseTypeArray: [],
      basicTypeList: [],
      previewVisible: false,
      content: '',
      contentKey: '',
      bigCatesArr: [],
      propertyTableArr: [],
      fieldsArr: [],
      isIndeterminate: false,
      checkAll: false,
      formBase: {
        categoryId: '',
        propertyTableId: '',
        checkedFileds: []
      },
      showUploadImg: false,
      defaultImg: false,
      delImgVisible: false,
      fileImg: false,
      typeList: [],
      form: {
        name: '',
        picId: '',
        picPath: '',
        type: '',
        basicType: '',
        shortDescription: '',
        isFree: '',
        payStandard: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入数据名称', trigger: 'blur' }
        ],
        type: [
          { validator: this.checkMupltiBox, key: 'typeList', message: '请选择类型', trigger: 'change' }
        ],
        basicType: [
          { validator: this.checkBasicType, trigger: 'change' }
        ],
        shortDescription: [
          { required: true, message: '请输入数据简介', trigger: 'blur' }
        ],
        isFree: [
          { required: true, message: '请选择是否收费', trigger: 'change' }
        ],
        payStandard: [
          { required: true, message: '请输入收费标准', trigger: 'blur' },
          { validator: this.checkPay, trigger: 'change' }
        ]
      },
      rules2: {
        checkedFileds: [
          { validator: this.checkField, key: 'checkedFileds', message: '请选择字段', trigger: 'change' }
        ]
      },
      switchFlag: false,
      imgList: [{
        url: '',
        width: 1000,
        height: 600
      }],
      uploadUrl: require('@/assets/images/file.png'),
      defaultUrl: require('@/assets/images/default.png'),
      fileUrl: require('@/assets/images/file2.png'),
      chooseFileUrl: '',
      typeArray: [],
      page: {
        page: 1,
        size: 10
      },
      total: 0,
      defineDialogVisible: false,
      result: [],
      selectedKeys: [],
      firstCreate: false
    }

  },
  created() {
    getBasicTypeArray().then(resp => {
      this.basicTypeArray = resp.data
    })
    getBigCates().then(res => {
      this.bigCatesArr = res.data
      this.formBase.categoryId = this.bigCatesArr[0].type
      getSonCates(this.formBase.categoryId).then(res => {
        this.propertyTableArr = res.data
        this.formBase.propertyTableId = this.propertyTableArr[0].tableName
        getFields(this.formBase.propertyTableId).then(res => {
          this.fieldsArr = res.data
        })
      })
    })
    getApiTypeArray({ type: '2', isChild: '0' }).then(resp => {
      this.typeArray = resp.data
    })
  },
  methods: {
    chooseBasic() { //显示对象选择框
      this.showBasic = true
    },
    chooseBasicType(data) { // 选择对象
      this.form.basicType = this.basicTypeList.join()
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
      this.form.basicType = this.basicTypeList.join()
    },
    checkBasicType(rule, value, callback) {
      if (this.basicTypeList.length > 0) {
        callback()
      } else {
        callback(new Error('请选择对象类型'))
      }
    },
    checkField(rule, value, callback) {
      if (this.formBase[rule.key].length == 0 && !this.switchFlag) {
        callback(new Error(rule.message))
      } else {
        this.switchFlag = false
        callback()
      }
    },
    checkPay(rule, value, callback) {
      value += ''
      //收费标准
      if (/[^\d^\.]+/g.test(value)) {

        this.form.payStandard = value.replace(/[^\d^\.]+/g, '')
        callback()

      } else if (value.indexOf('.') > -1 && value.charAt(0) !== '.') {
        //有小数点
        this.form.payStandard = value.slice(0, value.indexOf('.') + 3)
        callback()
      } else if (value.indexOf('.') < 0) {
        //没有小数点
        this.form.payStandard = value.slice(0, 6)
        callback()
      } else if (value.charAt(0) == '.') {
        //没有整数，有小数点
        this.form.payStandard = '0' + value
        callback()
      } else {
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
      getSonCates(this.formBase.categoryId).then(res => {
        this.propertyTableArr = res.data

        if (this.propertyTableArr.length > 0) {

          this.formBase.propertyTableId = this.propertyTableArr[0].tableName
          this.changePropertyTable()

        } else {
          this.formBase.propertyTableId = ''
        }
      })
    },
    changePropertyTable() {
      let _this = this
      this.checkAll = false
      this.isIndeterminate = false
      setTimeout(() => {
        _this.switchFlag = true
        getFields(_this.formBase.propertyTableId).then(res => {
          let id = _this.formBase.categoryId
          let pid = _this.formBase.propertyTableId
          _this.formBase = {
            categoryId: id,
            propertyTableId: pid,
            checkedFileds: []
          }
          _this.fieldsArr = res.data
        })
      }, 100)

    },
    handleCheckAllChange(val) {
      this.formBase.checkedFileds = val ? this.fieldsArr : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.fieldsArr.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fieldsArr.length;
    },
    handleCurrentChange(page) { //分页
      this.page.page = page
      this.createTable(page)
    },
    changeTypeList() {
      this.form.type = this.typeList.join()
    },
    uploadImg() {
      this.showUploadImg = true
    },
    addImg() {
      if (!this.defaultImg && this.file) {
        let formData = new FormData()
        formData.append('file', this.file)
        uploadFile(formData).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.imgList[0].url = resp.data.attachmentPath
            this.form.picId = resp.data.attachmentId
            this.form.picPath = resp.data.attachmentPath
            this.showUploadImg = false
            this.delImgVisible = true
          } else {
            this.$message({
              type: 'success',
              message: resp.message
            })
          }
        })
      } else {
        this.showUploadImg = false
      }
    },
    delImg() {
      this.form.picAttachmentId = ''
      this.form.picPath = ''
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
    doUploadImg(e) {
      if (!e || !window.FileReader) {
        return false
      }
      this.fileImg = true
      let file = e.target.files[0]
      if (file) {
        this.file = file
        let reader = new FileReader()
        let _this = this
        reader.readAsDataURL(file)
        this.chooseFileUrl = reader.result
        reader.onloadend = function() {
          _this.chooseFileUrl = this.result
        }
      }

    },
    preview(e) {
      this.previewVisible = true
    },
    cancel() {
      this.showDemo = false
      this.showUploadImg = false
      this.defineDialogVisible = false
      this.previewVisible = false
      this.showBasic = false
    },
    defineField(field) {
      this.myField = field
      this.defineDialogVisible = true
      this.content = this.formBase[field.word]
      this.contentKey = field.word
    },
    saveContent() {
      this.formBase[this.contentKey] = this.content
      this.defineDialogVisible = false
    },
    getParams() {
      //点击生成报表，参数
      let json = {}
      let keys = []
      for (let key in this.formBase) {
        keys.push(key)
      }

      this.formBase.checkedFileds.map(v => {
        if (keys.indexOf(v.word) > -1) {
          json[v.word] = v.wordType == 'DATE' ? this.formBase[v.word].join() : this.formBase[v.word]
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
      for (let key in this.formBase) {
        keys.push(key)
      }

      this.formBase.checkedFileds.map(v => {
        let json = {}
        if (keys.indexOf(v.word) > -1) {
          json.value = v.wordType == 'DATE' ? this.formBase[v.word].join() : this.formBase[v.word]
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
      if (this.formBase.checkedFileds.length > 0) { //判断是否选择字段
        this.firstCreate = true
        let json = {}
        this.selectedKeys = this.formBase.checkedFileds
        json.tableName = this.formBase.propertyTableId
        this.page.page = tag ? tag : 1
        let param = Object.assign({}, json, this.page, this.getParams())
        getTable(param).then(res => {

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
    save() {
      this.$refs['formBase'].validate((valid) => {
        if (valid) {
          let json = {}
          json.mainType = this.formBase.categoryId
          json.subTableName = this.formBase.propertyTableId
          json.fieldsList = this.getParams2()

          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.form.payStandard = this.form.isFree == '1' ? this.form.payStandard : 0
              let param = Object.assign({}, json, this.form)
              //保存
              saveBase(param).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '保存成功',
                    duration: 1300
                  })
                  this.$router.push({
                    name: 'dataCenter',
                    params: {
                      typeNum: 2,
                      type: 'init'
                    }
                  })
                  this.$store.commit('closeTag', 'addBase')
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
              })
            } else {
              this.$message({
                type: 'warning',
                message: '保存失败，请完善发布信息',
                duration: 1300
              })
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    submit() {
      this.$refs['formBase'].validate((valid) => {
        if (valid) {
          let json = {}
          json.mainType = this.formBase.categoryId
          json.subTableName = this.formBase.propertyTableId
          json.fieldsList = this.getParams2()

          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.form.payStandard = this.form.isFree == '1' ? this.form.payStandard : 0
              let param = Object.assign({}, json, this.form)
              //提交
              submitBase(param).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '提交成功',
                    duration: 1300
                  })
                  this.$router.push({
                    name: 'dataCenter',
                    params: {
                      typeNum: 2,
                      type: 'init'
                    }
                  })
                  this.$store.commit('closeTag', 'addBase')
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
              })
            } else {
              this.$message({
                type: 'warning',
                message: '提交失败，请完善发布信息',
                duration: 1300
              })
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    back() {
      this.$router.push({
        name: 'dataCenter',
        params: {
          typeNum: 2,
          type: 'init'
        }
      })
      this.$store.commit('closeTag', 'addBase')
    }
  }
}

</script>
<style lang="less">
@import '../../assets/scss/self.less';

</style>
