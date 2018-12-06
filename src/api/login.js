import fetch from '@/utils/fetch';

//-没有这个接口
export function loginByEmail(username, password) {
 /* const data = {
    username,
    password
  };
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });*/
}

//--没有这个接口
export function logout(token) {
 /* return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post',
    params: { token }
  });*/
}

export function getInfo(obj) {
  return fetch({
    url: '/api/user/front/info',
    method: 'get',
    params: obj
  });
}

export function getMenus(obj) {
  return fetch({
    url: '/api/user/front/menus',
    method: 'get',
    params: obj
  });
}

export function getAllMenus() {
  return fetch({
    url: '/api/user/front/menu/all',
    method: 'get'
  });
}
