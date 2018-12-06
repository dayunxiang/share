import fetch from '@/utils/fetch';

//列表显示，查询
export function getAllData(p,n,obj) {
  return fetch({
    url: '/api/log/getQueryLog?page='+p+'&size='+n,
    method: 'get',
    params: obj
  });
}

//列表详情
export function getDetails(id) {
  return fetch({
    url: 'api/log/'+id,
    method: 'get',
  });
}

//日志下拉框数据
//
export function getLogTitle(id) {
  return fetch({
    url: '/api/log/getLogTitle',
    method: 'get',
  });
}
