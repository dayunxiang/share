<template>
	<div>
		<el-form label-width="100px" ref='searchForm' :model="searchForm">
      <el-form-item label="单位名称">
        <el-select v-model="searchForm.unit" placeholder="请选择" size="small">
    <el-option v-for="item in unitOptions" :value="item" :label="item" :key="item"></el-option>
  </el-select>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="reset()" size="small">重置</el-button>
      <el-button @click="search()" type="primary" size="small">确定</el-button>
    </div>
	</div>
</template>

<script>
export default {
	data() {
		return {
      unitOptions: ['江西省水投生态资源开发集团有限公司', '江西省水务集团有限公司', '江西省水投建设有限公司'],
      searchForm: {
        unit: undefined
      }
		}
	},
  methods: {
    reset() {
      this.resetForm()
    },
    search() {
      this.$emit('changeCardVisible')
    },
    resetForm() {
      this.searchForm = {
        unit: undefined
      }
    }
  }
}
</script>

<style scoped>
</style>
