import fetch from '@/utils/fetch';

//获取所有大类接口
export function getBigCates() {
  return fetch({
    url: '/manage/category',
    method: 'get'
  });
}

//根据大类id获取所有大类包含子类接口
export function getSonCates(id) {
  return fetch({
    url: '/manage/children?categoryType=' + id,
    method: 'get'
  });
}

//根据子类id查询表内字段信息
export function getFields(id) {
  return fetch({
    url: '/manage/field?propertyTable=' + id,
    method: 'get'
  });
}

//基础数据条件(列表)查询
export function getBaseList(query) {
  return fetch({
    url: '/data/base/condition',
    method: 'get',
    params: query
  })
}

//基础数据详情
export function getBaseDetail(tag, id) {
  return fetch({
    url: '/webapp/data/'+ tag + id,
    method: 'get'
  })
}

// //基础数据上架
// export function onShelf(obj) {
//   return fetch({
//     url: '/webapp/data/on_shelf',
//     method: 'put',
//     data: obj
//   })
// }
// //基础数据下架
// export function offShelf(obj) {
//   return fetch({
//     url: '/webapp/data/off_shelf',
//     method: 'put',
//     data: obj
//   })
// }

// //基础数据（草稿）提交
// export function draft(obj) {
//   return fetch({
//     url: '/webapp/data/draft',
//     method: 'put',
//     data: obj
//   })
// }

//基础数据上架  下架 提交
export function operateBase(str, id) {
  return fetch({
    url: '/data/base/' + str + '?id=' + id,
    method: 'put'
  })
}



//基础数据 批量删除
export function batchDel(ids) {
  return fetch({
    url: '/data/base?ids='+ids,
    method: 'delete'
  })
}

//生成报表
export function getTable(query) {
  return fetch({
    url: '/base/interface/data/generate_form',
    method: 'get',
    params: query
  });
}

//保存基础数据
export function saveBase(obj) {
  return fetch({
    url: '/data/base',
    method: 'post',
    data: obj
  })
}
//提交基础数据
export function submitBase(obj) {
  return fetch({
    url: '/data/base/submission',
    method: 'post',
    data: obj
  })
}

//业务数据条件(列表)查询
export function getBizList(obj) {
  return fetch({
    url: '/data/business/data/query',
    method: 'post',
    data: obj
  })
}

//业务数据详情
export function getBizeDetail(id) {
  return fetch({
    url: '/webapp/business/data/detail?id=' + id,
    method: 'get'
  })
}

//业务数据上架  下架 提交
export function operateBiz(str, id) {
  return fetch({
    url: '/data/business/data/' + str + '?id=' + id,
    method: 'put'
  })
}

//业务数据 批量删除
export function batchDelBiz(ids) {
  return fetch({
    url: '/data/business/data?ids='+ids,
    method: 'delete'
  })
}

//保存业务数据
export function saveBiz(obj) {
  return fetch({
    url: '/data/business/data/save',
    method: 'post',
    data: obj
  })
}
//提交业务数据
export function submitBiz(obj) {
  return fetch({
    url: '/data/business/data',
    method: 'post',
    data: obj
  })
}

//附件上传接口
export function uploadFiles(obj) {
  return fetch({
    url: '/manage/attachment',
    method: 'post',
    headers:{'Content-Type':'multipart/form-data'},
    data: obj
  })
}


