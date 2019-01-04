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
//api订阅记录
export function getApiLogList(form) {
  return fetch({
    url:'/manage/my/api/order',
    method: 'post',
    data: form
  });
}
//数据下载记录
export function getDataLogList(form) {
  return fetch({
    url:'/data/download/record',
    method: 'post',
    data: form
  });
}
//文档下载记录
export function getDocLogList(form) {
  return fetch({
    url:'/base/document/operating/record',
    method: 'post',
    data: form
  });
}
//api启用、禁用
export function changeApiStatus(form) {
  return fetch({
    url:'/manage/my/api/call_type',
    method: 'post',
    data: form
  });
}
//api记录详情
export function apiLogDetail(id) {
  return fetch({
    url:'/manage/my/api/order/' + id,
    method: 'get'
  });
}
//api数据范围字段列表
export function authorityParam(form) {
  return fetch({
    url:'/manage/request/parameters/list',
    method: 'get',
    params: form
  });
}
//api数据范围字段列表
export function authorityParamList(form) {
  return fetch({
    url:'/manage/my/api/permission',
    method: 'get',
    params: form
  });
}