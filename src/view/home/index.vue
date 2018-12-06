<template>

  <div class="userinfo-edit">
    123
  </div>

</template>

<script>
  import axios from 'axios' 
  export default {
    mounted() {
      this.init();
     
    },
    data() {
      return {
        
      }
    },
    methods: {
      //http://10.136.4.80/oam/server/obrareq.cgi?wh%3DJXSL_GongXiang_WebGate%20wu%3D%2Frouting%2Fmanage%2Fthird_party_login%20wo%3D1%20rh%3Dhttp%3A%2F%2F192.168.5.190%3A8080%20ru%3D%252Frouting%252Fmanage%252Fthird_party_login
      init() {
        axios({
          url: '/manage/third_party_login',
          method: 'get',
          params: {} 
        }).then( resp => {
          console.log(resp)
        })

      },
    }
  }
</script>

<style scoped>

</style>


