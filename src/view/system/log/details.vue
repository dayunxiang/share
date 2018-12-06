<template>
  <table class="tableParticulars" cellspacing="0">
    <tr>
      <th width="90px">用户名:</th><td width="45%">{{details.logUser}}</td>
      <th>所属部门：</th><td>{{details.logDataDept}}</td>
    </tr>
    <tr>
      <th>操作时间：</th><td>{{details.logDatetime}}</td>
      <th>IP地址：</th><td>{{details.logOpIp}}</td>
    </tr>
    <tr>
      <!--details.logContent-->
      <th>日志内容：</th><td colspan="3"><div v-html="details.logContent"></div></td>
    </tr>
  </table>
</template>

<script>
  import {getDetails} from '@/api/journal/index';
  export default {
    props: {
      listId: {
        type: Number
      }
    },
    created() {
      this.getList();
    },
    data() {
      return {
        details: {
          logContent: "",
          logDatetime: "",
          logOperator: "",
          logOpIp: "",
          logDataModifyOptor: "",
          logDataModifyDept: "",
          logDataTitle: "",
          logDataDept: "",
          logUser: ""
        }
      }
    },
    methods: {
      getList() {
        getDetails(this.listId).then(res=>{
          this.details = res.data
        })
      }
    }
  }
</script>

<style scoped>

</style>


