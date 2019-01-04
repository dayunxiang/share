<template>
<div class="wrap">
  <div>
    <el-button-group>
      <el-button type="primary"   icon="el-icon-plus"  @click="handlerAdd" size="small">添加</el-button>
      <el-button type="primary"   icon="el-icon-edit"  @click="handlerEdit" size="small">编辑</el-button>
      <el-button type="primary"   icon="el-icon-delete" @click="handleDelete" size="small">删除</el-button>
    </el-button-group>
  </div>
<el-row>
  <el-col :span="6" style='margin-top:15px;'>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText" size="small">
    </el-input>
    <el-tree
      class="filter-tree"
      :data="treeData"
      node-key="id"
      highlight-current
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="menuTree"
      @node-click="getNodeData"
      default-expand-all
      >
    </el-tree>
  </el-col>
  <el-col :span="18" style='margin-top:15px;'>
     <el-card class="box-card">
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" :rules="rules">
      <el-form-item label="路径编码" prop="code">
          <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入路径编码" size="small"></el-input>
      </el-form-item>
          <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" :disabled="formEdit"  placeholder="请输入标题" size="small"></el-input>
      </el-form-item>
         <!--  <el-form-item label="父级节点" prop="parentId">
          <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
      </el-form-item> -->
       <el-form-item label="父级节点" prop="parentId">
        <template v-if="formStatus=='update' || formStatus==''" size="small">
          <el-select class="filter-item" v-model="form.parentId" placeholder="请选择父节点" :disabled="formEdit" size="small">
            <el-option :key="-1" :label="'根节点'" :value="-1"> {{"根节点"}}</el-option>
            <template v-for="item in  this.treeData">
            <el-option :key="item.id" :label="item.title" :value="item.id" v-if="!(form.title == item.title)"> {{ item.title}}</el-option>
              <template v-for="ele in  item.children">
              <el-option :key="ele.id" :label="ele.title" :value="ele.id" v-if="!(form.title == ele.title)"> {{ ele.title}}</el-option>
              <template v-for="ele in  ele.children">
              <el-option :key="ele.id" :label="ele.title" :value="ele.id" v-if="!(form.title == ele.title)"> {{ ele.title}}</el-option>
              </template>
            </template>
            </template>
        </el-select>
        </template>
        <el-select class="filter-item" v-model="form.parentId" placeholder="请选择父节点" v-if="formStatus=='create'" :disabled="formEdit" size="small">
            <el-option :key="-1" :label="'根节点'" :value="-1"> {{"根节点"}}</el-option>
            <template v-for="item in  this.treeData">
            <el-option :key="item.id" :label="item.title" :value="item.id"> {{ item.title}}</el-option>
              <template v-for="ele in  item.children">
              <el-option :key="ele.id" :label="ele.title" :value="ele.id"> {{ ele.title}}</el-option>
              <template v-for="ele in  ele.children">
              <el-option :key="ele.id" :label="ele.title" :value="ele.id"> {{ ele.title}}</el-option>
              </template>
            </template>
            </template>
        </el-select>
      </el-form-item>

      <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标" size="small"></el-input>
      </el-form-item>
          <el-form-item label="资源路径" prop="href">
          <el-input v-model="form.href" :disabled="formEdit" placeholder="请输入资源路径" size="small"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
         <el-select class="filter-item" v-model="form['type']"  :disabled="formEdit"  placeholder="请输入资源请求类型" size="small">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述"   prop="description">
          <el-input v-model="form.description" :disabled="formEdit" placeholder="请输入描述" size="small"></el-input>
      </el-form-item>
       <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" @click="update('form')" size="small">更新</el-button>
        <el-button @click="onCancel" size="small">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" @click="create('form')" size="small">保存</el-button>
        <el-button @click="onCancel" size="small">取消</el-button>
      </el-form-item>
    </el-form>
     </el-card>
    <!-- <el-card class="box-card"  >
        <span>按钮或资源</span>
      <button-element  ref="menuElement"></button-element>
    </el-card> -->
  </el-col>
</el-row>
  </div>
</template>

<script>
import {fetchTree, getObj, addObj, delObj, putObj} from '@/api/system/menu/index';
export default {
  name: 'menuManager',
  components: {
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['menu', 'dirt'],
      listQuery: {
        name: ''
      },
      form: {
        code: '',
        title: '',
        parentId: '',
        href: '',
        icon: '',
        description: '',
        type: '',
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入路径编码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur'
          }],
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }],
        parentId: [
          {
            required: true
          }],
        icon: [
          {
            required: true,
            message: '请输入图标',
            trigger: 'blur'
          }],
        href: [
        {
          required: true,
          message: '请输入资源路径',
          trigger: 'blur'
        }],
        type: [
        {
          required: true,
          message: '请选择资源请求类型',
          trigger: 'blur'
        }]
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      labelPosition: 'right',
      currentId: -1
      /*menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false*/
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
    $route(){
      this.getList()
    }
  },
  computed: {
 
  },
  created() {
    this.getList();
   /* this.menuManager_btn_add = this.elements['menuManager:btn_add'];
    this.menuManager_btn_del = this.elements['menuManager:btn_del'];
    this.menuManager_btn_edit = this.elements['menuManager:btn_edit'];*/
  },
 /* computed: {
    ...mapGetters([
      'elements'
    ])
  },*/
  methods: {
    getList() {
      fetchTree(this.listQuery).then(res => {
        this.treeData = res.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    getNodeData(data) {
      this.formEdit = true
      this.formStatus = ''
      getObj(data.id).then(res => {
        this.form = res.data;
      });
      this.currentId = data.id;
      this.showElement = true;
      // this.$refs.menuElement.menuId = data.id
      // this.$refs.menuElement.getList();
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      } else {
        this.$message('请选择菜单')
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = 'create';
    },
    handleDelete() {
      if(this.form.id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(res => {
            if(res.code == 200) {
              this.getList();
              this.resetForm();
              this.Cancel();
              this.handleSuccess(res);
            } else {
              this.handleError(res);
            }
          });
        }).catch(error => {
            console.log(error);
          });
      } else {
        this.$message('请选择菜单')
      }
    },
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          putObj(this.form.id, this.form).then(res => {
            if(res.code == 200) {
              this.getList();
              this.handleSuccess(res);
              this.formEdit = true;
              this.formStatus = '';
            } else {
              this.handleError(res);
            }
          });
          
        } else {
          return false
        }
      })
    },
    create(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
           addObj(this.form).then(res => {
            if(res.code == 200) {
              this.getList();
              this.handleSuccess(res);
              this.formEdit = true;
              this.formStatus = '';
            } else {
              this.handleError(res);
            }
          });
        } else {
          return false
        }
      })
    },
    Cancel() {
      this.formEdit = true;
      this.formStatus = '';
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
        title: '',
        parentId: this.currentId,
        href: '',
        icon: '',
        description: '',
        type: '',
      };
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

