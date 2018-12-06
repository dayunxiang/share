import fetch from '@/utils/fetch';

//列表显示，查询
export function getAllData(p,n,obj) {
  return fetch({
    url: '/api/dataQuery/getDefaultData?page='+p+'&size='+n,
    method: 'get',
    params: obj
  });
}

//列表详情
export function getDetails(obj) {
  return fetch({
    url: 'api/hydroelectric/station/data/detailForShow',
    method: 'get',
    params: obj
  });
}

//模板下载
export function getTemplate(obj) {
  return fetch({
    url: 'api/hydroelectric/station/data/detailForShow',
    method: 'get',
    params: obj
  });
}

//请求地区
export function getCity() {
  return fetch({
    url: '/api/dataQuery/getCityDownList',
    method: 'get',
  });
}
