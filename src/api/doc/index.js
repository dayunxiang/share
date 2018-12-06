import fetch from '@/utils/fetch';

//获取文档列表
export function getDocList(form) {
  return fetch({
    url: '/base/document/document/query',
    method: 'post',
    data: form
  });
}
//获取我的文档列表
export function getMyDocList(form) {
  return fetch({
    url: '/base/document/my/document',
    method: 'post',
    data: form
  });
}
//获取我的文档收藏列表
export function getCollect(form) {
  return fetch({
    url: '/base/document/my/collection/list',
    method: 'post',
    data: form
  });
}
//获取我的文档取消收藏
export function cancelCollect(id) {
  return fetch({
    url: '/base/document/my/collection/' + id,
    method: 'delete'
  });
}


/** 后台 */
// 新增文档
export function addDoc(form) {
  return fetch({
    url: '/base/document/document',
    method: 'post',
    data: form
  });
}
// 修改文档
export function editDoc(form) {
  return fetch({
    url: '/base/document/document',
    method: 'post',
    data: form
  });
}
// 文档详情
export function getDocDetail(id) {
  return fetch({
    url: '/base/document/document/' + id,
    method: 'get',
  });
}
// 文档批量删除
export function batchDelDoc(form) {
  return fetch({
    url: '/base/document/document',
    method: 'DELETE',
    params: form
  });
}
// 文档提交
export function doSubmitDoc(form) {
  return fetch({
    url: '/base/document/document',
    method: 'put',
    params: form
  });
}
// 文档上架
export function doOnlineDoc(form) {
  return fetch({
    url: '/base/document/document/on_shelf',
    method: 'put',
    params: form
  });
}
// 文档下架
export function doOfflineDoc(form) {
  return fetch({
    url: '/base/document/document/down_shelf',
    method: 'put',
    params: form
  });
}
//文档下载id
export function getDocId(form) {
  return fetch({
    url:'/base/webapp/document/download',
    method: 'get',
    params: form
  })
}