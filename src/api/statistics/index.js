import fetch from '@/utils/fetch';
//列表显示，查询
export function getAllData(p,n) {
  return fetch({
    url: '/api/dataQuery/getDefaultData?page='+p+'&size='+n,
    method: 'get'
  });
}

//列表显示，查询
export function getQueryData(p,n,obj) {
  return fetch({
    url: '/api/dataQuery/getQueryData?page='+p+'&size='+n,
    method: 'get',
    params: obj
  });
}

//列表详情
export function getDetails(id) {
  return fetch({
    url: '/api/hydroelectric/station/data/detailForShow/'+id,
    method: 'get',
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

//全部导出
export function getExcelForSearch(obj) {
  return fetch({
    url: '/api/dataQuery/getExcelForSearch',
    method: 'get',
    params: obj
  });
}

//全省视图统计
export function getCity() {
  return fetch({
    url: '/api/dataQuery/getViewData',
    method: 'get',
  });
}

//地区下拉菜单
export function getQuery() {
  return fetch({
    url: '/api/dataQuery/getCityData',
    method: 'get',
  });
}

//地区下拉菜单
export function getTown(c) {
  return fetch({
    url: '/api/dataQuery/getCityViewData?code='+c,
    method: 'get'

  });
}

//省市县选择
export function getDownList() {
  return fetch({
    url: '/api/dataQuery/getDownList',
    method: 'get'
  });
}
