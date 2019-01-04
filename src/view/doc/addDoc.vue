<template>
	<div>
		<div class="page-title">文档发布</div>
		<div class="page-container main-container">
			<div class="mar-20 info-block">
				<p class="title">基本信息</p>
				<div class="tab-container">
		      <el-form ref="form" :model="form" :rules="rules" label-width="96px" label-position="left" >
		        <el-form-item label="文档名称：" prop="name">
		          <el-input size="mini" class="form-input" v-model="form.name" maxlength="50" placeholder="请输入文档名称"></el-input>
		        
		        </el-form-item>
		        <el-form-item label="作者：" prop="author">
		          <el-input size="mini" class="form-input" v-model="form.author" maxlength="50" placeholder="请输入作者"></el-input>  
		        </el-form-item>
         
		        <el-form-item label="类型：" prop="type" class="is-required">
              <div class="height-40-copy">
                <span v-if="typeArray.length == 0">&nbsp;</span>
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
		        <el-form-item label="是否收费：" prop="isFree" >
              <el-radio-group v-model="form.isFree">
                <el-radio label="1">是</el-radio>
                <el-radio label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="收费标准：" prop="payStander" v-if="form.isFree == '1'">
              <el-input size="mini" v-model="form.payStander" class="form-input width-300" maxlength="9">
                 <template slot="append">水利币/次</template>
              </el-input>
            </el-form-item>
            <el-form-item label="上传文档：" prop="docId" class="is-required">
              <el-button size="mini"  class="operateBtn" @click="$refs.docFile.click()"><i class="iconfont icon-wendangshangchuan_huaban"></i> 文档上传</el-button>
              <input id="upload" ref="docFile" class="hide" type="file" @change="doUploadDoc"/>
              <span class="fileName">{{docFileUrl}}</span>
            </el-form-item>
		      </el-form>
		     
		    </div>
			</div>
			
      <div class="rightPage">
        <el-button type="primary" size="mini" @click="store(1)">保存</el-button>
        <el-button type="primary" size="mini" @click="store(2)">提交</el-button>
        <el-button size="mini" @click="back">返回</el-button>
      </div>
		</div>
		
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
  import { uploadFile, uploadDocFile, getApiTypeArray, getBasicTypeArray } from '@/api/api/index'
  import { getType } from '@/api/common/common.js'
  import { addDoc  } from '@/api/doc/index'
	export default {
		name: 'addDoc',
		data() {
			return {
        fileList: [],
				typeList: [],
        typeArray: [],
        fileList: [],
        docFileUrl: '',
        showBasic: false, // 显示、隐藏基础对象选择框
        basicTypeArray: [],
        chooseTypeArray: [],
        basicTypeList: [],
				form: {
          name: '',   //文档名称
          picId: '',  //
          picPath:'',
          basicType: '', //基础对象类型
          author:'', //作者
          type: '',   //类型
          isFree: '1', //是否免费
          payStander: '',//收费标准
          docId: '',  //上传文档id
          docPath: '',//上传文档路径
          docName: '',//上传文档名称
          docType: '',//上传文档类型
          operate: ''//提交方式1、保存，2提交
        },
        rules: {
          name: [
            {required: true, message: '请输入文档名称', trigger: 'blur'}
          ],
          basicType: [
            {validator: this.checkBasicType, trigger: 'change'}
          ],
          type: [
            {validator: this.checkMupltiBox, key:'typeList', message:'请选择类型', trigger: 'change'}
          ],
          isFree: [
            {required: true, message: '请选择是否收费', trigger: 'change'}
          ],
          payStander: [
            {required: true, message: '请输入收费标准', trigger: 'blur'},
            //{validator: this.checkPay, trigger: 'change'}
          ]
        },
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

          this.form.payStander = value.replace(/[^\d^\.]+/g,'')
          
        } else if(value.indexOf('.') > -1 && value.charAt(0) !== '.'){
          //有小数点
          this.form.payStander = value.slice(0,value.indexOf('.')+3)
        } else if(value.indexOf('.') < 0) {
          //没有小数点
          this.form.payStander = value.slice(0,6)
        } else if(value.charAt(0) == '.'){
          //没有整数，有小数点
          this.form.payStander = '0'+value
        } 
        callback()
        
      },
      doUploadDoc (e) {
        let file = e.target.files[0]
        if (file.size > 10 * 1024 * 1024) {
          this.$message({
            type: 'warning',
            message: '文件大小不能超过10M!'
          })
          return false
        }
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        let typeArr = ['doc', 'docx', 'ppt', 'xls', 'xlsx', 'txt', 'pdf']
        // if (typeArr.indexOf(fileType) < 0) {
        //   this.$message({
        //     type: 'warning',
        //     message: '文件格式不正确!'
        //   })
        //   return false
        // }
        let formData = new FormData()
        formData.append('file', file)
        uploadDocFile(formData).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.docFileUrl =  resp.data.attachmentName + '.' + resp.data.attachmentPattern
            this.form.docName = resp.data.attachmentName + '.' + resp.data.attachmentPattern
            this.form.docType = resp.data.attachmentPattern
            this.form.docPath = resp.data.attachmentPath
            this.form.docName = file.name
            this.form.docId = resp.data.attachmentId
          } else {
             this.$message({
              type: 'success',
              message: resp.message
            })
          }
        })
      },

      
      cancel() {
        this.showDemo = false
        this.showBasic = false
      },
      
      store(val) {
        this.form.operate = val
        
        this.$refs['form'].validate((valid) => {
          if(valid) {
            if(!this.form.docPath) {
              this.$message({
                type: 'warning',
                message: '请上传文档',
                duration: 1300
              })
              return false
            }
            addDoc(this.form).then(resp => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.$router.push({
                  name: 'docCenter',
                  params: {
                    type: 'init'
                  }
                })
                this.$store.commit('closeTag', 'addDoc')
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
      back() {
        this.$router.push({
          name: 'docCenter',
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
        this.basicTypeList.splice(this.basicTypeList.indexOf(data.type), 1)
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
  // .height-40 {
  //   height: 40px;
  // }
</style>