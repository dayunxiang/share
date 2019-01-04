import fetch, {sendAll} from '@/utils/fetch';

//列表查询
export function getShareList() {
  return fetch({
    url:'/manage/my/api/api_list',
    method: 'get',
  })
}

//获取用户水利币
export function getUserInfoDetail() {
  return fetch({
    url:'/manage/user/queryWaterMoney',
    method: 'get',
  })
}

//充值申请
export function moneyApply(form) {
  return fetch({
    url:'/manage/money/management/moneyApply',
    method: 'post',
    params: form
  })
}

//查询充值记录
export function getRechargeRecord(form) {
  return fetch({
    url:'/manage/recharge/record/queryRechargeRecord',
    method: 'get',
    params: form
  })
}
//查询api消费记录
export function getConsume(form) {
  return fetch({
    url:'/manage/consume/record',
    method: 'post',
    data: form
  })
}
//查询我的收藏
export function getCollect(form) {
  return fetch({
    url:'/manage/apiCollection',
    method: 'get',
    params: form
  })
}
//取消收藏
export function cancelCollect(form) {
  return fetch({
    url:'/manage/apiCollection',
    method: 'post',
    params: form
  })
}
//查询数据列表
export function getDataList() {
  return sendAll([fetch({
    url:'/manage/api/white/list',
    method: 'get'
  }), fetch({
    url: '/manage/api/white/list/ip',
    method: 'get'
  })])
}
//保存ip白名单配置
export function saveIpWhiteList(form) {
  return fetch({
    url:'/manage/api/white/list',
    method: 'POST',
    data: form
  })
}
//获取消费记录详情
export function getConsumeDetail(form) {
  return fetch({
    url:'/manage/consume/record/detail',
    method: 'get',
    params: form
  })
}

//查询数据消费记录
export function getDataConsume(form) {
  return fetch({
    url:'/data/consume/record/list',
    method: 'post',
    data: form
  })
}
//获取数据消费记录详情
export function getDataConsumeDetail(id, form) {
  return fetch({
    url:'/data/consume/record/' + id,
    method: 'get',
    params: form
  })
}
//查询文库消费记录
export function getDocConsume(form) {
  return fetch({
    url:'/base/document/document/record/list',
    method: 'post',
    data: form
  })
}
//获取文库消费记录详情
export function getDocConsumeDetail(form) {
  return fetch({
    url:'/base/document/my/consume/detail/record',
    method: 'get',
    params: form
  })
}
//获取账户流水
export function getSerialList(form) {
  return fetch({
    url:'/manage/account/serial/list',
    method: 'POST',
    data: form
  })
}
//获取账户流水
export function getUserDetail(form) {
  return fetch({
    url:'/manage/user/userInformation',
    method: 'get'
  })
}

//预警
//预警号码列表
export function warningPhoneList(form) {
  return fetch({
    url:'/manage/warn/mobile',
    method: 'get',
    params: form
  })
}
//新增预警号码
export function addWarningPhone(form) {
  return fetch({
    url:'/manage/warn/mobile',
    method: 'post',
    data: form
  })
}
//修改预警号码
export function editWarningPhone(form) {
  return fetch({
    url:'/manage/warn/mobile',
    method: 'put',
    data: form
  })
}
//删除预警号码
export function delWarningPhone(id) {
  return fetch({
    url:'/manage/warn/mobile/' + id,
    method: 'delete'
  })
}
//预警号码详情
export function warningPhoneDetail(id) {
  return fetch({
    url:'/manage/warn/mobile/' + id,
    method: 'get'
  })
}
//发送验证码
export function sendVerifyCode(form) {
  return fetch({
    url:'/manage/warn/mobile/validate',
    method: 'post',
    data: form
  })
}

