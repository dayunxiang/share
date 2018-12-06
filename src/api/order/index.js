import fetch from '@/utils/fetch';

//列表查询-普通用户
export function getOrderList(form) {
  return fetch({
    url:'/manage/work/order/normal_list',
    method: 'get',
    params: form
  })
}
//列表查询-管理员
export function getManagerList(form) {
  return fetch({
    url:'/manage/work/order/admin_list',
    method: 'post',
    data: form
  })
}
//新增工单
export function addOrder(form) {
  return fetch({
    url:'/manage/work/order',
    method: 'post',
    data: form
  })
}
//工单详情
export function getOrderDetail(id) {
  return fetch({
    url:'/manage/work/order/' + id,
    method: 'get'
  })
}
//工单回复
export function saveContent(param) {
  return fetch({
    url:'/manage/answer',
    method: 'post',
    data: param
  })
}
//关闭工单
export function closeOrder(id) {
  return fetch({
    url:'/manage/work/order/' + id,
    method: 'put'
  })
}

