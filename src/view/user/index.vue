<template>
  <div >
    <div class="page-title">账户信息</div>
    <div class="main-container">
      <div class="user-con">
        <div class="img-con">
         
            <!-- <img :src="priceUrl"> -->
          <img :src="'http://10.136.6.59:8080' + userInfo.photoNormal" :onerror="defaultUrl"/>
        </div>
        <div class="user-detail">
            <p>
              <span class="label">账户：</span>
              <span>{{userInfo.name}}</span>
            </p>
            <p>
              <span class="label">账户ID：</span>
              <span>{{userInfo.userId}}</span>
            </p>
            <p>
              <span class="label">绑定的手机号：</span>
              <span>{{userInfo.mobile}}</span>
            </p>
            <p>
              <span class="label">绑定的邮箱：</span>
              <span>{{userInfo.email}}</span>
            </p>
            <p>
              <span class="label">用户所属职位：</span>
              <span>{{userInfo.position}}</span>
            </p>
            <p>
              <span class="label">用户所属部门：</span>
              <span>{{userInfo.officeName}}</span>
            </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUser } from '@/utils/auth'
  export default {
    components: {
    },
    mounted() {
      this.userInfo = JSON.parse(getUser())
    },
    data() {
      return {
        userInfo: {},
        defaultUrl: 'this.src="./static/images/logo.png"',
        priceUrl: require('@/assets/images/price2.png')
      }
    },
    computed: {
     
    },
    methods: {
      getDefault() {
        return this.defaultUrl
      }
    }
  }
</script>

<style scoped>
  .mt6 {
    margin-top: 6px;
  }

</style>


