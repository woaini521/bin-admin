// 部门管理相关请求
import request from '../api_request'

/* 获取菜单树 */
export function getMenuTree () {
  return request({
    url: '/management/function/tree',
    method: 'get'
  })
}

/* 获取所有菜单列表 */
export function getMenuList (query) {
  const data = new URLSearchParams()
  data.append('size', query.size)
  data.append('page', query.page - 1)
  data.append('menuName', query.menuName)
  data.append('delFlag', query.delFlag)
  data.append('parentId', query.parentId)
  data.append('sort', 'sortNum,asc')
  data.append('sort', 'createDate,desc')
  return request({
    url: '/management/function/search',
    method: 'get',
    params: data
  })
}
