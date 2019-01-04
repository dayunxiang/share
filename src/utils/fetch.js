import axios from 'axios';
import {
  Message,
  MessageBox
} from 'element-ui';
import {router} from '../router'
import {getToken, removeToken, getLoginFlag} from './auth'
import store from '../store/index'
/*import store from '../store';
import {
  getToken
} from 'utils/auth';*/
// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000, // 请求超时时间
  headers: {'Cache-Control': 'no-cache', 'Pragma': 'no-cache'}
});

//添加请求拦截器
service.interceptors.request.use(request => {
  //请求头添加token
  let flag = getLoginFlag()
  if (flag) {
    request.headers.sso = flag 
  }
  //在发送请求之前做某事，比如说 设置loading动画显示
  if(request.method === 'get'){
    // if(request.url.indexOf('?')>-1){
    //   request.url += '&random=' + Math.random()
    // }else {
    //   request.url += '?random=' + Math.random()
    // }
    //console.log(request);
    request.url = encodeURI(request.url)
  }
  return request
}, error => {
  //请求错误时做些事
  return Promise.reject(error)
})

//拦截返回的数据res,通过返回值直接获取到服务器的数据
service.interceptors.response.use(response => {
    const res = response.data
  	if (res.code === 200) {
      return res
    }
    if (res.code === 400 || res.code === 407) {
      Message({
        message: res.message,
        type: 'error'
      });
     return Promise.reject('error');
    }
    if (res.code === 401) {
      removeToken()
      store.state.app.loginFlag = true
      //router.go(-1)
    }
    if (res.code === 403) {
      Message({
        message: '没有权限访问',
        type: 'error'
      });
      return Promise.reject(res);
    }
    if (res.code === 500) {
        Message({
          message: '服务器内部错误',
          type: 'error'
        });
        return Promise.reject('error');
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)
//封装多个请求
export function sendAll(fnArray) {
  return Promise.all(fnArray)
}

export default service;
