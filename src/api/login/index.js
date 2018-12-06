import fetch from '@/utils/fetch';



//登录请求
export function postLogin(obj) {
  return fetch({
    url: '/api/user/login',
    method: 'post',
    data: obj
  });
}


