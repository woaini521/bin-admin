// 部门管理相关请求
import request, { requestPost } from '../api_request'

/** 获取部门树 */
export function getDeptTree (departCode = 'top') {
  return request.get('/management/depart/tree', {
    params: {
      departCode: departCode
    }
  })
}

/** 获取所有部门列表 */
export function getDeptList (query) {
  return request.get('/management/depart/search', {
    params: {
      size: query.size,
      page: query - 1,
      departName: query.departName,
      parentId: query.parentId
    }
  })
}
