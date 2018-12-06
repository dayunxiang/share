import fetch from '@/utils/fetch';

//获取所有角色
export function fetchTree(query) {
  return fetch({
    url: '/manage/group/list',
    method: 'get',
    params: query
  });
}

//新增角色
export function addObj(obj) {
  return fetch({
    url: '/manage/group',
    method: 'post',
    data: obj
  });
}

//通过id得到角色详情
export function getObj(id) {
  return fetch({
    url: '/manage/group/' + id,
    method: 'get'
  });
}

//删除角色
export function delObj(id) {
  return fetch({
    url: '/manage/group/' + id,
    method: 'delete'
  });
}

//修改角色
export function putObj(id, obj) {
  return fetch({
    url: '/manage/group/' + id,
    method: 'put',
    data: obj
  });
}

//返回  通过用户名查找到的用户
export function getDeptByName(query) {
  return fetch({
    url: '/manage/user',
    method: 'post',
    data: query
  });
}

//得到已关联用户
export function getDepts(id) {
  return fetch({
    url: '/manage/group/' + id + '/user',
    method: 'get'
  });
}

//修改关联用户
export function modifyDepts(id, obj) {
  return fetch({
    url: '/manage/group/' + id + '/user?userIds=' + obj,
    method: 'put'
  });
}

//单个移除按钮资源权限
export function removeElementAuthority(id, data) {
  return fetch({
    url: '/manage/group/' + id + '/authority/element/remove',
    method: 'post',
    params: data
  });
}

//单个增加按钮资源权限
export function addElementAuthority(id, data) {
  return fetch({
    url: '/manage/group/' + id + '/authority/element/add',
    method: 'post',
    params: data
  });
}

//得到已授权的按钮资源权限
export function getElementAuthority(id) {
  return fetch({
    url: '/manage/group/' + id + '/authority/element',
    method: 'get'
  });
}

//修改按钮资源权限  全选
export function modifyElementAuthority(id, data) {
  return fetch({
    url: '/manage/group/' + id + '/authority/element/update',
    method: 'put',
    params: data
  });
}

//修改菜单资源权限
export function modifyMenuAuthority(id, data) {
  return fetch({
    //url: '/api/group/' + id + '/authority/menus',
    url: '/manage/group/' + id + '/authority/menu',
    method: 'post',
    params: data
  });
}


//得到菜单资源权限
export function getMenuAuthority(id) {
  return fetch({
    url: '/manage/group/' + id + '/authority/submenu',
    method: 'get'
  });
}
