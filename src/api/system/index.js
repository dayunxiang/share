import fetch from '@/utils/fetch';

//获取部门列表
export function getAllDept(query) {
  return fetch({
    url:'/api/dept/queryDept',
    method: 'get',
    params: query
  });
}

//新增部门
export function addDept(form) {
  return fetch({
    url:'/api/dept/add',
    method: 'POST',
    params: form
  });
}

//修改部门
export function editDept(form) {
  return fetch({
    url:'/api/dept/update',
    method: 'POST',
    params: form
  });
}

//删除部门
export function deleteDept(form) {
  return fetch({
    url:'/api/dept/delete',
    method: 'POST',
    params: form
  });
}

//获取模板列表
export function getTemplate(form) {
  return fetch({
    url:'/api/model/getModelData',
    method: 'get',
    params: form
  });
}

//上传模板
export function uploadModel(form) {
  return fetch({
    url:'/api/model/uploadModel',
    method: 'post',
    data: form,
    headers: {'Content-Type': 'multipart/form-data'}
  });
}

//获取用户信息
export function getUser(form) {
  return fetch({
    url:'/manage/user',
    method: 'POST',
    data: form
  });
}
//获取部门列表
export function getDepart() {
  return fetch({
    url:'/api/user/getDeptList',
    method: 'get'
  });
}

//新增用户
export function addUser (form) {
  return fetch({
    url:'/api/user/add',
    method: 'post',
    params: form
  });
}

//修改用户
export function editUser (form) {
  return fetch({
    url:'/api/user/update',
    method: 'post',
    params: form
  });
}

//删除用户
export function removeUser(form) {
  return fetch({
    url:'/api/user/delete',
    method: 'post',
    params: form
  });
}

//重置密码
export function modifyPassword(form) {
  return fetch({
    url:'/api/user/resetPassword',
    method: 'post',
    params: form
  });
}

//导入用户
export function importExcel(form) {
  return fetch({
    url:'/api/user/importExcel',
    method: 'post',
    data: form,
    headers: {'Content-Type': 'multipart/form-data'}
  });
}

//导入部门
export function importDept(form) {
  return fetch({
    url:'/api/dept/importExcel',
    method: 'post',
    data: form,
    headers: {'Content-Type': 'multipart/form-data'}
  });
}