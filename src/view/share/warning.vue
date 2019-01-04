<template>
  <div>
    <div class="page-title">预警号码管理</div>
    <div class="main-container pt-twoline-nomar">
      
      <div class="btn-box">
        <el-button size="mini" class="operateBtn" @click="addWarn"><i class="iconfont icon-tianjiashoujihao_huaban"></i> 添加预警号码</el-button>
      </div>
      <el-table :data="list"  border>
        <el-table-column  fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="姓名" prop="userName"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="手机号" prop="mobile"  :show-overflow-tooltip="true"></el-table-column>
        </el-table-column>
        <el-table-column label="操作"  width="160">
          <template slot-scope="scope">
              <a  @click="editWarn(scope.row)">修改</a>
              <span class="btn-space" ></span>
              <a  @click="toDetail(scope.row)">查看</a>
              <span class="btn-space" ></span>
              <a  @click="removeWarn(scope.row)" >删除</a>
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
    
    <el-dialog :visible.sync="showWarn" :title="warningTitle" :append-to-body="true" width="500px">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="姓名：" prop="userName">
            <el-input size="mini" v-model="form.userName" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input size="mini"  v-model="form.mobile" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="validate">
            <el-input size="mini" type="text" v-model="form.validate" class="br-none">
              <template slot="append"><el-button class="operateBtn" type="mini" @click="sendVerifyCode" :disabled="codeDisabled"><span v-if="codeDisabled"> {{count}} 秒后</span>发送验证码</el-button></template>
            </el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button type="primary" size="mini" @click="ensure">确定</el-button>
            <el-button  size="mini" @click="cancel">取消</el-button>
          </div>
        </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showDetailDialog" title="预警号码详情" :append-to-body="true" width="500px">
      <el-form :model="detailData"  ref="detailData" label-width="100px">
        <el-form-item label="姓名：" >
          {{detailData.userName}}
        </el-form-item>
        <el-form-item label="手机号：">
          {{detailData.mobile}}
        </el-form-item>
       <!--  <div class="dialog-footer">
          <el-button type="primary" size="mini" @click="cancel3">确定</el-button>
        </div> -->
      </el-form>
    </el-dialog>
  
  </div>
</template>

<script>
  import { warningPhoneList, addWarningPhone, editWarningPhone, delWarningPhone, warningPhoneDetail, sendVerifyCode } from '@/api/share/index';

  export default {
    name: 'myWarning',
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
        count: 60,
        codeDisabled: false,
        total: 0,
        list: [],
        selection: [],
        form: {
          userName: '',
          mobile: ''
        },
        page: {
          page: 1,
          size: 10
        },
        showWarn: false,
        showDetailDialog: false,
        detailData: {},
        rules: {
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: this.checkPhone, trigger: 'blur'}
          ]
        },
        warningTitle: '',
        warnItem: {}
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      getList() {
        warningPhoneList(this.page).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
      },
      checkPhone(rule, value, callback) {
        let patt1 = /^1[3,4,5,7,8,9][0-9]{9}$/g
        if (value == null || value == '' || value == undefined) {
          callback()
        } else if (patt1.test(value)) {
          callback()
        } else {
          callback(new Error('手机号格式不正确'))
        }
      },
      toDetail(data) {
        warningPhoneDetail(data.id).then( res=> {
          this.showDetailDialog = true
          this.detailData = res.data
        })
      },
      addWarn() {
        this.warningTitle = '新增预警号码'
        this.showWarn = true
        this.count = 60
        this.codeDisabled = false

        if(this.$refs.form != undefined) {
          this.$refs.form.resetFields()
          this.form = {}
        }
      },
      editWarn(data) {
        this.count = 60
        this.codeDisabled = false
        this.warningTitle = '修改预警号码'
        this.showWarn = true
        this.warnItem = data
        this.form = JSON.parse(JSON.stringify(data))
      },
      ensure() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if(this.warningTitle == '新增预警号码') {
              addWarningPhone(this.form).then(resp => {
                if (resp.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '新增成功'
                  })
                  this.$refs.form.resetFields()
                  this.showWarn = false
                  this.getList()
                } else {
                  this.$message({
                    type: 'error',
                    message: resp.message
                  })
                }
              })
            } else if(this.warningTitle == '修改预警号码') {
              let param = Object.assign({},{id: this.warnItem.id}, this.form)
              editWarningPhone(param).then(resp => {
                if (resp.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                  this.$refs.form.resetFields()
                  this.showWarn = false
                  this.getList()
                } else {
                  this.$message({
                    type: 'error',
                    message: resp.message
                  })
                }
              })
            }
          }
        })
      },
      removeWarn(data) {
        this.$confirm('确认删除该预警号码？', '确认', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          delWarningPhone(data.id).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
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
      sendVerifyCode() {
        let param = {
          userName: this.form.userName,
          mobile: this.form.mobile
        }
        sendVerifyCode(param).then(res => {
          if(res.code == 200) {
            this.codeDisabled = true
            let _this = this
            let time = setInterval( () => {
              _this.count--
              if(_this.count == 0) {
                clearInterval(time)
                _this.codeDisabled = false
                _this.count = 60
              }
            }, 1000)
          } else {
            this.$message({
                type: 'error',
                message: res.message
              })
          }
        })
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      cancel() {
        this.showWarn = false
        this.showDetailDialog = false
      }
     
    }
  }
</script>

<style scoped>

  .btn-box { 
    margin-bottom: 20px;
  }
  .btn-space{
    margin: 0 3px;
  }
  .dialog-footer {
    text-align: right;
  }
</style>


