// 用户管理相关请求
import request from '../api_request'

/* 获取所有用户列表 */
export function getUserList (query) {
  const data = new URLSearchParams()
  data.append('size', query.size)
  data.append('page', query.page - 1)
  data.append('username', query.username)
  data.append('realName', query.realName)
  data.append('departId', query.departId)
  data.append('status', query.status)
  data.append('sort', 'sortNum,asc')
  data.append('sort', 'createDate,desc')
  return request({
    url: '/management/user/search',
    method: 'get',
    params: data
  })
}
