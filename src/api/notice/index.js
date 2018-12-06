import fetch from '@/utils/fetch';

//列表查询-普通用户
export function getNoticeList(form) {
  return fetch({
    url:'/manage/notice',
    method: 'get',
    params: form
  })
}
//发布公告
export function addNotice(form) {
  return fetch({
    url:'/manage/notice',
    method: 'post',
    data: form
  })
}
//修改公告
export function editNotice(form) {
  return fetch({
    url:'/manage/notice',
    method: 'put',
    data: form
  })
}
//公告详情
export function getNoticeDetail(id) {
  return fetch({
    url:'/manage/notice/' + id,
    method: 'get'
  })
}
//删除公告
export function deleteNotice(id) {
  return fetch({
    url:'/manage/notice/' + id,
    method: 'delete'
  })
}
