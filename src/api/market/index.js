import fetch from '@/utils/fetch';

//查询我的收藏
export function getCollect(query) {
  return fetch({
    url:'/data/my/collection',
    method: 'get',
    params: query
  })
}
//取消收藏
export function cancelCollect(id) {
  return fetch({
    url:'/data/my/collection/' + id,
    method: 'delete'
  })
}

//我的数据
export function getDataList(obj) {
  return fetch({
    url:'/data/my/data/list',
    method: 'post',
    data: obj
  })
}