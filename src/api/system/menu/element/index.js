import fetch from '@/utils/fetch';

//通过菜单id查询按钮资源
export function page(query) {
  return fetch({
    url: '/api/element/list',
    method: 'get',
    params: query
  });
}

//添加按钮资源
export function addObj(obj) {
  return fetch({
    url: '/api/element',
    method: 'post',
    data: obj
  });
}

//通过id查询按钮资源
export function getObj(id) {
  return fetch({
    url: '/api/element/' + id,
    method: 'get'
  })
}

//删除按钮资源
export function delObj(id) {
  return fetch({
    url: '/api/element/' + id,
    method: 'delete'
  })
}

//编辑按钮资源
export function putObj(id, obj) {
  return fetch({
    url: '/api/element/' + id,
    method: 'put',
    data: obj
  })
}
