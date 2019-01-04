<template>
<div>
  <p class="page-title">发布业务API</p>
  <div class="main-container">
    
    <p class="tab">
      <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)" class="text-gray">产品介绍</span>
      <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)" class="text-gray">API文档</span>
      <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)" class="text-gray">状态码说明</span>
      <span :class="tabNum == 4 ? 'active' : ''" @click="changeTab(4)" class="text-gray">示例代码</span>
      <span :class="tabNum == 5 ? 'active' : ''" @click="changeTab(5)" class="text-gray">收费方式</span>
    </p>
    <div class="tab-container" v-if="tabNum == 1">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" >
        <el-form-item label="API标题：" prop="apiName">
          <el-input size="mini" class="form-input" placeholder="请输入API标题"  v-model="form.apiName" maxlength="50"></el-input>
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
          <el-input v-model="form.basicType" class="hide"></el-input>
          <span class="basic-span" v-for="(item, index) in chooseTypeArray" :key="index">{{item.tableNote}} <i class="el-icon-close" @click="closeBasic(item, index)"></i></span>
        </el-form-item>
        <el-form-item label="API简介：" prop="apiShortDescription">
          <el-input size="mini" class="radius"  placeholder="请输入API简介" v-model="form.apiShortDescription" maxlength="100" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="功能介绍：" prop="apiDescription">
          <el-input type="textarea" size="mini" class="radius"  placeholder="请输入功能介绍" v-model="form.apiDescription" maxlength="800"></el-input>
        </el-form-item>
      </el-form>
      <template v-if="delImgVisible">
      <div class="img-preview" v-for="(n, index) in imgList" :key="index" :data-index="index">
        <img @click="preview($event)" :src="n.url"/>
        <i class="el-icon-error img-close" @click="delImg"></i>
      </div>
    </template>
    </div>

    <el-form :model="form2" :rules="rules2" ref="form2" label-width="100px" label-position="left" >
      <div class="tab-container" v-if="tabNum == 2">
        <p class="title">接口基本信息</p>
        <el-form-item label="接口地址：" prop="apiUrl">
          <el-input size="mini" class="form-input" placeholder="请输入接口地址" v-model="form2.apiUrl" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="返回格式：" prop="apiResFormat">
          <el-select size="mini" class="form-input" v-model="form2.apiResFormat">
            <el-option :label="item.label" :key="index" v-for="(item, index) in backTypeArray" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求方式：" prop="requestType">
          <el-select size="mini" class="form-input" v-model="form2.requestType">
            <el-option :label="item.label" :key="index" v-for="(item, index) in methodTypeArray" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求示例：" prop="apiResquestExample">
          <el-input type="textarea" size="mini" class="radius" placeholder="请输入请求示例" v-model="form2.apiResquestExample" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="接口备注：" prop="apiNote">
          <el-input type="textarea" size="mini" class="radius" placeholder="请输入接口备注" v-model="form2.apiNote" maxlength="500"></el-input>
        </el-form-item>
      </div>

      <div class="tab-container" v-if="tabNum == 2">
        <p class="title">请求参数说明</p>
        <p class="icon-group">
          <el-button size="mini" class="operateBtn"><a href="../static/template/请求参数说明.xlsx" download><i class="iconfont icon-xiazaimoban_huaban"></i> 下载模板</a></el-button>
          <el-button size="mini"  class="operateBtn" @click="$refs.paramFile.click()"><i class="iconfont icon-daorumoban_huaban"></i> 导入模板</el-button>
          <el-button size="mini"  class="operateBtn" @click="exportExcel('form2', 'requestParametersList', '请求参数说明')"><i class="iconfont icon-daochushuju_huaban"></i> 导出数据</el-button>
          <input id="upload1" ref="paramFile" class="hide" type="file" @change="importfxx(this, 'param')"/>
        </p>
        <table ref="paramTable" cellspacing="0" cellpadding="0" border="0" class="el-table param-table" style="width: 100%">
          <thead class="has-gutter">
            <tr class="">
              <th class="is-leaf">名称</th>
              <th class="is-leaf">请求类型</th>
              <th class="is-leaf">必填</th>
              <th class="is-leaf">类型</th>
              <th class="is-leaf">说明</th>
              <th class="is-leaf" width="170px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form2.requestParametersList" :key="index">
              <td>
                <el-input size="mini" v-model="item.name" maxlength="50" placeholder="请输入名称"></el-input>
              </td>
              <td>
                <el-select size="mini" class="" v-model="item.requestType" clearable style="width:120px;">
                  <el-option :label="item.name" :key="index" v-for="(item, index) in requireTypeArray" :value="item.name"></el-option>
                </el-select>
              </td>
              <td>
                <el-select size="mini" class="" v-model="item.isRequired" clearable style="width:120px;">
                  <el-option :label="item.label" :key="index" v-for="(item, index) in isRequiredArray" :value="item.value"></el-option>
                </el-select>
              </td>
              <td>
                <el-select size="mini" class="" v-model="item.type" clearable style="width:120px;">
                  <el-option :label="item.label" :key="index" v-for="(item, index) in dataTypeArray" :value="item.value"></el-option>
                </el-select>
              </td>
              <td>
                <el-input size="mini" v-model="item.description"  maxlength="200" placeholder="请输入说明"></el-input>
              </td>
              <td>
                <el-button  size="mini" @click="addData('param', index)" class="plusBtn"><i class="plusBg"></i></el-button>
                <el-button  v-if="form2.requestParametersList.length > 1" size="mini" @click="deleteData('param', index)" class="minusBtn"><i class="minusBg"></i></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tab-container" v-if="tabNum == 2">
        <p class="title">返回参数说明</p>
        <p class="icon-group">
          <el-button size="mini" class="operateBtn"><a href="../static/template/返回参数说明.xlsx" download><i class="iconfont icon-xiazaimoban_huaban"></i>下载模板</a></el-button>
          <el-button size="mini" class="operateBtn" @click="$refs.backFile.click()"><i class="iconfont icon-daorumoban_huaban"></i> 导入模板</el-button>
          <el-button size="mini" class="operateBtn" @click="exportExcel('form2', 'responseParametersList', '返回参数说明')"><i class="iconfont icon-daochushuju_huaban"></i> 导出数据</el-button>
          <input id="upload2" ref="backFile" class="hide" type="file" @change="importfxx(this, 'back')"/>
        </p>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table param-table" style="width: 100%">
          <thead class="has-gutter">
            <tr class="">
              <th class="is-leaf">名称</th>
              <th class="is-leaf">类型</th>
              <th class="is-leaf">说明</th>
              <th class="is-leaf" width="170"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form2.responseParametersList" :key="index">
              <td>
                <el-input size="mini" v-model="item.name"  maxlength="50"  placeholder="请输入名称"></el-input>
              </td>
              <td>
                <el-select size="mini" class="form-input" v-model="item.type" style="width: 100%;">
                  <el-option :label="item.label" :key="index" v-for="(item, index) in dataTypeArray" :value="item.value"></el-option>
                </el-select>
              </td>
              <td>
                <el-input size="mini" v-model="item.description"  maxlength="200"  placeholder="请输入说明"></el-input>
              </td>
              <td>
                <el-button  size="mini" @click="addData('back', index)" class="plusBtn"><i class="plusBg"></i></el-button>
                <el-button  v-if="form2.responseParametersList.length > 1" size="mini" @click="deleteData('back', index)" class="minusBtn"><i class="minusBg"></i></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tab-container" v-if="tabNum == 2">
        <p class="title">返回示例</p>
        <el-form-item label="" prop="apiResExample" label-width="0">
          <el-input type="textarea" size="mini" class="radius"  placeholder="请输入返回示例" v-model="form2.apiResExample"  maxlength="500"></el-input>
        </el-form-item>
      </div>

    </el-form>

    <el-form ref="form3" v-model="form3"  label-width="100px" label-position="left" >
      <div class="tab-container" v-if="tabNum == 3">
        <p class="title">系统级错误参照码</p>
        <p class="icon-group">
          <el-button size="mini" class="operateBtn"><a href="../static/template/系统级错误参照码.xlsx" download><i class="iconfont icon-xiazaimoban_huaban"></i> 下载模板</a></el-button>
          <el-button size="mini" class="operateBtn" @click="$refs.sysFile.click()"><i class="iconfont icon-daorumoban_huaban"></i> 导入模板</el-button>
          <el-button size="mini" class="operateBtn" @click="exportExcel('form3', 'sysError', '系统级错误参照码')"><i class="iconfont icon-daochushuju_huaban"></i> 导出数据</el-button>
          <input id="upload3" ref="sysFile" class="hide" type="file" @change="importfxx(this, 'sys')"/>
        </p>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table param-table" style="width: 100%">
          <thead class="has-gutter">
            <tr class="">
              <th class="is-leaf">返回码</th>
              <th class="is-leaf">说明</th>
              <th class="is-leaf"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form3.sysError" :key="index">
              <td>
                <el-input size="mini" v-model="item.code" maxlength="10"  placeholder="请输入返回码"></el-input>
              </td>
              <td>
                <el-input size="mini" v-model="item.description" maxlength="50"  placeholder="请输入说明"></el-input>
              </td>
              <td>
                <el-button  size="mini" @click="addData('sys', index)" class="plusBtn"><i class="plusBg"></i></el-button>
                <el-button  v-if="form3.sysError.length > 1" size="mini" @click="deleteData('sys', index)" class="minusBtn"><i class="minusBg"></i></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tab-container" v-if="tabNum == 3">
        <p class="title">服务级错误参照码</p>
        <p class="icon-group">
          <el-button size="mini" class="operateBtn"><a href="../static/template/服务级错误参照码.xlsx" download><i class="iconfont icon-xiazaimoban_huaban"></i> 下载模板</a></el-button>
          <el-button size="mini" class="operateBtn" @click="$refs.serviceFile.click()"> <i class="iconfont icon-daorumoban_huaban"></i> 导入模板</el-button>
          <el-button size="mini" class="operateBtn" @click="exportExcel('form3', 'serviceError', '服务级错误参照码')"><i class="iconfont icon-daochushuju_huaban"></i> 导出数据</el-button>
          <input ref="serviceFile" class="hide" type="file" @change="importfxx(this, 'service')"/>
        </p>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table param-table" style="width: 100%">
          <thead class="has-gutter">
            <tr class="">
              <th class="is-leaf">返回码</th>
              <th class="is-leaf">说明</th>
              <th class="is-leaf"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form3.serviceError" :key="index">
              <td>
                <el-input size="mini" v-model="item.code" maxlength="10" placeholder="请输入返回码"></el-input>
              </td>
              <td>
                <el-input size="mini" v-model="item.description" maxlength="50" placeholder="请输入说明"></el-input>
              </td>
              <td>
                <el-button  size="mini" @click="addData('service', index)" class="plusBtn"><i class="plusBg"></i></el-button>
                <el-button v-if="form3.serviceError.length > 1" size="mini" @click="deleteData('service', index)" class="minusBtn"><i class="minusBg"></i></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tab-container" v-if="tabNum == 3">
        <p class="title">正常返回参照</p>
         <p class="icon-group">
          <el-button size="mini" class="operateBtn"><a href="../static/template/正常返回参照.xlsx" download><i class="iconfont icon-xiazaimoban_huaban"></i> 下载模板</a></el-button>
          <el-button size="mini" class="operateBtn" @click="$refs.successFile.click()"><i class="iconfont icon-daorumoban_huaban"></i> 导入模板</el-button>
          <el-button size="mini" class="operateBtn" @click="exportExcel('form3', 'successCode', '正常返回参照')"><i class="iconfont icon-daochushuju_huaban"></i> 导出数据</el-button>
          <input ref="successFile" class="hide" type="file" @change="importfxx(this, 'success')"/>
        </p>
        <table cellspacing="0" cellpadding="0" border="0" class="el-table param-table" style="width: 100%">
          <thead class="has-gutter">
            <tr class="">
              <th class="is-leaf">返回码</th>
              <th class="is-leaf">说明</th>
              <th class="is-leaf"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form3.successCode" :key="index">
              <td>
                <el-input size="mini" v-model="item.code" maxlength="10" placeholder="请输入返回码"></el-input>
              </td>
              <td>
                <el-input size="mini" v-model="item.description" maxlength="50" placeholder="请输入说明"></el-input>
              </td>
              <td>
                <el-button  size="mini" @click="addData('success', index)" class="plusBtn"><i class="plusBg"></i></el-button>
                <el-button  v-if="form3.successCode.length > 1" size="mini" @click="deleteData('success', index)" class="minusBtn"><i class="minusBg"></i></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-form>

    <el-form ref="form4" v-model="form4"  label-width="100px" label-position="left" >
      <div class="tab-container" v-if="tabNum == 4">
        <p class="icon-group">
          <el-button size="mini" class="operateBtn" @click="addDemo"><i class="iconfont icon-xinjianshili_huaban_huaban"></i> 新建示例</el-button>
        </p>
        <el-table :data="form4.exampleCallList" border>
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="标题" prop="title" ></el-table-column>
          <el-table-column label="语言" prop="language" >
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <a  @click="deleteDemo(scope.$index)">删除<span class="btn-space"></span></a>
              <a  @click="editDemo(scope.row, scope.$index)">修改</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>

    <el-form  :model="form5" :rules="rules5" ref="form5" label-width="90px" label-position="left" >
      <div class="tab-container" v-if="tabNum == 5">
        <el-form-item label="是否收费:" prop="isFree">
          <el-radio-group v-model="form5.isFree">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收费标准:" prop="payStandard" v-if="form5.isFree == '1'">
          <el-input size="mini" v-model="form5.payStandard" class="form-input width-300" placeholder="" maxlength="9">
             <template slot="append">水利币/次</template>
          </el-input>
        </el-form-item>
       
      </div>
    </el-form>

   
    <el-dialog title="示例" :visible="showDemo" v-if="showDemo"  :append-to-body="true" @close="cancel" width="830px">
      <div >
        <el-form :model="demoForm" ref="demoForm" :rules="demoRules" label-position="left" label-width="96px">
          <el-form-item label="标题：" class="text-right" prop="title">
            <el-input size="mini" v-model="demoForm.title" class="form-input" maxlength="20" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="语言：" class="text-right" prop="language">
            <el-select size="mini" class="form-input" v-model="demoForm.language">
              <el-option :label="item.label" :key="index" v-for="(item, index) in langArray" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="示例代码：" class="text-right" prop="exampleCode">
            <el-input size="mini" v-model="demoForm.exampleCode" class="hide"></el-input>
            <text-editor ref="editor" @getContent="getContent" :demoType="demoType" :data="demoForm.exampleCode"></text-editor>
          </el-form-item>

        </el-form>
      </div>
      <span class="button-con-right">
        <el-button type="primary" @click="ensure" size="mini">提交</el-button>
        <el-button  @click="cancel" size="mini">返回</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传图片" :visible="showUploadImg"  :append-to-body="true" @close="cancel" width="500px">
      <div >
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
        <input id="upload4" ref="imgFile" class="hide" type="file" @change="doUploadImg"/>
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
    <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
  </div>
   <div class="btn-group">
      <el-button type="primary" size="mini" @click="save" >保存</el-button>
      <el-button type="primary" size="mini" @click="submit" v-if="tabNum == 5">提交</el-button>
      <el-button type="primary" size="mini" @click="nextStep" v-if="tabNum < 5">下一步</el-button>
      <el-button size="mini" @click="preStep" v-if="tabNum > 1">返回上一步</el-button>
      <el-button size="mini" v-if="tabNum == 1" @click="back">取消</el-button>
    </div>


</div>
</template>

<script>
  import textEditor from './textEditor'
  //import table2excel from '@/libs/table2excel.js'
  import Blob from '@/libs/Blob.js'
  import { export_json_to_excel } from '@/libs/Export2Excel.js'
  import {uploadFile, saveApiStep1, saveApiStep2, saveApiStep3, saveApiStep4, saveApiStep5, submitApi, getApiDetail, getApiTypeArray, getBasicTypeArray, getRequireTypeArray} from '@/api/api/index'
  export default {
    name: 'addApi',
    components: {
      textEditor
    },
    props: {
      
    },
 
    mounted() {
      this.getApiType()
    },
    data() {
      return {
        previewVisible: false,
        delImgVisible: false,
        showBasic: false, // 显示、隐藏基础对象选择框
        apiTypeList: [],
        basicTypeList: [],
        tabNum: 1,
        dataId: '', //数据id
        showDemo: false,
        defaultImg: true,
        fileImg: false,
        showUploadImg: false,
        isSave: false,
        demoIndex: '',
        demoType: '',
        file: '',
        imgList: [{
          url: '',
          width: 1000,
          height: 600
        }],
        backTypeArray: [
          {label: 'JSON', value: 'Json'},
          {label: 'XML', value: 'Xml'}
        ],
        dataTypeArray: [
          {label: 'Long', value: 'Long'},
          {label: 'String', value: 'String'},
          {label: 'BigDecimal', value: 'BigDecimal'}
        ],
        isRequiredArray: [
          {label: '是', value: '1'},
          {label: '否', value: '0'}
        ],
        methodTypeArray: [
          {label: 'POST', value: 'POST'},
          {label: 'GET', value: 'GET'}
        ],
        langArray: [
          {label: 'PHP', value: 'PHP'},
          {label: 'C#', value: 'C#'},
          {label: 'Python', value: 'Python'},
          {label: 'Go', value: 'Go'},
          {label: 'Java', value: 'Java'}
        ],
        demoForm: {
          language: '',
          title: '',
          exampleCode: ''
        },
        form: {
          apiName: '',
          apiShortDescription: '',
          apiType: '',
          basicType: '',
          apiDescription: '',
          thirdPartyApiId: '',//id
          picAttachmentId: '',//附件id
        },
        requireTypeArray: [],
        form2: {
          thirdPartyApiId: '',
          apiUrl: '',
          apiResFormat: '',
          requestType: '',
          apiResquestExample: '',
          apiNote: '',
          apiResExample: '',
          requestParametersList: [
            {
              requestParametersId: '',
              name: '',
              requestType:'',
              type: '',
              isRequired: '',
              description: ''
            },
            {
              requestParametersId: '',
              name: '',
              requestType:'',
              type: '',
              isRequired: '',
              description: ''
            }
          ],
          responseParametersList: [
             {
              responseParametersId: '',
              name: '',
              type: '',
              description: ''
            },
             {
               responseParametersId: '',
              name: '',
              type: '',
              description: ''
            }
          ],
        },
        form3: {
          sysError: [
            {
              code: '',
              description: '',
              type: '1'
            },
            {
              code: '',
              description: '',
              type: '1'
            }
          ],
          serviceError: [
            {
              code: '',
              description: '',
               type: '2'
            },
            {
              code: '',
              description: '',
               type: '2'
            }
          ],
          successCode: [
            {
              code: '',
              description: '',
              type: '3'
            },
            {
              code: '',
              description: '',
              type: '3'
            }
          ]
        },
        form4: {
          thirdPartyApiId: '',
          exampleCallList: []
        },
        form5: {
          payStandard: '',
          isFree: '1'
        },
        uploadUrl: require('@/assets/images/file.png'),
        defaultUrl: require('@/assets/images/default.png'),
        fileUrl: require('@/assets/images/file2.png'),
        chooseFileUrl: '',
        rules: {
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
        },
        rules2: {
          apiUrl: [
            {required: true, message: '请输入接口地址', trigger: 'blur'}
          ],
          apiResFormat: [
            {required: true, message: '请选择返回格式', trigger: 'change'}
          ],
          requestType: [
            {required: true, message: '请选择请求方式', trigger: 'change'}
          ],
          apiResquestExample: [
            {required: true, message: '请输入请求示例', trigger: 'blur'}
          ],
          apiNote: [
            {required: true, message: '请输入请求备注', trigger: 'blur'}
          ],
        },
        demoRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          language: [
            {required: true, message: '请选择语言', trigger: 'change'}
          ],
          exampleCode: [
            {required: true, message: '请输入示例代码', trigger: 'change'}
          ],
        },
        rules5: {
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
      }
    },
    methods: {
      getApiType() {
        getApiTypeArray({type: '2', isChild: '0'}).then(resp => {
          this.apiTypeArray = resp.data
        })
        getBasicTypeArray().then(resp => {
          this.basicTypeArray = resp.data
        })
        getRequireTypeArray({
          dicCode: '10000001'
        }).then( resp => {
          this.requireTypeArray = resp.data
        })
      },
      changeApiTypeList() {
        this.form.apiType = this.apiTypeList.join()
      },
      changeBasicTypeList() {
        this.form.basicType = this.basicTypeList.join()
      },
      checkPay(rule, value, callback) {
        value += ''
        //收费标准
        if(/[^\d^\.]+/g.test(value)) {

          this.form5.payStandard = value.replace(/[^\d^\.]+/g,'')
          callback()
          
        } else if(value.indexOf('.') > -1 && value.charAt(0) !== '.'){
          //有小数点
          this.form5.payStandard = value.slice(0,value.indexOf('.')+3)
          callback()
        } else if(value.indexOf('.') < 0) {
          //没有小数点
          this.form5.payStandard = value.slice(0,6)
          callback()
        } else if(value.charAt(0) == '.'){
          //没有整数，有小数点
          this.form5.payStandard = '0'+value
          callback()
        } else {
          callback()
        }
      },
      changeTab(num) {
   
      },
      nextStep() {
        if (this.tabNum == 1) {
          this.saveStep1()
        } else if (this.tabNum == 2) {
          this.saveStep2()
        } else if (this.tabNum == 3) {
          this.saveStep3()
        } else if (this.tabNum == 4) {
          this.saveStep4()
        } else if (this.tabNum == 5) {
          this.saveStep5()
        }
      },
      save() {
        this.isSave = true
        if (this.tabNum == 1) {
          this.saveStep1()
        } else if (this.tabNum == 2) {
          this.saveStep2()
        } else if (this.tabNum == 3) {
          this.saveStep3()
        } else if (this.tabNum == 4) {
          this.saveStep4()
        } else if (this.tabNum == 5) {
          this.saveStep5()
        }
      },
      saveStep1() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.form.thirdPartyApiId = this.dataId
            saveApiStep1(this.form).then((resp) => {
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
                  this.tabNum = 2
                  this.dataId = resp.data
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
      saveStep2() {
        this.$refs.form2.validate((valid) => {
          if (valid) {
            this.form2.thirdPartyApiId = this.dataId
             //form校验
            if (this.checkForm('form2') == 'requestIsEmpty') {
              this.$message({
                type: 'warning',
                message: '请填写完整请求参数说明字段'
              })
              return false
            }
            if (this.checkForm2() == 'responseIsEmpty') {
              this.$message({
                type: 'warning',
                message: '返回参数说明字段不能为空'
              })
              return false
            }
            let form2Copy = JSON.parse(JSON.stringify(this.form2))
            if (this.checkForm('form2') == 'requestAllEmpty') {
              form2Copy.requestParametersList = []
            }
            saveApiStep2(this.form2).then((resp) => {
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
                  this.tabNum = 3
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
      saveStep3() {
        let param = {
          thirdPartyApiId: this.dataId,
          statusCodeList: []
        }
        param.statusCodeList = this.form3.sysError.concat(this.form3.serviceError).concat(this.form3.successCode)
        //form校验
        if (this.checkForm('form3') == 'sysIsEmpty') {
          this.$message({
            type: 'warning',
            message: '系统级错误参照码字段不能为空'
          })
          return false
        }
        if (this.checkForm('form3') == 'serviceIsEmpty') {
          this.$message({
            type: 'warning',
            message: '服务级错误参照码字段不能为空'
          })
          return false
        }
        if (this.checkForm('form3') == 'successIsEmpty') {
          this.$message({
            type: 'warning',
            message: '正常返回参照码字段不能为空'
          })
          return false
        }
        saveApiStep3(param).then((resp) => {
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
              this.tabNum = 4
            }
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      saveStep4() {
        let param = {
          thirdPartyApiId: this.dataId,
          exampleCallList: this.form4.exampleCallList
        }
        if (this.form4.exampleCallList.length == 0) {
          this.$message({
            type: 'warning',
            message: '示例代码不能为空'
          })
          return false
        }
        saveApiStep4(param).then((resp) => {
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
              this.tabNum = 5
            }
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      saveStep5() {
        this.form5.thirdPartyApiId = this.dataId
        this.form5.payStandard = this.form5.isFree == '1' ? this.form5.payStandard : ''
        saveApiStep5(this.form5).then((resp) => {
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
      },
      checkForm2() {
        let result = false
        this.form2.responseParametersList.forEach(v => {
          if (!v.name || !v.type || !v.description) {
            result = 'responseIsEmpty' 
          }
        })
        return result
      },
      checkForm(form) {
        let result = false
        if (form == 'form1') {
          return result
        } else if(form == 'form2') {
          this.form2.requestParametersList.forEach(v => {
            if (result !== 'requestIsEmpty') {
              if (!v.name && !v.type && !v.isRequired && !v.description && !v.requestType) {
                result = 'requestAllEmpty'
              } else if (!v.name || !v.type || !v.isRequired || !v.description || !v.requestType) {
                result = 'requestIsEmpty'
              }
            }
          }) 

          return result
        } else if(form == 'form3') {
          this.form3.successCode.forEach(v => {
            if (!v.code || !v.description) {
              result = 'successIsEmpty'
            }
          })
          this.form3.serviceError.forEach(v => {
            if (!v.code || !v.description) {
              result = 'serviceIsEmpty'
            }
          })
          this.form3.sysError.forEach(v => {
            if (!v.code || !v.description) {
              result = 'sysIsEmpty'
            }
          })
          return result
        }
      },
      submit() {
         this.form5.thirdPartyApiId = this.dataId
       // this.form5.payStandard = this.form.isFree == '1' ? this.form5.payStandard : ''
        submitApi(this.form5).then((resp) => {
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
      },
      preStep() {
        this.tabNum -= 1
      },
      addData(type, index) {
        let param = {}
        let data = {}
        switch(type) {
          case 'param': data = this.form2.requestParametersList; param = {requestParametersId: '',name: '',description: '',type: '', isRequired: '',requestType: ''}; break;
          case 'back': data = this.form2.responseParametersList; param = {responseParametersId: '',name: '',description: '',type: ''}; break;
          case 'sys': data = this.form3.sysError; param = {code: '',description: '',type: '1'}; break;
          case 'service': data = this.form3.serviceError; param = {code: '',description: '',type: '2'}; break;
          case 'success': data = this.form3.successCode; param = {code: '',description: '',type: '3'}; break;
          default: break;
        }
        data.push(param)
      },
      deleteData(type, index) {
        let data = {}
        switch(type) {
          case 'param': data = this.form2.requestParametersList; break;
          case 'back': data = this.form2.responseParametersList; break;
          case 'sys': data = this.form3.sysError; break;
          case 'service': data = this.form3.serviceError; break;
          case 'success': data = this.form3.successCode; break;
          default: break;
        }
        data.splice(index, 1)
      },
      addDemo() {
        this.showDemo = true
      },
      ensure() {
        this.$refs.editor.getContent()
      },
      getContent(content) {
        let str = "<!DOCTYPE html>\n" + "<html>\n" + "<head>\n" + "</head>\n" + "<body>\n" + "\n" + "</body>\n" + "</html>"
        if(content == str) {
          this.$message({
            type: 'error',
            message: '示例代码不能为空'
          })
          return false
        }
        this.demoForm.exampleCode = content
        this.$refs.demoForm.validate((valid) => {
          if (valid) {
            let param = {
              title: this.demoForm.title,
              language: this.demoForm.language,
              exampleCode: this.demoForm.exampleCode
            }
            if (this.demoType != 'edit') {
              this.form4.exampleCallList.push(param)
            } else {
              this.form4.exampleCallList.splice(this.demoIndex, 1, param)
            }
            this.showDemo = false
            this.demoForm.title = ''
            this.demoForm.language = ''
            this.demoForm.exampleCode = ''
            this.$refs.editor.destroyed()
            this.$refs.demoForm.resetFields()
          } 
        })
      },
      cancel() {
        this.showDemo = false
        this.showUploadImg = false
        this.previewVisible = false
        this.showBasic = false
      },
      changeRadio(val) {
        this.form5.isFree = val
      },
      back() {
        this.$refs.form.resetFields()
        this.$refs.form2.resetFields()
        this.$refs.form3.resetFields()
        this.$refs.form4.resetFields()
        this.$refs.form5.resetFields()
        this.$router.push({
          name: 'apiCenter',
          params: {
            type: 'init'
          }
        })
        this.$store.commit('closeTag', 'addApi')
      },
      exportExcel (form, key, fileName) {　　　
        let tHeader = []
        let filterVal = []
        let formCopyExcel = JSON.parse(JSON.stringify(this[form][key]))
        if (form == 'form2' && key == 'requestParametersList') {
          //转换是否
          formCopyExcel.forEach( v => {
            if(v.isRequired == '1') {
              v.isRequired = '是'
            } else  if(v.isRequired == '0') {
               v.isRequired = '否'
            }
          })
          tHeader = ['名称', '请求类型', '必填', '类型', '说明']; //将对应的属性名转换成中文 
          filterVal = ['name', 'requestType', 'isRequired', 'type', 'description'];//table表格中对应的属性名　　
        } else if (form == 'form2' && key == 'responseParametersList'){
          tHeader = ['名称', '类型', '说明']; //将对应的属性名转换成中文 
          filterVal = ['name', 'type', 'description'];//table表格中对应的属性名　　
        }　else {
          tHeader = ['返回码', '说明']; //将对应的属性名转换成中文 
          filterVal = ['code', 'description'];//table表格中对应的属性名　
        }
        　　　 　　　 
          const list = formCopyExcel
          const data = this.formatJson(filterVal, list)　　　　　　　 
          export_json_to_excel(tHeader, data, fileName)　　　　　 
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      uploadImg() {
        this.showUploadImg = true
      },
      addImg() {
        if (this.defaultImg) {
          this.showUploadImg = false
          return false
        }
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
        let formData = new FormData()
        formData.append('file', this.file)
        uploadFile(formData).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.imgList[0].url =  resp.data.attachmentPath
            this.form.picAttachmentId =  resp.data.attachmentId
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
      editDemo(row, index) {
        this.demoForm = row
        this.demoType = 'edit'
        this.showDemo = true
        this.demoIndex = index
      },
      deleteDemo(index) {
        this.form4.exampleCallList.splice(index, 1)
      },
      importfxx(obj, type) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        //判断文件类型
        let fileType = this.file.name.substring(this.file.name.lastIndexOf('.') + 1)
        if (fileType != 'xls' && fileType != 'xlsx') {
          this.$message({
            type: 'warning',
            message: '文件格式不正确'
          })
          return false
        }
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for(var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require('xlsx');
            if(rABS) {
                wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                    type: 'base64'
                });
            } else {
                wb = XLSX.read(binary, {
                    type: 'binary'
                });
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
            if (type == 'param') {
              _this.resetParam(outdata)
            } else if (type == 'back') {
              _this.resetBack(outdata)
            } else if (type == 'sys') {
              _this.resetSys(outdata)
            } else if (type == 'service') {
              _this.resetService(outdata)
            } else if (type == 'success') {
              _this.resetSuccess(outdata)
            }
                 
          }
          reader.readAsArrayBuffer(f);
        }
        if(rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      },
     checkEmpty(data) {
        let result = false
        if (data == '' || data == null || data == undefined) {
          result = true
        }
         return result
      },
      resetParam(data) {
        //校验文件是否为空
        if (data.length < 1) {
          this.$message({
            type: 'warning',
            message: '导入失败，导入数据不可为空'
          })
          return false
        }
        //校验字段是否为空
        let size = 0
        let emptyArray = []
        let errorArray = []
        for (let i = 0, len = data.length; i < len; i++) {
          let emptyStr = '第' + (i + 1) +'行'
          let emptyArr = []
          //非空
          if (this.checkEmpty(data[i]['名称'])) {
            size += 1
            emptyArr.push('名称')
          }
          if (this.checkEmpty(data[i]['请求类型'])) {
            size += 1
            emptyArr.push('请求类型')
          }
          if (this.checkEmpty(data[i]['必填'])) {
            size += 1
            emptyArr.push('必填')
          }
          if (this.checkEmpty(data[i]['类型'])) {
            size += 1
            emptyArr.push('类型')
          }
          if (this.checkEmpty(data[i]['说明'])) {
            size += 1
            emptyArr.push('说明')
          }
          //长度
         if ((data[i]['名称'] && data[i]['名称'].length > 50) || (data[i]['说明'] && data[i]['说明'].length > 200)) {
            errorArray.push(i + 1)
          }
          if (size > 3) {
            emptyArray = ['必填字段']
            break
          } else if (emptyArr.length > 0){
            emptyStr += emptyArr.join('、')
            emptyArray.push(emptyStr)
          }
        }
        if (size > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，' + emptyArray.join() + '不可为空'
          })
          return false
        }
        //校验字段是否超长
        if (errorArray.length > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，第' + errorArray.join() + '行数据格式错误，字符超过限制'
          })
          return false
        }
        //导入数据
        this.form2.requestParametersList = data.map((v) => {
          return {
            name: v['名称'],
            requestType: v['请求类型'],
            isRequired: v['必填'],
            type: v['类型'],
            description: v['说明']
          }
        })
        this.$refs.paramFile.value = ''
      },
      resetBack(data) {//返回参数
        //校验文件是否为空
        if (data.length < 1) {
          this.$message({
            type: 'warning',
            message: '导入失败，导入数据不可为空'
          })
          return false
        }
        //校验字段是否为空
        let size = 0
        let emptyArray = []
        let errorArray = []
        for (let i = 0, len = data.length; i < len; i++) {
          let emptyStr = '第' + (i + 1) +'行'
          let emptyArr = []
          //非空
          if (this.checkEmpty(data[i]['名称'])) {
            size += 1
            emptyArr.push('名称')
          }
          if (this.checkEmpty(data[i]['类型'])) {
            size += 1
            emptyArr.push('类型')
          }
          if (this.checkEmpty(data[i]['说明'])) {
            size += 1
            emptyArr.push('说明')
          }
          //长度
          if ((data[i]['名称'] && data[i]['名称'].length > 50) || (data[i]['说明'] && data[i]['说明'].length > 200)) {
            errorArray.push(i + 1)
          }
          if (size > 3) {
            emptyArray = ['必填字段']
            break
          } else if (emptyArr.length > 0){
            emptyStr += emptyArr.join('、')
            emptyArray.push(emptyStr)
          }
        }
        if (size > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，' + emptyArray.join() + '不可为空'
          })
          return false
        }
        //校验字段是否超长
        if (errorArray.length > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，第' + errorArray.join() + '行数据格式错误，字符超过限制'
          })
          return false
        }
        //导入数据
        this.form2.responseParametersList = data.map((v) => {
          return {
            name: v['名称'],
            type: v['类型'],
            description: v['说明']
          }
        })
        this.$refs.backFile.value = ''
      },
      resetSys(data) {//系统及code
        //校验文件是否为空
        if (data.length < 1) {
          this.$message({
            type: 'warning',
            message: '导入失败，导入数据不可为空'
          })
          return false
        }
        //校验字段是否为空
        let size = 0
        let emptyArray = []
        let errorArray = []
        for (let i = 0, len = data.length; i < len; i++) {
          let emptyStr = '第' + (i + 1) +'行'
          let emptyArr = []
          //非空
          if (this.checkEmpty(data[i]['返回码'])) {
            size += 1
            emptyArr.push('返回码')
          }
          if (this.checkEmpty(data[i]['说明'])) {
            size += 1
            emptyArr.push('说明')
          }
          //长度
          if ((data[i]['返回码'] && data[i]['返回码'].length > 10) || (data[i]['说明'] && data[i]['说明'].length > 50)) {
            errorArray.push(i + 1)
          }
          if (size > 3) {
            emptyArray = ['必填字段']
            break
          } else if (emptyArr.length > 0){
            emptyStr += emptyArr.join('、')
            emptyArray.push(emptyStr)
          }
        }
        if (size > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，' + emptyArray.join() + '不可为空'
          })
          return false
        }
        //校验字段是否超长
        if (errorArray.length > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，第' + errorArray.join() + '行数据格式错误，字符超过限制'
          })
          return false
        }
        //导入数据
        this.form3.sysError = data.map((v) => {
          return {
            code: v['返回码'],
            description: v['说明'],
            type: '1'
          }
        })
        this.$refs.sysFile.value = ''
      },
      resetService(data) {//服务级code
        //校验文件是否为空
        if (data.length < 1) {
          this.$message({
            type: 'warning',
            message: '导入失败，导入数据不可为空'
          })
          return false
        }
        //校验字段是否为空
        let size = 0
        let emptyArray = []
        let errorArray = []
        for (let i = 0, len = data.length; i < len; i++) {
          let emptyStr = '第' + (i + 1) +'行'
          let emptyArr = []
          //非空
          if (this.checkEmpty(data[i]['返回码'])) {
            size += 1
            emptyArr.push('返回码')
          }
          if (this.checkEmpty(data[i]['说明'])) {
            size += 1
            emptyArr.push('说明')
          }
          //长度
          if ((data[i]['返回码'] && data[i]['返回码'].length > 10) || (data[i]['说明'] && data[i]['说明'].length > 50)) {
            errorArray.push(i + 1)
          }
          if (size > 3) {
            emptyArray = ['必填字段']
            break
          } else if (emptyArr.length > 0){
            emptyStr += emptyArr.join('、')
            emptyArray.push(emptyStr)
          }
        }
        if (size > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，' + emptyArray.join() + '不可为空'
          })
          return false
        }
        //校验字段是否超长
        if (errorArray.length > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，第' + errorArray.join() + '行数据格式错误，字符超过限制'
          })
          return false
        }
        //导入数据
        this.form3.serviceError = data.map((v) => {
           return {
            code: v['返回码'],
            description: v['说明'],
            type: '2'
          }
        })
        this.$refs.serviceFile.value = ''
      },
      resetSuccess(data) {
        //校验文件是否为空
        if (data.length < 1) {
          this.$message({
            type: 'warning',
            message: '导入失败，导入数据不可为空'
          })
          return false
        }
        //校验字段是否为空
        let size = 0
        let emptyArray = []
        let errorArray = []
        for (let i = 0, len = data.length; i < len; i++) {
          let emptyStr = '第' + (i + 1) +'行'
          let emptyArr = []
          //非空
          if (this.checkEmpty(data[i]['返回码'])) {
            size += 1
            emptyArr.push('返回码')
          }
          if (this.checkEmpty(data[i]['说明'])) {
            size += 1
            emptyArr.push('说明')
          }
          //长度
          if ((data[i]['返回码'] && data[i]['返回码'].length > 10) || (data[i]['说明'] && data[i]['说明'].length > 50)) {
            errorArray.push(i + 1)
          }
          if (size > 3) {
            emptyArray = ['必填字段']
            break
          } else if (emptyArr.length > 0){
            emptyStr += emptyArr.join('、')
            emptyArray.push(emptyStr)
          }
        }
        if (size > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，' + emptyArray.join() + '不可为空'
          })
          return false
        }
        //校验字段是否超长
        if (errorArray.length > 0) {
          this.$message({
            type: 'warning',
            message: '导入失败，第' + errorArray.join() + '行数据格式错误，字符超过限制'
          })
          return false
        }
        //导入数据
        this.form3.successCode = data.map((v) => {
          return {
            code: v['返回码'],
            description: v['说明'],
            type: '3'
          }
        })
        this.$refs.successFile.value = ''
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

<style scoped>
  button a {
    color: #606266;
  }
  button:hover a {
    color: #3a8ee6;
  }
  .box-outer{
    table-layout: fixed;
  }
  .search-box{
    width: 100%
  }
  .btn-box{
    vertical-align: top;
    height: 100%;
  }
  .btnhide{
    position: absolute;
    right: 0;
    height: 0;
    bottom: 0;
  }
  .btnhide{
    width: 0;
  }
  .text-gray{
    color: #999;
  }
 
</style>


