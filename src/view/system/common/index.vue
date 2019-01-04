<template>
  <div>
    <div class="main-container">
      <p class="tab">
        <span :class="tabNum == 1 ? 'active' : ''" @click="changeTab(1)">联系方式</span>
        <span :class="tabNum == 2 ? 'active' : ''" @click="changeTab(2)">API定价</span>
        <span :class="tabNum == 3 ? 'active' : ''" @click="changeTab(3)">数据定价</span>
      </p>


      <div class="btn-box" v-if="tabNum == 1">
        <el-button size="mini" class="operateBtn" @click="addRecord"><i class="iconfont icon-tianjialianxiren_huaban"></i> 添加联系人</el-button>
      </div>
      <el-table :data="list"  border v-show="tabNum == 1">
        <el-table-column  type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column label="对象" prop="type"  >
          <template slot-scope="scope">
            <span v-if="scope.row.type == '1'">API</span>
            <span v-if="scope.row.type == '2'">数据</span>
            <span v-if="scope.row.type == '3'">文档</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contacts" ></el-table-column>
        <el-table-column label="联系电话" prop="phone"  ></el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" class="status-success">启用</span>
            <span v-if="scope.row.status == '2'" class="status-error">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="120" >
          <template slot-scope="scope" >
              <a   v-if="scope.row.status == 2" @click="changeStatus(scope.row, 1)">启用</a>
              <a  v-if="scope.row.status == 1" @click="changeStatus(scope.row, 2)">禁用</a>
              <span class="btn-space"  v-if="scope.row.status == 2"></span>
              <a    v-if="scope.row.status == 2" @click="changeStatus(scope.row, 3)">删除</a>
            </template>
        </el-table-column>
      </el-table>

      <div class="" v-if="tabNum == 2 || tabNum == 3">
        <p v-if="tabNum == 2" class="title">
          基础接口调用定价
        </p>
        <p v-if="tabNum == 3" class="title">
          定制报表下载定价
        </p>
        <el-form ref="form2" :model="form2" :rules="rules2" label-width="100px">
          <el-form-item label="是否收费："  class="small-line is-required">
            <el-radio v-model="form2.isFree" label="1">是</el-radio>
            <el-radio v-model="form2.isFree" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="收费标准：" prop="price" v-if="form2.isFree == '1'">
            <el-input size="mini" class="small-input" v-model="form2.price">
              <template slot="append">水利币/次</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

     

      <div class="footerPage" v-if="tabNum == 4">
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

    <div class="foot-btn" v-if="tabNum != 1">
      <el-button size="mini" type="primary" @click="resetMoney('form2')">确定</el-button>
      <el-button size="mini" @click="cancelMoney">取消</el-button>
    </div>

    <el-dialog title="添加联系人" :visible="showMoney" width="500px" :append-to-body="true" @close="cancel">
       <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
        
         <el-form-item label="对象：">
           API
         </el-form-item>
         <el-form-item label="联系人：" prop="contacts">
           <el-input size="small" v-model="addForm.contacts" placeholder="请输入联系人" maxlength="20"></el-input>
         </el-form-item>
         <el-form-item label="联系电话：" prop="phone">
           <el-input size="small" v-model="addForm.phone" placeholder="请输入联系电话"></el-input>
         </el-form-item>
       </el-form>
       <div class="dialog-footer">
         <el-button type="primary" size="small" @click="ensure">确定</el-button>
         <el-button  size="small" @click="cancel">取消</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getContactList, addContact, changeContactStatus, setApiMoney, setDataMoney, getApiMoney,getDataMoney } from '@/api/system/common/index';
  export default {
    name: 'moneyManager',
    components: {
    },
    props: {

    },
    created() {
    },
    mounted() {
      this.getList()
    },
    activated() {
      if (this.$route.params.type == 'init') {
        this.getList()
      }
    },
    watch:{
    },
    data() {
      return {
        total: 0,
        tabNum: 1,
        showMoney: false,
        isChooseUser: false,
        userId: '',
        list: [],

        form: {
          applicationStatus: '4' 
        },
        form2: {
          isFree: '1',
          payStandard: 0
        },
        addForm: {

        },
        rules2: {
          price: [
            {required: true, message: '请输入收费标准', trigger: 'blur'},
            {validator: this.checkPay, trigger: 'change'}
          ]
        },
        addRules: {
          contacts: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: this.checkPhone, trigger: 'blur'}
          ]
        },
        page: {
          page: 1,
          size: 10
        }
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      getList() {
        if(this.tabNum == 1) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
         
          getContactList(this.page).then((resp) => {
            this.list = resp.data
            this.total = resp.data.total
            loading.close()
          }).catch(error => {
            loading.close()
          })
        } else if(this.tabNum == 2) {
          getApiMoney().then(res => {
            this.form2.isFree = res.data.list[0].isCost
            this.form2.price = res.data.list[0].payStandard
          })
        } else if(this.tabNum == 3) {
          getDataMoney().then(res => {
            this.form2.isFree = res.data.list[0].isCost
            this.form2.price = res.data.list[0].payStandard
          })
        }
        
      },
      search() {
        this.getList()
      },
      reset() {
        this.form = {}
        this.createTime = []
        this.grantTime = []
      },
      changeStatus(data, type) {
        let confirMsg = type == 1 ? '确认启用该联系人？' : (type == 2 ? '确认禁用该联系人？' : '确认删除该联系人？')
        let info = type == 1 ? '启用成功' : (type == 2 ? '禁用成功' : '删除成功')
        this.$confirm(confirMsg, '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            id: data.id,
            status: type
          }
          changeContactStatus(param).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: info
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        })
      },
      
      checkPay(rule, value, callback) {
        value += ''
        //收费标准
        if(/[^\d^\.]+/g.test(value)) {

          this.form2.price = value.replace(/[^\d^\.]+/g,'')
          callback()
          
        } else if(value.indexOf('.') > -1 && value.charAt(0) !== '.'){
          //有小数点
          this.form2.price = value.slice(0,value.indexOf('.')+3)
          callback()
        } else if(value.indexOf('.') < 0) {
          //没有小数点
          this.form2.price = value.slice(0,6)
          callback()
        } else if(value.charAt(0) == '.'){
          //没有整数，有小数点
          this.form2.price = '0'+value
          callback()
        } else {
          callback()
        }
      },

      changeTab(num) {
        this.tabNum = num
        this.form2 = {
          isFree: '1',
          price: ''
        }
        this.getList()
      },
      addRecord() {
        this.showMoney = true
      },
      cancel() {
        this.showMoney = false
        this.$refs.addForm.resetFields()
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      checkPhone(rule, value, callback) {
        if (value == '' || value == null || value == undefined) {
          callback()
        } else if (!/^1[3,4,5,7,8,9]\d{9}$/.test(value) && !/^\d{3,4}\-\d{7,8}$/.test(value)){
          callback(new Error('联系电话格式错误'))
        } else {
          callback()
        }
      },
      ensure() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let param = {
              type: 1,
              contacts: this.addForm.contacts,
              phone: this.addForm.phone
            }
            addContact(param).then(resp => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.$refs.addForm.resetFields()
                this.showMoney = false
                this.getList()
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
      cancelMoney() {
        this.getList()
      },
      resetMoney(formName) {
        this.$refs.form2.validate((valid) => {
          if (valid) {
            this.$confirm('确认更新定价？', '确认', {
              cancelButtonClass: 'btn-custom-cancel'
            }).then(() => {
              if (this.tabNum == 2) {
                setApiMoney(this.form2).then(resp => {
                  if (resp.code == 200) {
                     this.$message({
                      type: 'success',
                      message: '设置成功'
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: resp.message
                    })
                  }
                })
              } else {
                setDataMoney(this.form2).then(resp => {
                  if (resp.code == 200) {
                     this.$message({
                      type: 'success',
                      message: '设置成功'
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: resp.message
                    })
                  }
                })
              }//
            }) 
          } 
        })
      }
    }
  }
</script>

<style scoped lang="less">

  .btn-box { 
    margin-bottom: 20px;
  }
  .btn-space{
    margin: 0 3px;
  }
  .search-box{
    width: 145px;
    text-align: right;
  }
  .user-list {
    position: absolute;
    width: 360px;
    max-height: 250px;
    overflow: auto;
    border: 1px solid #ccc;
    border-bottom: none;
    z-index: 10;
    line-height: 30px;
    background: #fff;
    span {
      display: inline-block;
      width: 358px;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #ccc;
    }
    span:hover {
      background: #f3f3f3;
    }
  }
  .dialog-footer {
    text-align: right;
  }
  .title {
    margin-left: 8px;
    padding-left: 7px;
    line-height: 14px;
    color: #333;
    border-left: 3px solid  #009dec;
  }
  .small-input {
    width: 220px;
  }
  .small-line {
    line-height: 18px;
    margin-bottom: 10px;
  }
  .foot-btn {
    text-align: right;
    margin-right: 15px;
  }
</style>


