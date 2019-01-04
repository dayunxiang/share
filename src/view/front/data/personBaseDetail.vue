<template>
  <div class="front-index">
    <div class="front-main">
      <div class="basic-outer">
        <el-form ref="form" label-position="left" label-width="100px">
          <!-- <div class="flex-box"> -->
            <!-- <span class="red">*</span> -->
            <el-form-item label="数据类型：" prop="categoryId" class="is-required">
              <el-select  v-model="form.categoryId" size="mini" class="width-300" disabled>
                <el-option v-for="item in bigCatesArr" :label="item.tableNote" :value="item.type" :key="item.id"></el-option>
              </el-select>
              <el-select  v-model="form.propertyTableId" size="mini" class="width-300" disabled>
                <el-option v-for="item in propertyTableArr" :label="item.propertyTableName" :value="item.tableName" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          <!-- </div> -->
          <!-- <div class="flex-box"> -->
            <!-- <span class="red mr-4">*</span> -->
            <el-form-item label="字段：" prop="checkedFileds" class="is-required">
              <div class="field-color" v-if="form.propertyTableId">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" disabled>全选</el-checkbox>
                <el-checkbox-group v-model="form.checkedFileds" disabled>
                  <div v-for="(field, index) in fieldsArr" :key="field.id" class="mr-30 line-block">
                    <el-checkbox :label="field" :checked="field.checked">{{field.wordExplain}}</el-checkbox>
                    <!-- <div class="bigCircle" @click="defineField(field)"><div class="smallCircle"></div></div> -->
                  </div>
                </el-checkbox-group>
              </div>
            </el-form-item>
          <!-- </div> -->
        </el-form>
      </div>
      <div class="btn-outer"></div>
      <div class="basic-outer">
        <el-button class="download-btn" size="small" @click="download" type="primary">下载数据</el-button>
        
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
  import { getToken } from '@/utils/auth';
  export default {
    components: {

    },
    mounted() {
    	this.id = this.$route.query.id
      //this.getUserInfo()
      this.getDetail()
    },
    watch: {
      $route() {
        this.id = this.$route.query.id
        this.getDetail()
      }
    },
    data() {
      return {
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
          this.form = Object.assign({},param.fields)
          // this.form = {
          //   name: param.name,
          //   shortDescription: param.shortDescription,
          //   isFree: param.isFree,
          //   picId: param.picId,
          //   picPath: param.picPath,
          //   payStandard: param.payStandard,
          //   type: param.type.split(',')
          // 
         

          this.form.categoryId = param.mainType
          this.form.propertyTableId = param.subTableName
          getSonCates(param.mainType).then( res => {
            this.propertyTableArr = res.data
           
           
            getFields(param.subTableName).then( res => {
              this.fieldsArr = res.data
              
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

              if(this.fieldsArr.length == this.selectedKeys) {
                this.checkAll = true
              }
              //this.$nextTick(() => {
                this.form.checkedFileds = JSON.parse(JSON.stringify(this.selectedKeys))
              //}, 1)
              
              //console.log(this.fieldsArr)
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
      download() {
        getUserInfoDetail().then( res => {
          if(res.code == 200) {
            window.location.href = '/webapp/data/form_excel?id=' + this.id
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
  .basic-outer .download-btn {
    margin-bottom: 20px;
  }
</style>




