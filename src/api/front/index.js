import fetch from '@/utils/fetch';

//列表查询
export function getApiList(form) {
  return fetch({
    url:'/manage/apiQuery/conditionQuery',
    method: 'post',
    data: form
  })
}
//收藏
export function addCollection(form) {
  return fetch({
    url:'/manage/apiQuery/addCollection',
    method: 'post',
    params: form
  })
}
//获取示例代码
export function getDesc(form) {
  return fetch({
    url:'/manage/apiQuery/viewCodeDetail',
    method: 'get',
    params: form
  })
}
//订阅api
export function bookApi(form) {
  return fetch({
    url:'/manage/my/api/booked',
    method: 'POST',
    data: form
  })
}
//付款续费
export function renewApi(form) {
  return fetch({
    url:'/manage/my/api/pay',
    method: 'put',
    data: form
  })
}
//获取数据大类
export function getDataCategory() {
  return fetch({
    url:'/manage/category',
    method: 'get'
  })
}
//根据id获取子类
export function getCategoryById(form) {
  return fetch({
    url:'/manage/children',
    method: 'get',
    params: form
  })
}
//根据子类获取表字段
export function getTableDetail(form) {
  return fetch({
    url:'/manage/field',
    method: 'get',
    params: form
  })
}
//生成基础api
export function addBasicApi(form) {
  return fetch({
    url:'/manage/api',
    method: 'post',
    data: form
  })
}
//订阅基础api
export function bookBasicApi(form) {
  return fetch({
    url:'/manage/api/booked',
    method: 'post',
    data: form
  })
}
//基础api详情
export function getBasicDetail(form) {
  return fetch({
    url:'/manage/api',
    method: 'get',
    params: form
  })
}
//数据列表查询
export function getDataList(form) {
  return fetch({
    url:'/data/default/data',
    method: 'post',
    data: form
  })
}
//业务数据详情
export function getBusinessDataDetail(tag, form) {
  return fetch({
    url:'/webapp/business/data/'+ tag,
    method: 'get',
    params: form
  })
}
//数据收藏
export function addDataCollection(form) {
  return fetch({
    url:'/data/my/collection',
    method: 'post',
    data: form
  })
}
//下载扣除水利币
export function minusWaterMoney(form) {
  return fetch({
    url: '/webapp/business/data/download',
    method: 'get',
    params: form
  })
}

//游客查看详情接口
export function visitorDetail(form) {
  return fetch({
    url:'/webapp/business/data/visitor',
    method: 'get',
    params: form
  })
}
//detail

//文档列表查询
export function getDocList(form) {
  return fetch({
    url:'/base/document/document/condition',
    method: 'post',
    data: form
  })
}
//文档详情
export function getDocDetail(tag, id) {
  return fetch({
    url:'/webapp/document/preview/' + tag + id,
    method: 'get'
  })
}
//文档收藏
export function collectDoc(form) {
  return fetch({
    url:'/base/webapp/document/collection',
    method: 'POST',
    params: form
  })
}
//文档下载id
export function getDocId(form) {
  return fetch({
    url:'/base/webapp/document/download',
    method: 'get',
    params: form
  })
}
//管理员定制 基础数据下载校验
export function beforeBasicDown(form) {
  return fetch({
    url:'/webapp/data/pre/form_excel',
    method: 'get',
    params: form
  })
}
//个人定制 基础数据下载校验
export function beforeOwnBasicDown(form) {
  return fetch({
    url:'/webapp/data/pre/tailor_made_form',
    method: 'post',
    data: form
  })
}
//获取大类
export function getClassify(form) {
  return fetch({
    url:'/manage/api/type/list',
    method: 'post',
    data: form
  })
}
//获取首页api列表
export function getIndexApiList() {
  return fetch({
    url:'/manage/api/list',
    method: 'get'
  })
}
//获取首页数据列表
export function getIndexData() {
  return fetch({
    url:'/data/default/recommend',
    method: 'get'
  })
}
//获取首页文档列表
export function getIndexDoc() {
  return fetch({
    url:'/base/document/document/recommend',
    method: 'get'
  })
}
//获取首页公告列表
export function getIndexNotice() {
  return fetch({
    url:'/manage/notice/list',
    method: 'get'
  })
}
//获取首页所有公告列表
export function getAllNotice(form) {
  return fetch({
    url:'/manage/notice',
    method: 'get',
    params: form
  })
}
//根据分类获取相应api、数据、文档
export function getMapData(form) {
  return fetch({
    url:'/webapp/index/list',
    method: 'get',
    params: form
  })
}
