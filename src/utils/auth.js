import Cookies from 'js-cookie'

const TokenKey = 'AdminToken'
const loginFlag = 'loginFlag'
const region = 'city'
const user = 'nameUser'
const history = 'path'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getLoginFlag() {
  return Cookies.get(loginFlag)
}

export function setLoginFlag(flag) {
  return Cookies.set(loginFlag, flag)
}

export function removeLoginFlag() {
  return Cookies.remove(loginFlag)
}

export function getCity() {
  return Cookies.get(region)
}

export function setCity(city) {
  return Cookies.set(region, city)
}

export function getUser() {
  return Cookies.get(user)
}

export function setUser(name) {
  return Cookies.set(user, name)
}

export function getHistory() {
  return Cookies.get(history)
}

export function setHistory(path) {
  return Cookies.set(history, path)
}

export function checkRouter(menus, path) {
	path = path.substring(1)
	if (menus == null) {
		return true
	} else if (menus.indexOf(path) < 0) {
		return false
	} else {
		menus = JSON.parse(menus)
		let result = false
		menus.forEach((v) => {
			if (v.href == path) {
				result = true
			} else {
				if (v.children.length > 0) {
					v.children.forEach((val) => {
						if (val.href == path) {
							result = true
						}
					})
				}
			}
		})
		return result
	}
}

//检查用户级别
export function checkRegion(region) {
	let code1 = region.substring(2, 4)
	let code2 = region.substring(4, 6)
	if (code1 == '00') {
		return 'province'
	} else if (code1 != '00' && code2 == '00') {
		return 'city'
	} else {
		return 'country'
	}
}

//重置获取接口返回消息格式
export function resetMessage(message) {
	let content = message.match(/\{[^\}]+\}/)[0]
	return JSON.parse(content).message
}
