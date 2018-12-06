<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="单位名称" prop="unit">
        <el-input v-model="form.unit" placeholder="请输入单位名称"></el-input>
      </el-form-item>
      <el-form-item label="单位地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入单位地址"></el-input>
      </el-form-item>
       <el-form-item label="电话" prop="tel">
        <el-input v-model="form.tel" placeholder="请输入电话"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="cancel('form')">取消</el-button>
      <el-button v-if="this.dialogStatus=='create'" @click="create('form')" type="primary">确定</el-button>
      <el-button v-if="this.dialogStatus=='update'" @click="update('form')" type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      rowId: {
        type: Number
      },
      row: {
        type: Object
      },
      dialogVisible: {
        type: Boolean
      },
      dialogStatus: {
        type: String
      }
    },
    data() {
      return {
        form: {
          unit: undefined,
          address: undefined,
          tel: undefined
        },
        rules: {
          unit: [{
            required: true,
            message: '请输入单位名称',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请输入单位地址',
            trigger: 'blur'
          }],
          tel: [{
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          }/*, {
            pattern: /^1[3|4|5|8][0-9]\d{8}$/,
            message: '请输入正确的电话',
            trigger: ['blur', 'change']
          }*/]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        //console.log(this.rowId)
        if(this.dialogStatus=='update') {
          this.form = this.row;
        }
      },
      cancel(forName) {
        this.$emit('closeDialog')
        this.$refs[forName].resetFields()
      },
      create(formName) {
        this.$emit('closeDialog')
      },
      update(forName) {
        console.log(this.rowId)
        this.$emit('closeDialog')
      },
      resetFields() {
        this.$refs.form.resetFields()
      },
      resetTemp() {
        this.form = {
          unit: undefined,
          address: undefined,
          tel: undefined
        };
      }
    }
  }
</script>

<style scoped>

</style>