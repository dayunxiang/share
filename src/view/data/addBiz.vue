<template>
	<div>
		<div class="page-title">发布业务数据</div>
		<div class="page-container main-container">
			<div class="mar-20 info-block">
				<p class="title">基本信息</p>
				<div class="tab-container">
		      <el-form ref="form" :model="form" :rules="rules" label-width="96px" label-position="left" >
		        <el-form-item label="数据名称：" prop="name">
		          <el-input size="mini" class="form-input" v-model="form.name" maxlength="50" placeholder="请输入数据名称"></el-input>
		          <el-button size="mini" type="primary" style="margin-left:15px;" @click="uploadImg">
		            <img :src="uploadUrl"/>
		          </el-button>
		        </el-form-item>
            
		        <el-form-item label="类型：" prop="type" class="is-required">
              <div class="height-40-copy">
  		          <el-checkbox-group v-model="typeList" @change="changeTypeList">
  		            <el-checkbox v-for="(item, index) in typeArray" :label="item.codeExt" :checked="item.checked"  :key="'key0' + index">{{item.name}}</el-checkbox>              
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
           <!--  <span v-if="form.isFree == '1'">
              <el-input-number v-model="form.payStandard" :precision="2" :min="0" :max="999999.99" size="mini" class="mgn" ></el-input-number><span>水利币/份</span>
            </span> -->
		      </el-form>
          <template v-if="delImgVisible">
		      <div class="img-preview" v-for="(n, index) in imgList" :key="index" :data-index="index">
		        <img @click="preview($event)" :src="n.url"/>
            <i class="el-icon-error img-close" @click="delImg"></i>
		      </div>
        </template>
		    </div>
			</div>
			<div class="mar-20 info-block">
        <p class="title">数据示例</p>
        <div class="tab-container">
          <div>
            <span class="red mr-4">*</span><span>示例图片</span>
            <el-button size="mini" type="primary" style="margin-left:15px;" @click="$refs.imgFile2.click()">
              <img :src="uploadUrl"/>
            </el-button>
            <input id="upload" ref="imgFile2" class="hide" type="file" accept="image/*" @change="doUploadImg2"/>
            <span class="grey">上传数据列表样式图片，格式限制为JPEG、JPG、TIFF、RAW、BMP、GIF、PNG。限制在5M以内</span>
          </div>
          <div class="preview" id="preview"></div>
        </div>   
      </div>
			<div class="mar-20 info-block">
        <p class="title">数据列表</p>
        <div class="tab-container">
          <div class="mrb-16">
            <el-button class="operateBtn" size="small" @click="$refs.dataFile.click()"><i class="iconfont icon-tianjiashujubao_huaban"></i> 添加数据包</el-button>
            <input type="file" class="hide" ref="dataFile" @change="changeFile"/>
            <span class="grey">上传数据列表，格式限制为Excel，文件不可大于10M</span>
          </div>
          <el-table border fit :data="fileList">
            <el-table-column label="数据包名称" prop="attachmentName" align="left"></el-table-column>
            <el-table-column label="格式" prop="attachmentPattern"></el-table-column>
            <el-table-column label="大小(kb)" prop="attachmentSize"></el-table-column>
            <el-table-column label="发布时间" prop="attachmentTime" width="160"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <a  @click="delFile(scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>   
      </div>
      <div class="rightPage">
        <el-button type="primary" size="mini" @click="store(1)">保存</el-button>
        <el-button type="primary" size="mini" @click="store(2)">提交</el-button>
        <el-button size="mini" @click="back">返回</el-button>
      </div>
		</div>
		<el-dialog title="上传图片" :visible="showUploadImg"  :append-to-body="true" @close="cancel" width="500px">
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
        <input id="upload" ref="imgFile" class="hide" type="file" @change="doUploadImg"/>
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="addImg" size="small">确定</el-button>
        <el-button  @click="cancel" size="small">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="预览" :visible="previewVisible" :append-to-body="true" fullscreen lock-scroll @close="cancel">
      <div class="vertival-view">
        <img :src="form.picPath" class="img-size"/>
      </div>
    </el-dialog>
    <el-dialog title="对象类型" :visible="showBasic" :append-to-body="true"   @close="cancel" width="600px">
      <div class="basic-list">
        <!-- <span v-for="(item, index) in basicTypeArray" :key="index" @click="chooseBasicType(item, index)">{{item.name}}</span> -->
        <el-checkbox-group v-model="basicTypeList">
          <el-checkbox :label="item.type" class="checkbox-mar" :checked="item.checked" v-for="(item, index) in basicTypeArray" :key="'key0' + index">{{item.tableNote}}</el-checkbox>              
        </el-checkbox-group>
      </div>
      <div class="rightPage">
        <el-button size="mini" type="primary" @click="chooseBasicType">确定</el-button>
        <el-button  size="mini" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
  import { uploadFile, getApiTypeArray, getBasicTypeArray } from '@/api/api/index'
  import { uploadFiles, saveBiz, submitBiz } from '@/api/data/index'
  import { getType } from '@/api/common/common.js'
	export default {
		name: 'addBiz',
		data() {
			return {
        previewVisible: false,
        fileList: [],
				showUploadImg: false,
				defaultImg: false,
        delImgVisible: false,
        fileImg: false,
        showBasic: false, // 显示、隐藏基础对象选择框
				typeList: [],
        typeArray: [],
        basicTypeArray: [],
        chooseTypeArray: [],
        basicTypeList: [],
				form: {
          name: '',
          picId: '',
          picPath:'',
          examplePicId:'',
          examplePicPath: '',
          type: '',
          basicType: '',
          shortDescription: '',
          isFree:'',
          payStandard: 0
        },
        rules: {
          name: [
            {required: true, message: '请输入数据名称', trigger: 'blur'}
          ],
          type: [
            {validator: this.checkMupltiBox, key:'typeList', message:'请选择类型', trigger: 'change'}
          ],
          basicType: [
            {validator: this.checkBasicType, trigger: 'change'}
          ],
          shortDescription: [
            {required: true, message: '请输入数据简介', trigger: 'blur'}
          ],
          isFree: [
            {required: true, message: '请选择是否收费', trigger: 'change'}
          ],
          payStandard: [
            {required: true, message: '请输入收费标准', trigger: 'blur'},
            {validator: this.checkPay, trigger: 'change'}
          ]
        },
				imgList: [{
          url: '',
          width: 1000,
          height: 600
        }],
        uploadUrl: require('@/assets/images/file.png'),
        defaultUrl: require('@/assets/images/default.png'),
        fileUrl: require('@/assets/images/file2.png'),
        chooseFileUrl: ''
			}
		},
		created() {
      // getType({ dicCode: 10000001 }).then( res => {
      //   this.typeArray = res.data
      // })
      this.getApiType()
		},
		methods: {
      getApiType() {
        getApiTypeArray({type: '2', isChild: '0'}).then(resp => {
          this.typeArray = resp.data
        })
        getBasicTypeArray().then(resp => {
          this.basicTypeArray = resp.data
        })
      },
      checkMupltiBox(rule, value, callback) {
        if(this[rule.key].length == 0) {
          callback(new Error (rule.message))
        } else {
          callback()
        }
      },
      changeTypeList() {
        this.form.type = this.typeList.join()
      },
      checkPay(rule, value, callback) {
        value += ''
        //收费标准
        if(/[^\d^\.]+/g.test(value)) {

          this.form.payStandard = value.replace(/[^\d^\.]+/g,'')
          callback()
          
        } else if(value.indexOf('.') > -1 && value.charAt(0) !== '.'){
          //有小数点
          this.form.payStandard = value.slice(0,value.indexOf('.')+3)
          callback()
        } else if(value.indexOf('.') < 0) {
          //没有小数点
          this.form.payStandard = value.slice(0,6)
          callback()
        } else if(value.charAt(0) == '.'){
          //没有整数，有小数点
          this.form.payStandard = '0'+value
          callback()
        } else {
          callback()
        }
      },
      uploadImg() {
        this.showUploadImg = true
      },
      addImg() {
        if(!this.defaultImg && this.file) {
          let formData = new FormData()
          formData.append('file', this.file)
          uploadFile(formData).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '上传成功'
              })
              this.imgList[0].url = '/webapp/attachment/' + resp.data.attachmentId
              this.form.picAttachmentId =  resp.data.attachmentId
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
        if(file) {
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
      delImg() {
        this.form.picAttachmentId =  ''
        this.form.picPath = ''
        this.imgList[0].url = ''
        this.chooseFileUrl = ''
        this.fileImg = false
        this.delImgVisible = false
      },
      doUploadImg2(e) {
        //预览
        let file = e.target.files[0]
        if(file) {
          let reader = new FileReader()
          reader.onload = function(event) {
            preview.innerHTML = '<img src="' + event.target.result + '" class="upload-image">'
          }
          
          reader.readAsDataURL(file)

          //上传示例图片
          let formData = new FormData()
          formData.append('file', file)
          uploadFile(formData).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '上传成功',
                duration: 1300
              })
              this.form.examplePicId =  resp.data.attachmentId
              this.form.examplePicPath = resp.data.attachmentPath
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        }
      },
      preview(e) {
        this.previewVisible = true
      },
      cancel() {
        this.showDemo = false
        this.showUploadImg = false
        this.previewVisible = false
        this.showBasic = false
      },
      changeFile(e) {
        let file = e.target.files[0]
        let len = file.name.split('.').length
        let ext = file.name.split('.')[len-1]

        if(ext == 'xls' || ext == 'xlsx') {
          let formData = new FormData()
          formData.append('file',file)
          uploadFiles(formData).then(res => {
            if(res.code == 200) {
              this.fileList.push(res.data)
              e.target.value = ''
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
              e.target.value = ''
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '文件格式错误',
            duration: 1300
          })
        }
      },
      
      delFile(row) {
        this.fileList.forEach( (v, i) => {
          if(row.attachmentId == v.attachmentId) {
            this.fileList.splice(i, 1)
          }
        })
        
      },
      store(val) {
         this.$refs['form'].validate((valid) => {
          if(this.form.examplePicPath) {
            if(this.fileList.length > 0) {
              let arr = []
              this.fileList.forEach( v => {
                arr.push(v.attachmentId)
              })
              this.form.listAttachmentIds = arr.join()
              if(val == 1) {
                this.save()
              } else if(val == 2) {
                this.submit()
              }
            } else {
              this.$message({
                type: 'warning',
                message: '请添加数据包',
                duration: 1300
              })
            }
          } else {
            this.$message({
              type: 'warning',
              message: '请上传数据示例图片',
              duration: 1300
            })
          }
        })
      },
      save() {
       saveBiz(this.form).then(res => {
          if(res.code == 200) {
            this.$message({
              type: 'success',
              message: '保存成功',
              duration: 1300
            })
            this.$router.push({
              name: 'dataCenter',
              params: {
                typeNum: 1,
                type: 'init'
              }
            })
            this.$store.commit('closeTag', 'addBiz')
          } else {
            this.$message({
              type: 'success',
              message: res.message,
              duration: 1300
            })
          }
        })
      },
      submit() {
        submitBiz(this.form).then(res => {
          if(res.code == 200) {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1300
            })
            this.$router.push({
              name: 'dataCenter',
              params: {
                typeNum: 1,
                type: 'init'
              }
            })
            this.$store.commit('closeTag', 'addBiz')
          } else {
            this.$message({
              type: 'success',
              message: res.message,
              duration: 1300
            })
          }
        })
      },
      back() {
        this.$router.push({
          name: 'dataCenter',
          params: {
            typeNum: 1,
            type: 'init'
          }
        })
        this.$store.commit('closeTag', 'addBiz')
      },
      chooseBasic() {//显示对象选择框
        this.showBasic = true
      },
      chooseBasicType(data) {// 选择对象
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
        this.basicTypeList.splice(this.basicTypeList.indexOf(data.codeExt), 1)
        this.form.basicType = this.basicTypeList.join()
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

<style lang="less">
  @import '../../assets/scss/self.less';
</style>