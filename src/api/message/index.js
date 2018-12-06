import fetch from '@/utils/fetch';
//消息列表
export function getMessageList(form) {
  return fetch({
    url: '/manage/message',
    method: 'get',
    params: form
  })
}
//未读消息数
export function getMessageCount() {
  return fetch({
    url: '/manage/message/number',
    method: 'get'
  })
}
//标记已读
export function messageDetail(id) {
  return fetch({
    url: '/manage/message/' + id,
    method: 'get'
  })
}


