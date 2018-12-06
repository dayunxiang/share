<template>
<el-row>
  <el-col :span="24">
    <el-button type="primary"  @click="update" size="medium">保存</el-button>
  </el-col>
  <el-col :span="24" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree class="filter-tree"  :data="treeData" show-checkbox node-key="id" highlight-current :props="defaultProps"  ref="menuTree"  default-expand-all>
    </el-tree>
  </el-col>
  <!-- <el-col :span="16" style='margin-top:15px;'>
    <el-table ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" @select-all="selectAll" style="width: 100%">
      <el-table-column  type="selection" width="55"> </el-table-column>
      <el-table-column width="200px" align="center" label="资源编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span></template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源类型">
        <template slot-scope="scope"><span>{{scope.row.type}}</span></template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源名称">
        <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源地址">
        <template slot-scope="scope"><span>{{scope.row.uri}}</span></template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源请求类型">
        <template slot-scope="scope"><span>{{scope.row.method}}</span></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </el-col> -->
</el-row>

</template>
<script>
import {
  fetchTree
} from '@/api/system/menu/index';
import {
  page
} from '@/api/system/menu/element/index';
import {
  removeElementAuthority,
  addElementAuthority,
  getElementAuthority,
  modifyMenuAuthority,
  getMenuAuthority,
  modifyElementAuthority
} from '@/api/system/authority/index';
import { mapGetters } from 'vuex';
export default {
  name: 'groupAuthority',
  props: {
    groupId: {
      default: -1
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        menuId: undefined,
        page: 1,
        limit: 20
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
     /* groupManager_menu: false,
      groupManager_element: false,*/
      currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
    this.getList();
    /*this.groupManager_menu = this.elements['groupManager:menu'];
    this.groupManager_element = this.elements['groupManager:element'];*/
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      fetchTree('').then(res => {
        this.treeData = res.data;
        this.initAuthoritys();
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      this.listQuery.menuId = data.id;
      this.getElement();
      this.currentId = data.id;
      this.showElement = true;
    },
    getElement() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data;
        this.total = response.data.length;
        this.listLoading = false;
        getElementAuthority(this.groupId).then(data => {
          const obj = {};
          for (let i = 0; i < this.list.length; i++) {
            obj[this.list[i].id] = this.list[i];
          }
          const toggle = {};
          for (let i = 0; i < data.data.length; i++) {
            const id = data.data[i]
            if (obj[id] !== undefined && toggle[id] === undefined) {
              this.$refs.elementTable.toggleRowSelection(obj[data.data[i]]);
              toggle[id] = true;
            }
          }
        });
      });
    },
    getTreeNodeKey(node) {
      return node.id;
    },
    selectAll(selection) {
      let ids = [];
      for(let ele of selection) {
        //console.log(ele);
        ids.push(ele.id);
      }
      modifyElementAuthority(this.groupId, {
        menuId: this.currentId,
        elementId: ids.join()
        }).then( res => {
          if(res.code == '200') {
            this.handleSuccess(res);
            //console.log(res);
          } else {
            this.handleError(res);
            //console.log(res);
          }
      });
    },
    handleSelectionChange(val, row) {
      let flag = true;
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === row.id) {
          addElementAuthority(this.groupId, {
            menuId: this.currentId,
            elementId: row.id
          }).then(res => {
            if(res.code == 200) {
              this.handleSuccess(res);
            } else {
              this.handleError(res);
            }
          });
          flag = false;
          break;
        }
      }
      if (flag) {
        removeElementAuthority(this.groupId, {
          menuId: this.currentId,
          elementId: row.id
        }).then(res => {
          if(res.code == 200) {
            this.handleSuccess(res);
          } else {
            this.handleError(res);
          }
        });
      }
    },
    update() {
      this.$emit('closeAuthorityDialog');
      const nodes = this.$refs.menuTree.getCheckedNodes();
      //console.log(nodes.length);
      let arr = [];
      let ids = "";
      if(nodes.length > 0) {
        for (let i = 0; i < nodes.length; i++) {
          arr.push(nodes[i].id);
          ids = arr.join();
        }
      }
      //console.log('传给后台的id'+  ids);
      modifyMenuAuthority(this.groupId, {
        menuTrees: ids
      }).then(res => {
        if(res.code == 200) {
          this.handleSuccess(res);
        } else {
          this.handleError(res);
        }
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getElement();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      //console.log(this.listQuery.page);
      this.getElement();
    },
    initAuthoritys() {
      getMenuAuthority(this.groupId).then(res => {
        //console.log(res)
        let result = [];
        for (let i = 0; i < res.data.length; i++) {
            result.push(res.data[i].id);
        }
        //console.log('后台返回的id'+  result);
        this.$refs.menuTree.setCheckedKeys(result);
      });
    }
  }
}
</script>

<style scoped>
  .el-tree {
    border: 1px solid #dcdfe6;
  }
</style>
