import fetch from '@/utils/fetch';

//列表显示，查询
export function getAllData(obj) {
  return fetch({
    url: '/api/check/list',
    method: 'get',
    params: obj
  });
}

//列表详情
export function getDetails(id) {
  return fetch({
    url: '/api/examination/'+id,
    method: 'get',
  });
}

//通过
export function doApproval(form) {
  return fetch({
    url: 'api/examination/checkPass',
    method: 'put',
    params: form
  });
}

//驳回
export function doUnApproval(form) {
  return fetch({
    url: 'api/examination/checkNotPass',
    method: 'put',
    params: form
  });
}

//附件
export function getAttacHment(name) {
  return fetch({
    url: 'api/attachment?name='+name,
    method: 'get',
  });
}

//批量审批
export function doBatchApproval(form) {
  return fetch({
    url: 'api/examination/passExamination',
    method: 'put',
    params: form
  });
}