<template>
  <div class="scroll">
    <front-header></front-header>
    <div>
      <router-view></router-view>
    </div>
    <front-footer></front-footer>
  </div>
</template>

<script>
  import {getApiList} from '@/api/front/index'
  import frontHeader from './header'
  import frontFooter from './footer'
  export default {
    components: {
      frontHeader,
      frontFooter
    },
    mounted() {
    },
    data() {
      return {
       
      }
    },
    methods: {
     
    }
  }
</script>

<style lang="less" >
   @import './front.less';
</style>


