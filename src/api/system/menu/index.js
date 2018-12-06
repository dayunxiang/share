import fetch from '@/utils/fetch';

//树形菜单  可通过菜单名模糊查询
export function fetchTree(query) {
  return fetch({
    url:'/manage/menu/tree',
    method: 'get',
    params: query
  });
}

/*//
export function fetchAll() {
  return fetch({
    url: '/api/menu/all',
    method: 'get'
  });
}*/

//添加菜单
export function addObj(obj) {
  return fetch({
    url: '/manage/menu',
    method: 'post',
    data: obj
  });
}

//通过id获取菜单
export function getObj(id) {
  return fetch({
    url: '/manage/menu/' + id,
    method: 'get'
  })
}

//删除菜单
export function delObj(id) {
  return fetch({
    url: '/manage/menu/' + id,
    method: 'delete'
  })
}

//修改菜单
export function putObj(id, obj) {
  return fetch({
    url: '/manage/menu/' + id,
    method: 'put',
    data: obj
  })
}
//获取当前用户菜单
export function getUserMenu() {
  return fetch({
    url: '/manage/user/menus',
    method: 'get'
  })
}


