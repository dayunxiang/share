import fetch from '@/utils/fetch';

//列表查询
export function getDataList(form) {
  return fetch({
    url:'/manage/third/party/api/list',
    method: 'post',
    data: form
  })
}
//api保存 第一步
export function saveApiStep1(form) {
  return fetch({
    url:'/manage/third/party/api/productIntroduction',
    method: 'POST',
    data: form
  })
}
//api保存 第2步
export function saveApiStep2(form) {
  return fetch({
    url:'/manage/third/party/api/apiDocument',
    method: 'POST',
    data: form
  })
}
//api保存 第3步
export function saveApiStep3(form) {
  return fetch({
    url:'/manage/third/party/api/statusCode',
    method: 'POST',
    data: form
  })
}
//api保存 第4步
export function saveApiStep4(form) {
  return fetch({
    url:'/manage/third/party/api/exampleCall',
    method: 'POST',
    data: form
  })
}
//api保存 第5步
export function saveApiStep5(form) {
  return fetch({
    url:'/manage/third/party/api/chargeMode',
    method: 'POST',
    data: form
  })
}
//api提交（修改）
export function submitApiAll(form) {
  return fetch({
    url:'/manage/third/party/api/all_submission',
    method: 'POST',
    data: form
  })
}
//api提交（新增）
export function submitApi(form) {
  return fetch({
    url:'/manage/third/party/api/submission',
    method: 'POST',
    data: form
  })
}
//api详情
export function getApiDetail(tag, form) {
  return fetch({
    url:'/manage/apiQuery/' + tag,
    method: 'get',
    params: form
  })
}
//api详情(所有)
export function getAllDetail(form) {
  return fetch({
    url:'/manage/third/party/api/api_detail',
    method: 'get',
    params: form
  })
}
//修改状态
export function submitData(form) {
  return fetch({
    url:'/manage/third/party/api',
    method: 'put',
    data: form
  })
}
//图片上传
export function uploadFile(form) {
  return fetch({
    url:'/manage/attachment/image',
    method: 'post',
    data: form,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
//文件上传
export function uploadDocFile(form) {
  return fetch({
    url:'/manage/attachment',
    method: 'post',
    data: form,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
//保存基础api（第一步）
export function saveBasicApiStep1(form) {
  return fetch({
    url:'/manage/api/next',
    method: 'post',
    data: form
  })
}
//保存基础api（第2步）
export function saveBasicApiStep2(form) {
  return fetch({
    url:'/manage/api/save',
    method: 'post',
    data: form
  })
}
//提交基础api（第2步）
export function submitBasicApi(form) {
  return fetch({
    url:'/manage/api/submit',
    method: 'post',
    data: form
  })
}
//获取基础api详情
export function getBasicApiDetail(form) {
  return fetch({
    url:'/manage/api',
    method: 'get',
    params: form
  })
}
//获取api类型
export function getApiTypeArray(form) {
  return fetch({
    url:'/manage/api/type/list',
    method: 'post',
    data: form
  })
}
//获取基础对象类型
export function getBasicTypeArray() {
  return fetch({
    url:'/manage/category',
    method: 'get'
  })
}
//按类型查询已启用状态的字典(不分页)
export function getRequireTypeArray(form) {
  return fetch({
    url: '/manage/dicDetail/type_enable',
    method: 'get',
    params: form
  })
}
