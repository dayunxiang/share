// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'

import {router} from './router'
import 'babel-polyfill'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'
import echarts from 'echarts'

import './assets/fontAwesome/css/font-awesome.min.css'
import './assets/fontJH/iconfont.css'
import './assets/fontJH2/iconfont.css'
import  commonFunc from './api/common/index'  //公共方法

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(commonFunc)
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //使用store
  components: {App},
  template: '<App/>'
})
