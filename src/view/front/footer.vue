<template>
  <div class="footer-wrap">
    <div class="footer">
      <div class="email-outer">
        <div class="email">
          <img :src="logoUrl"/>
          <span class="company">江西省水利数据共享系统</span>
          <br/>
          <img :src="phoneUrl" class="small-img"/>
          <span>0791-88559937</span><br/>
          <img :src="emailUrl" class="small-img"/>
          <span class="company-email">jhxx@jxsltz.com</span>
        </div>
      </div>
      <div class="link">
        <div class="row">
          <span class="title">关于我们</span>
          <span>合作伙伴</span>
          <span>服务条款</span>
          <span>隐私政策</span>
          <span>加入我们</span>
        </div>
        <div class="row">
          <span class="title">快速入口</span>
          <span class="mb0">接口服务</span>
          <span class="mb0">数据服务</span>
          <span class="mb0">文库服务</span>
        </div>
        <div class="copy-font">
          <span>Copyright&copy;2018江西省水投江河信息技术有限公司<span class="mr20"></span>赣ICP备17017295号-1&ensp;公安网备36010902000118</span>
        </div>
        
      </div>
      <div class=" ewm">
        <img :src="ewmUrl"/>
        <br/>
        <span>扫码关注微信公众号</span>
      </div>
    </div>
   <!--  <div class="page-footer">
      <span>Copyright&copy;2018江西省水投江河信息技术有限公司<span class="mr20"></span>赣ICP备17017295号-1&ensp;公安网备36010902000118</span>
    </div> -->
  </div>
</template>

<script>
  
  export default {
    compontents: {
     
    },
    mounted() {
      
    },
    data() {
      return {
        logoUrl: require('@/assets/images/logo.png'),
        ewmUrl: require('@/assets/images/ewm.jpeg'),
        phoneUrl: require('@/assets/images/phone.png'),
        emailUrl: require('@/assets/images/api-email.png'),
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="less" >
   @import './front.less';
</style>


