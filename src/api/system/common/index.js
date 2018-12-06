import fetch from '@/utils/fetch';

//获取联系人列表
export function getContactList(query) {
  return fetch({
    url:'/manage/contact/info',
    method: 'get',
    params: query
  });
}
//添加联系人
export function addContact(query) {
  return fetch({
    url:'/manage/contact/info',
    method: 'POST',
    data: query
  });
}
//修改联系人状态
export function changeContactStatus(query) {
  return fetch({
    url:'/manage/contact/info',
    method: 'PUT',
    data: query
  });
}
//设置api定价
export function setApiMoney(query) {
  return fetch({
    url:'/manage/third/party/api/price',
    method: 'put',
    data : query
  });
}
//设置数据定价
export function setDataMoney(query) {
  return fetch({
    url:'/data/base/price',
    method: 'put',
    data: query
  });
}
//获取api定价
export function getApiMoney() {
  return fetch({
    url:'/manage/api/price',
    method: 'get'
  });
}
//获取数据定价
export function getDataMoney() {
  return fetch({
    url:'/data/data/price',
    method: 'get'
  });
}



