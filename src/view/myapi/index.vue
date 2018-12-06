<template>
  <div>
   
          <myapi-main ></myapi-main>
  
  </div>
</template>

<script>
  import myapiMain from './myapimain';
  export default {
  name: 'myApi',
  components: {
    myapiMain
  },
  created() {
  },
  data() {
    return {
      activeName:'allStatus',
      tabType: 0
    };
  },
  computed: {},
  methods: {
      handleClick(tab, event) {
        this.tabType = tab
      }
  }
};
</script>

<style scoped>
.no-padding-top{
  padding-top: 0 !important;
}
</style>


