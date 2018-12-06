import fetch from '@/utils/fetch';

//列表查询
export function getMoneyList1(form) {
  return fetch({
    url:'/webapp/money/management/noHandle',
    method: 'post',
    data: form
  })
}
export function getMoneyList2(form) {
  return fetch({
    url:'/webapp/money/management/handle',
    method: 'post',
    data: form
  })
}
export function getMoneyList3(form) {
  return fetch({
    url:'/manage/money/giving/record',
    method: 'post',
    data: form
  })
}
//同意申请
export function agreeMoney(form) {
  return fetch({
    url:'/webapp/money/management/approve',
    method: 'post',
    params: form
  })
}
//拒绝申请
export function refuseMoney(form) {
  return fetch({
    url:'/webapp/money/management/refuse',
    method: 'post',
    params: form
  })
}
//用户查询
export function checkUserInfo(form) {
  return fetch({
    url:'/manage/money/giving',
    method: 'get',
    params: form
  })
}

//水利币发放
export function givingMoney(form) {
  return fetch({
    url:'/manage/money/giving',
    method: 'POST',
    data: form
  })
}
