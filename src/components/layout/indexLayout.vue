<template>
  <div>
    <div class="left-menu">
      <PuSidebar :isCollapse="isCollapse" @onIsCollapse="onIsCollapse"></PuSidebar>
    </div>
    <div class="right-main">
      <div class="header">
        <rural-header></rural-header>
      </div>
      <div class="tags-con">
        <page-tab :page-tags-list="pageTagsList"></page-tab>
      </div>
      <div class="main">
        <div style="min-width:780px" >
          <keep-alive :include="cacheList">
            <router-view ></router-view>
          </keep-alive>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>
  import PuSidebar from './puSidebar'
  
  import { getUserMenu} from '@/api/system/menu/index';
  import {getToken, setMenu} from '@/utils/auth'
  import ruralHeader from './header'
  import pageTab from './pageTab'
  var timer = ''
  export default {
    components: {
      PuSidebar,
      ruralHeader,
      pageTab
    },
    data() {
      return {
        isCollapse: false,
        isShowIcon: false
      };
    },
    methods: {
      getMenus() {
        getUserMenu().then(resp => {
          this.menus = resp.data
          this.$store.state.app.menus = resp.data
        })
      },
      onCollapse(){
        this.isCollapse = true;
      },
      onIsCollapse(){
        this.isCollapse = !this.isCollapse;
      },
      
    },
    watch: {
      refreshMenu(val) {
        if (val) {
          this.getMenus()
          this.$store.state.app.refreshMenu = false
        }
      }
    },
    mounted () {
      this.getMenus()
    },
    computed: {
      pageTagsList () {
        return this.$store.state.app.tagsList
      },
      cacheList () {
        let cache = this.$store.state.app.cacheList
        if (cache.length > 0) {
          return cache.toString()
        } else {
          return []
        }
      },
      refreshMenu() {
        return this.$store.state.app.refreshMenu
      }
    }
  }
</script>

<style lang="less" >
  @import '../../assets/scss/style.less';
 
</style>
