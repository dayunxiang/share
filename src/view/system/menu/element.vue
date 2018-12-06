<template>
<div>
  <div style="padding: 14px 0;">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入资源名称" v-model="listQuery.name" size="small"> </el-input>
    <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter" size="small">搜索</el-button>
    <el-button class="filter-item"  v-if="elements['add_element:btn']"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus" size="small">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column width="65" type="index" label="序号"></el-table-column>
    <!-- <el-table-column align="center" label="id" width="65">
      <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
    </el-table-column> -->
    <el-table-column width="200px" align="center" label="资源编码">
      <template slot-scope="scope"><span>{{scope.row.code}}</span></template>
    </el-table-column>
    <el-table-column width="200px" align="center" label="资源类型">
      <template slot-scope="scope"><span>{{scope.row.type}}</span></template>
    </el-table-column>
    <el-table-column width="200px" align="center" label="资源名称">
      <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
    </el-table-column>
    <el-table-column min-width="200px" align="center" label="资源地址">
      <template slot-scope="scope"><span>{{scope.row.uri}}</span></template>
    </el-table-column>
    <el-table-column width="100px" align="center" label="资源请求类型">
      <template slot-scope="scope"><span>{{scope.row.method}}</span></template>
    </el-table-column>
    <el-table-column width="200px" align="center" label="描述">
      <template slot-scope="scope"><span>{{scope.row.description}}</span></template>
    </el-table-column>
    <el-table-column fixed="right" align="center" label="操作" width="150">
      <template slot-scope="scope">
        <el-button v-if="elements['edit_element:btn']" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="elements['del_element:btn']" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <template v-if="dialogFormVisible">
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-form-item label="资源编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入资源编码"></el-input>
      </el-form-item>
      <el-form-item label="资源类型" prop="type">
        <el-select class="filter-item" v-model="form.type" placeholder="请输入资源类型">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item label="资源地址" prop="uri">
        <el-input v-model="form.uri" placeholder="请输入资源地址"></el-input>
      </el-form-item>
      <el-form-item label="资源请求类型" prop="method">
        <el-select class="filter-item" v-model="form.method" placeholder="请输入资源请求类型">
          <el-option v-for="item in  methodOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入资源描述"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')" size="small">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" size="small">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')" size="small">确 定</el-button>
    </div>
  </el-dialog>
  </template>
</div>
</template>
<script>
import {
page,
addObj,
getObj,
delObj,
putObj
} from '@/api/system/menu/element/index';
import { mapGetters } from 'vuex';
export default {
  name: 'buttonElement',
  data() {
    return {
    menuId: -1,
    methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
    typeOptions: ['uri', 'button'],
    form: {
      code: undefined,
      type: undefined,
      name: undefined,
      uri: undefined,
      menuId: undefined,
      method: undefined,
      description: undefined
    },
    rules: {
    code: [{
      required: true,
      message: '请输入资源编码',
      trigger: 'blur'
    },{
      min: 3,
      max: 50,
      message: '长度在 3 到 50 个字符',
      trigger: 'blur'
    }
    ],
    type: [{
      required: true,
      message: '请输入资源类型',
      trigger: 'blur'
    }
    ],
    name: [{
      required: true,
      message: '请输入资源名称',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 20,
      message: '长度在 2 到 20 个字符',
      trigger: 'blur'
    }
    ],
    uri: [{
      required: true,
      message: '请输入资源地址',
      trigger: 'blur'
    }],
    method: [{
      required: true,
      message: '请输入资源请求类型',
      trigger: 'blur'
    }]
    },
    list: null,
    total: null,
    listLoading: true,
    listQuery: {
      page: 1,
      limit: 20,
      name: undefined,
      menuId: this.menuId
    },
    dialogFormVisible: false,
    dialogStatus: '',
   /* menuManager_btn_element_add: false,
    menuManager_btn_element_edit: false,
    menuManager_btn_element_del: false,*/
    textMap: {
      update: '编辑',
      create: '添加'
    },
    tableKey: 0
    }
  },
  created() {
    this.getList();
    /*this.menuManager_btn_element_add = this.elements['menuManager:btn_element_add'];
    this.menuManager_btn_element_del = this.elements['menuManager:btn_element_del'];
    this.menuManager_btn_element_edit = this.elements['menuManager:btn_element_edit'];*/
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.menuId = this.menuId;
      page(this.listQuery).then(response => {
        this.list = response.data;
        this.total = response.data.length;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id).then(res => {
        this.form = res.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
        delObj(row.id).then(res => {
          if(res.code == 200) {
            this.handleSuccess(res);
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
            this.getList();
          } else {
            this.handleError(res);
          }
        });
      }).catch(error => {
        console.log(error);
      });
    },
    create(formName) {
      const set = this.$refs;
      this.form.menuId = this.menuId;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(res => {
            if(res.code == 200) {
              this.dialogFormVisible = false;
              this.getList();
              this.handleSuccess(res);
            } else {
              this.handleError(res);
            }
          })
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      this.form.menuId = this.menuId;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(res => {
            if(res.code == 200) {
              this.dialogFormVisible = false;
              this.getList();
              this.handleSuccess(res);
            } else {
              this.handleError(res);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetTemp() {
      this.form = {
      code: undefined,
      type: undefined,
      name: undefined,
      uri: undefined,
      menuId: undefined,
      method: undefined,
      description: undefined
      };
    }
  }
}
</script>