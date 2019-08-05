import request from './api_request'

/**
 * 获取用户信息
 * @returns {*}
 */
export function getInfo () {
  return request.get('/user/info')
}
