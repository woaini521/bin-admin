// 登录相关接口文件
import request, { requestPost } from './api_request'

/**
 * 获取4位验证码
 */
export function getVerifyCode () {
  return request.get('/auth/verifyCode', {
    responseType: 'arraybuffer'
  })
}

/**
 * 登录方法
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param data
 * @returns {*}
 */
export function login (data) {
  return requestPost('/auth/login', data)
}
