<template>
  <div style="position: relative; height: calc(100vh - 90px);">
    <div class="page-title">数据字典</div>
    <div class="dict-tree">
      <p class="title">
        <span>数据类型</span>
        <span class="add-btn" @click="addType">+</span>
      </p>
      <div class="scroll-hide">
        <ul class="dict-list">
          <li v-for="item in dictTypeList" :key="item.id" :class="{active: item.actived}" @click="changeDictType(item)">
            <span>
              {{item.value}}
              <small @click.stop="deleteType(item)">X</small>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="dict-main">
      <p class="btn-group">
        <el-button size="mini" class="operateBtn" @click="addDict"><i class="iconfont  icon-tianjiazidian_huaban"></i> 添加</el-button>
        <el-button size="mini" class="operateBtn" @click="changeStatus(0)"><i class="iconfont  icon-jinyongzidian_huaban"></i> 禁用</el-button>
        <el-button size="mini" class="operateBtn" @click="changeStatus(1)"><i class="iconfont  icon-qiyongzidian_huaban"></i> 启用</el-button>
      </p>  
      <el-table :data="list" @selection-change="selectChange"  border >
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" width="70"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="dicValue" label="数据类型"></el-table-column>
        <el-table-column prop="status" label="状态" width="70">
          <template slot-scope="scope">
             <span v-if="scope.row.status == 0" class="status-error">禁用</span>
             <span v-if="scope.row.status == 1" class="status-success">启用</span>
           </template>
        </el-table-column>
        <el-table-column prop="lastUpdator" label="最后操作人"></el-table-column>
        <el-table-column prop="lastOperationDate" label="最后操作时间" width="180"></el-table-column>
        <el-table-column prop="" label="操作" width="120">
           <template slot-scope="scope">
             <a @click="dictDetail(scope.row)">查看<span class="btn-space"></span></a>
             <a @click="editDict(scope.row)">修改</a>
           </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :visible.sync="showDictType" title="新增类型" :append-to-body="true" width="500px">
      <el-form :model="addTypeForm" :rules="addTypeRules" ref="addTypeForm" label-width="100px">
        <el-form-item label="类型名称：" prop="value">
          <el-input size="mini" v-model="addTypeForm.value"></el-input>
        </el-form-item>
        <el-form-item label="类型编码：" prop="code">
          <el-input size="mini" v-model="addTypeForm.code"></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" size="small" @click="ensure">确定</el-button>
          <el-button  size="small" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showDict" :title="dictTitle" :append-to-body="true" width="500px">
      <el-form :model="addDictForm" :rules="addDictRules" ref="addDictForm" label-width="100px">
        <el-form-item label="所属类型：" >
          {{dictType}}
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input size="mini" v-model="addDictForm.name"></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="note">
          <el-input size="mini" type="textarea" v-model="addDictForm.note" :rows="4"></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" size="mini" @click="doAdd">确定</el-button>
          <el-button  size="mini" @click="cancel2">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showDetail" title="字典详情" :append-to-body="true" width="500px">
      <el-form :model="detailForm"  ref="detailForm" label-width="100px">
        <el-form-item label="所属类型：" >
          {{dictType}}
        </el-form-item>
        <el-form-item label="名称：" >
          {{detailForm.name}}
        </el-form-item>
        <el-form-item label="说明：" >
          {{detailForm.note}}
        </el-form-item>
       <!--  <div class="dialog-footer">
          <el-button type="primary" size="mini" @click="cancel3">确定</el-button>
        </div> -->
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {getDictList, getDictDetailList, addDictType, deleteDictType, addDictDetail, changeDictStatus, editDictDetail } from '@/api/dict/index';
  export default {
    name: 'dictManager',
    components: {
    },
    props: {

    },
    created() {
    },
    mounted() {
     // this.getList()
      this.getDictType()
    },
    activated() {
      if (this.$route.params.type == 'init') {
       // this.getList()
      }
    },
    watch:{
    },
    data() {
      return {
        total: 0,
        tabNum: 1,
        list: [],
        timeTitle: '申请时间',
        selection: [],
        dictTypeList: [],
        addTypeForm: {},
        addDictForm: {},
        detailForm: {},
        addTypeRules: {
          value: [
            {required: true, message: '请输入类型名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入类型编码', trigger: 'blur'}
          ]
        },
        addDictRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
        showDictType: false, //显示、隐藏新增类型弹框
        showDict: false, //显示、隐藏新增字典弹框
        showDetail: false, //显示、隐藏字典详情弹框
        dictTitle: '新增字典',
        dictType: '',
        dictCode: '',
        form: {
          status: '1' //1为基础api，2为业务api
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
      getList(obj = this.form) {
        let param = Object.assign({}, this.page, obj)
       
      },
      getDictType() {
        getDictList().then(resp => {
          this.dictTypeList = resp.data
          this.dictTypeList[0].actived = true
          this.changeDictType(this.dictTypeList[0])
        })
      },
    
      close(data) {
        this.$confirm('确认关闭该工单？', '确认').then(() => {
          closeOrder(data.id).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '关闭成功'
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
      changeDictType(data) {
        let newIndex = -1
        let oldIndex = -1
        this.dictTypeList.forEach((v, index) => {
          if (v.actived) {
            oldIndex = index
          }
          if (v.id == data.id) {
            newIndex = index
          } 
        })
        this.$set(this.dictTypeList[oldIndex], 'actived', false)
        this.$set(this.dictTypeList[newIndex], 'actived', true)
        let param = {
          dicCode: data.code,
          page: 1,
          size: 10
        }
        getDictDetailList(param).then(resp => {
          this.list = resp.data.list
        })
        this.dictType = data.value
        this.dictCode = data.code
      },
      orderDetail(row) {
        this.$router.push({
          name: 'orderDetail',
          params: {
            id: row.id,
            type: 'detail',
            tabNum: this.tabNum
          }
        })
        
      },
      changeTab(num) {
        this.tabNum = num
        this.form.status = num
        this.getList()
        this.timeTitle = num == 3 ? '解决时间' : (num == 4 ? '关闭时间' : '申请时间')
      },
      addType() {
        this.showDictType = true
      },
      addDict() {
        this.dictTitle = '新增字典'
        this.showDict = true
      },
      editDict(data) {
        this.dictTitle = '修改字典'
        this.showDict = true
        this.addDictForm = JSON.parse(JSON.stringify(data))
      },
      ensure() {
        this.$refs.addTypeForm.validate(valid => {
          if (valid) {
            addDictType(this.addTypeForm).then(resp => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.$refs.addTypeForm.resetFields()
                this.showDictType = false
                this.getDictType()
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
      doAdd() {
        this.$refs.addDictForm.validate(valid => {
          if (valid) {
            if (this.dictTitle == '修改字典') {
               let param = {
                id: this.addDictForm.id,
                name: this.addDictForm.name,
                note: this.addDictForm.note
              }
              editDictDetail(param).then(resp => {
                if (resp.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                  this.$refs.addDictForm.resetFields()
                  this.showDict = false
                   let dictParam = {
                    dicCode: this.dictCode,
                    page: 1,
                    size: 10
                  }
                  getDictDetailList(dictParam).then(resp => {
                    this.list = resp.data.list
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: resp.message
                  })
                }
              })
            } else {
               let param = {
                dicCode: this.dictCode,
                dicValue: this.dictType,
                name: this.addDictForm.name,
                note: this.addDictForm.note
              }
              addDictDetail(param).then(resp => {
                if (resp.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '新增成功'
                  })
                  this.$refs.addDictForm.resetFields()
                  this.showDict = false
                   let dictParam = {
                    dicCode: this.dictCode,
                    page: 1,
                    size: 10
                  }
                  getDictDetailList(dictParam).then(resp => {
                    this.list = resp.data.list
                  })
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
      cancel() {
        this.$refs.addTypeForm.resetFields()
        this.showDictType = false
      },
      cancel2() {
        this.$refs.addDictForm.resetFields()
        this.showDict = false
      },
      cancel3() {
        this.showDetail = false
      },
      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      selectChange(val) {
        this.selection = val
      },
      deleteType(data) {
        this.$confirm('确认删除改数据类型？', '删除', {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          deleteDictType(data.id).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getDictType()
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        })
      },
      dictDetail(data) {
        this.showDetail = true
        this.detailForm = data
      },
      changeStatus(status) {
        if (this.selection.length == 0) {
          this.$message({
            type: 'warning',
            message: '请勾选数据'
          })
          return false
        }
        let message = status == 1 ? '请确认是否启用该字典？' : '请确认是否禁用该字典？'
        let title = status == 1 ? '启用字典' : '禁用字典'
        let successMessage = status == 1 ? '启用成功' : '禁用成功'
        this.$confirm(message, title, {
          cancelButtonClass: 'btn-custom-cancel'
        }).then(() => {
          let param = {
            status: status,
            ids: this.selection.map(v => {
              return v.id
            }).join()
          }
          changeDictStatus(param).then(resp => {
            if (resp.code == 200) {
              this.$message({
                type: 'success',
                message: successMessage
              })
              this.showDict = false
                let dictParam = {
                dicCode: this.dictCode,
                page: 1,
                size: 10
              }
              getDictDetailList(dictParam).then(resp => {
                this.list = resp.data.list
              })
            } else {
              this.$message({
                type: 'error',
                message: resp.message
              })
            }
          })
        })
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
  .dialog-footer{
    text-align: right;
  }
 
</style>


