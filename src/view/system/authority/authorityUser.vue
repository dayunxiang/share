<template>
<el-form label-width="80px">
  <el-form-item label="用户名称">
    <el-select v-model="leaders" multiple filterable remote  placeholder="请输入关键词" :remote-method="remoteLeaderMethod" :loading="loading" collapse-tags>
      <el-option v-for="item in lItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item class="footer">
    <el-button type="primary" @click="onSubmit" size="small">保存</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import {
  getDepts,
  modifyDepts,
  getDeptByName
} from '@/api/system/authority/index'

export default {
  name: 'groupUser',
  props: {
    groupId: {
      default: -1
    }
  },
  data() {
    return {
      lItems: [],
      leaders: [],
      list: [],
      loading: false
    }
  },
  created() {
    this.initUsers()
    this.remoteLeaderMethod('')
  },
  computed: {
   
  },
  methods: {
    remoteLeaderMethod(query) {
        this.loading = true
        setTimeout( () => {
          getDeptByName({
            name: query,
            page: 1,
            size: 9999
          })
          .then(response => {
            this.lItems = response.data.list
            this.loading = false
          })
        },200)
    },
    onSubmit() {
      let vals = []
      if (this.leaders.length > 0) {
        vals = this.leaders.join();
      }
      modifyDepts(this.groupId, vals).then(res => {
        if(res.code == 200) {
          this.$emit('closeUserDialog');
          this.handleSuccess(res);
        } else {
          this.handleError(res);
        }
      })
    },
    initUsers() {
      getDepts(this.groupId).then(response => {
        this.lItems = response.data
        //console.log(this.lItems)
        const leas = []
        for (let i = 0; i < this.lItems.length; i++) {
          leas.push(this.lItems[i].userId)
        }
        this.leaders = leas
        console.log('---',leas)
      })
    }
  }
}
</script>