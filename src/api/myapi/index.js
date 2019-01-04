import fetch from '@/utils/fetch';

//列表查询
export function getDataList(form) {
  return fetch({
    url: '/manage/my/api/list',
    method: 'POST',
    data: form
  });
}
//状态修改
export function changeApiStatus(form) {
  return fetch({
    url: '/manage/my/api/update_status',
    method: 'put',
    data: form
  });
}
//付款续费
export function payApi(form) {
  return fetch({
    url: '/manage/my/api/pay',
    method: 'put',
    data: form
  });
}
//api统计
export function getStatistics(form) {
  return fetch({
    url: '/manage/my/api/call_count',
    method: 'post',
    data: form
  });
}
//api评价
export function saveEval(form) {
  return fetch({
    url: '/manage/my/api/evaluation',
    method: 'post',
    data: form
  });
}
//api评价详情
export function getEvalDetail(form) {
  return fetch({
    url: '/manage/my/api/evaluation_detail',
    method: 'get',
    params: form
  });
}
//api测试详情
export function getApiDetail(form) {
  return fetch({
    url: '/manage/test/detail',
    method: 'get',
    params: form
  });
}
//api测试 发送请求
export function sendTestApi(obj) {
  return fetch({
    url: '/webapp/test/execute',
    method: 'post',
    data: obj
  });
}
//基础api标注
export function mark(obj) {
  return fetch({
    url:'/manage/my/api/flag',
    method: 'post',
    data: obj
  })
}

// 预警 返回账号绑定号码
export function getBindTel() {
  return fetch({
    url:'/manage/warn/mobile/mobile',
    method: 'get'
  })
}

// 设置预警
export function setBindTel(obj) {
  return fetch({
    url:'/manage/my/api/warned',
    method: 'post',
    data: obj
  })
}

// 查看预警
export function getBindTelDetail(id) {
  return fetch({
    url:'/manage/warn/' + id,
    method: 'get'
  })
}


