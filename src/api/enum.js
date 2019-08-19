// 所有枚举值请求
import request from './api_request'

// 通用yes no 枚举
export function getUserStatus () {
  return request.get('/management/enum/commStatus', {
    type: 'init'
  })
}

// 通用yes no 枚举
export function getYn () {
  return request.get('/management/enum/yn')
}

// 配置取值模式枚举
export function getValueMode () {
  return request.get('/management/enum/valueMode')
}

// 角色类型枚举
export function getRoleType () {
  return request.get('/management/enum/roleType')
}

// 字典类型枚举
export function getDictType () {
  return request.get('/management/enum/dictType')
}
