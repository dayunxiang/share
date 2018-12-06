import fetch from '@/utils/fetch';

export function getQuestion() {
  return fetch({
    url: '/api/question',
    method: 'get'
  });
}

//根据id查询问题详情
export function getObj(id) {
  return fetch({
    url: '/api/question/' + id,
    method: 'get'
  });
}



//新增问题
export function addObj(obj) {
  return fetch({
    url: '/api/question',
    method: 'post',
    data: obj
  });
}

//修改问题
export function putObj(obj) {
  return fetch({
    url: '/api/question',
    method: 'put',
    data: obj
  });
}

//删除问题
export function delObj(id) {
  return fetch({
    url: '/api/question/' + id,
    method: 'delete'
  });
}

//单个下发问题
export function sentObj(obj) {
  return fetch({
    url: '/api/question/lowerHairQuestion',
    method: 'put',
    data: obj
  });
}

//批量下发问题
export function batchSentObj(obj) {
  return fetch({
    url: '/api/question/lowerHairQuestions',
    method: 'put',
    data: obj
  });
}



//按搜索条件查询
export function searchByCondition(obj) {
  return fetch({
    url: '/api/question/question_all',
    method: 'post',
    data: obj
  });
}

/*//导入
export function importByCondition(obj) {
  return fetch({
    url: '/api/question/excelImport',
    method: 'post',
    data: obj,
    headers: {'Content-Type': 'multipart/form-data'}
  });
}*/

//下载模板
export function downloadTempl(obj) {
  return fetch({
    url: '/api/template/import/question',
    method: 'get'
  });
}

