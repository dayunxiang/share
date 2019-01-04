<template>
  <div >
    <div class="page-title">账户信息</div>
    <div class="main-container pt-twoline-nomar">
      <div class="user-con">
        <div class="img-con" v-if="userInfo.photo.length == 0 && userInfo.isAdmin == '1'">
          <img :src="avatorUrl" />
        </div>
        <div class="img-con" v-if="userInfo.photo.length == 0 && userInfo.isAdmin == '0'">
          <img :src="avatorUrl2"/>
        </div>
        <div class="img-con" v-if="userInfo.photo.length > 0">
          <img :src="userInfo.photo"/>
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
    created() {
      this.userInfo = JSON.parse(getUser())
      console.log(this.userInfo)
    },
    data() {
      return {
        userInfo: {},
        avatorUrl: require('@/assets/images/default-avator.jpg'),
        avatorUrl2: require('@/assets/images/default-admin.jpg'),
        // defaultUrl: 'this.src="./static/images/logo.png"',
        priceUrl: require('@/assets/images/price2.png')
      }
    },
    computed: {
     
    },
    methods: {
      // getDefault() {
      //   return this.defaultUrl
      // }
    }
  }
</script>

<style scoped>
  .mt6 {
    margin-top: 6px;
  }

</style>


