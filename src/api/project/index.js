import fetch from '@/utils/fetch';

//新增数据（第一步）
export function addData(form) {
  return fetch({
    url:'/api/project/base/info/one',
    method: 'post',
    data: form
  });
}

//新增数据（第二步）
export function addDataSecond(form) {
  return fetch({
    url:'/api/project/base/info/two',
    method: 'post',
    data: form
  });
}


//查询数据（项目列表）
export function getDataList(form) {
  return fetch({
    url:'/api/project/base/info',
    method: 'get',
    params: form
  });
}

//查询数据详情
export function getDataDetail(id) {
  return fetch({
    url:'/api/project/base/info/' + id,
    method: 'get'
  });
}

//数据修改
export function updateData(form) {
  return fetch({
    url:'/api/project/base/info',
    method: 'put',
    data: form
  });
}