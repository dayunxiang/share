import fetch from '@/utils/fetch';

//退出
export function userLogout() {
  return fetch({
    url: '/manage/logout',
    method: 'get',
  });
}



