<template>
  <div class="wrap">
    <el-row :gutter="50">
      <el-col :span="24" style="margin-left: 18px;">
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click="handlerAdd" size="small" >添加</el-button>
          <el-button type="primary"  icon="el-icon-edit" @click="handlerEdit" size="small" >编辑</el-button>
          <el-button type="primary"  icon="el-icon-delete" @click="handleDelete" size="small">删除</el-button>
          <el-button type="primary"  @click="handlerAuthority" icon="el-icon-menu" size="small" >菜单分配</el-button>
          <el-button type="primary" @click="handlerUser" icon="el-icon-setting" size="small" >关联用户</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="8" style='margin-top:15px;margin-left:16px;'>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"> </el-input>
        <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all check-strictly> </el-tree>
      </el-col>
      <el-col :span="14" style='margin-top:15px;'>
        <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" :rules="rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入用户名称" size="small"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入用户编码" size="small"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" :disabled="formEdit" placeholder="请输入用户描述" size="small"></el-input>
          </el-form-item>
          <el-form-item v-if="formStatus == 'update'">
            <el-button type="primary" @click="update('form')" size="small">更新</el-button>
            <el-button @click="onCancel" size="small">取消</el-button>
          </el-form-item>
          <el-form-item v-if="formStatus == 'create'">
            <el-button type="primary"  @click="create('form')" size="small">保存</el-button>
            <el-button @click="onCancel" size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <template v-if="dialogUserVisible">
        <el-dialog title="关联用户" :visible.sync="dialogUserVisible" width="30%" :append-to-body="true">
          <authority-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></authority-user>
        </el-dialog>
      </template>
      <template v-if="dialogAuthorityVisible">
        <el-dialog title="菜单分配" :visible.sync="dialogAuthorityVisible" width="30%" :append-to-body="true">
          <authority-resource :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></authority-resource>
        </el-dialog>
      </template>
    </el-row>
  </div>
</template>

<script>
  import {
    fetchTree,
    getObj,
    putObj,
    addObj,
    delObj
  } from '@/api/system/authority/index'
  import { mapGetters } from 'vuex';

export default {
  name: 'roleManager',
  components: {
    'authority-user': () => import('./authorityUser'),
    'authority-resource': () => import('./authorityResource')
  },
  data() {
    return {
      add_role: true,
      edit_role: true,
      del_role: true,
      associate_auth: true,
      associate_user: true,
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogUserVisible: false,
      dialogAuthorityVisible: false,
      form: {
        code: '',
        name: '',
        description: ''
      },

      rules: {
        code: [
          {required: true, message: '请输入用户编码', trigger: 'blur' }
        ],
        name: [
          { required: true,  message: '请输入用户名称', trigger: 'blur'}
        ]
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    },
    $route() {
      this.getList()
    }
  },
  created() {
    this.getList();
  },
  computed: {
  },
  methods: {
    getList() {
      fetchTree().then(res => {
        this.treeData = res.data
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.roleName.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      getObj(data.id).then(res => {
        this.form = res.data;
      });
      this.currentId = data.id;
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      } else {
        this.$message('请选择角色');
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = 'create';
    },
    handleDelete() {
      if(this.currentId == -1) {
        this.$message('请选择角色');
      } else {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(res => {
            if(res.code == 200) {
              this.currentId = -1;
              this.getList();
              this.resetForm();
              this.formEdit = true;
              this.formStatus = '';
              this.handleSuccess(res);
            } else {
              this.handleError(res);
            }
          });
        }).catch(error => {
            console.log(error);
          });
      }
    },
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.currentId, this.form).then(res => {
            if(res.code == 200) { 
              this.formEdit = true;
              this.formStatus = '';
              this.getList();
              this.handleSuccess(res)
            } else {
              this.handleError(res)
            }
          })
        } else {
          return false
        }
      })
    },
    create(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.form).then(res => {
            if(res.code == 200) {
              this.formEdit = true;
              this.formStatus = '';
              this.getList();
              this.handleSuccess(res);
            } else {
              this.handleError(res);
            }
          })
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = '';
      this.$refs.form.resetFields();
      if(this.currentId !== -1) {
        getObj(this.currentId).then(response => {
          this.form = response.data;
        });
      }
    },
    resetForm() {
      this.form = {
        code: '',
        name: '',
        description: ''
      };
    },
    handlerUser() {
      if(this.currentId == -1) {
        this.$message('请选择角色');
      } else {
        this.dialogUserVisible = true;
      }
      
    },
    handlerAuthority() {
      if(this.currentId == -1) {
        this.$message('请选择角色');
      } else {
        this.dialogAuthorityVisible = true;
      }
    },
    closeUserDialog() {
      this.dialogUserVisible = false;
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false;
    }
  }
}
</script>

<style scoped>
  .el-tree {
    border: 1px solid #dcdfe6;
  }
  .wrap {
    background-color: #fff;
    height: 100%;
    padding: 20px;
  }
</style>
