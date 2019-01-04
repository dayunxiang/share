import fetch from '@/utils/fetch';

//字典类型查询
export function getDictList() {
  return fetch({
    url:'/manage/dicType',
    method: 'get',
  })
}
//字典类型对应字典查询
export function getDictDetailList(form) {
  return fetch({
    url:'/manage/dicDetail/type',
    method: 'get',
    params: form
  })
}
//新增类型
export function addDictType(form) {
  return fetch({
    url:'/manage/dicType/',
    method: 'POST',
    data: form
  })
}
//修改类型
export function editDictType(form) {
  return fetch({
    url:'/manage/dicType/',
    method: 'put',
    data: form
  })
}

//删除类型
export function deleteDictType(id) {
  return fetch({
    url:'/manage/dicType/' + id,
    method: 'DELETE'
  })
}
//新增字典
export function addDictDetail(form) {
  return fetch({
    url:'/manage/dicDetail/',
    method: 'post',
    data: form
  })
}
//修改字典
export function editDictDetail(form) {
  return fetch({
    url:'/manage/dicDetail/',
    method: 'PUT',
    data: form
  })
}
//删除字典
export function delDictDetail(id) {
  return fetch({
    url:'/manage/dicDetail/' + id,
    method: 'delete'
  })
}
//修改字典状态
export function changeDictStatus(form) {
  return fetch({
    url:'/manage/dicDetail/status',
    method: 'put',
    params: form
  })
}
