<template>
    <el-popover
      placement="bottom"
      width="168"
      v-model="visible2">
      <p style="padding-bottom: 6px" v-if="this.number==1">确定删除这条数据吗？</p>
      <p style="padding-bottom: 6px" v-if="this.number==2">确定下发这条数据吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible2 = false;">取消</el-button>
        <el-button type="primary" size="mini" @click="affirm">确定</el-button>
      </div>
      <template v-if="this.number==1">
        <el-button  slot="reference" size="mini" class="pu-button-mini button-red">删除</el-button>
      </template>
      <template v-if="this.number==2">
        <el-button slot="reference" size="mini" class="pu-button-mini button-yellow">下发 </el-button>
      </template>
    </el-popover>
</template>

<script>
  export default {
    props:{
      id:{
        //type: String
      },
      indexe:{
        type: Number
      },
      dataRow:{
        type: Array
      },
      number:{
        type: Number
      }
    },
    data() {
      return {
        visible2: false
      }
    },
    methods: {
      affirm(){
        this.visible2 = false;
        if(this.number==1){
          console.log(1);
          this.dataRow.splice(this.indexe, 1);
        }
        if(this.number==2){
          console.log(2);
        }
      }
    }
  }
</script>

<style scoped>
  
</style>


