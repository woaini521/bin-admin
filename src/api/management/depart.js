// 部门管理相关请求
import request from '../api_request'

/* 获取部门树 */
export function getDeptTree (departCode = 'top') {
  return request.get('/management/depart/tree', {
    params: {
      departCode: departCode
    }
  })
}

/* 获取所有部门列表 */
export function getDeptList (query) {
  return request.get('/management/depart/search', {
    params: {
      size: query.size,
      page: query.page - 1,
      departName: query.departName,
      delFlag: query.delFlag,
      parentId: query.parentId,
      sort: 'sortNum'
    }
  })
}

/* 新增部门信息 */
export function createDept (depart) {
  const data = {
    parentId: depart.parentId,
    departName: depart.departName,
    departCode: depart.departCode,
    departKind: depart.departKind,
    regionId: depart.regionId,
    sortNum: depart.sortNum,
    unifiedCode: depart.unifiedCode,
    fullName: depart.fullName,
    remark: depart.remark
  }
  return request.post('/management/depart/create', data)
}

/* 修改部门信息 */
export function modifyDept (depart) {
  const data = {
    id: depart.id,
    parentId: depart.parentId,
    departName: depart.departName,
    departCode: depart.departCode,
    departKind: depart.departKind,
    regionId: depart.regionId,
    sortNum: depart.sortNum,
    unifiedCode: depart.unifiedCode,
    fullName: depart.fullName,
    remark: depart.remark
  }
  return request.post('/management/depart/modify', data)
}

/* 启用禁用部门信息 */
export function changeDelFlag (depart) {
  let data = [depart.id]
  return request({
    url: '/management/depart/changeDelFlag',
    method: 'post',
    data,
    params: {
      yn: depart.delFlag
    }
  })
}

/* 启用禁用部门信息 */
export function removeDepart (depart) {
  return request({
    url: '/management/depart/remove',
    method: 'post',
    params: {
      id: depart.id
    }
  })
}

/* 部门是否唯一 */
export function oneDeptName (depart) {
  return request.get('/management/depart/checkDepartName', {
    params: {
      id: depart.id || '',
      departName: depart.departName
    }
  })
}

/* 部门是否唯一 */
export function oneDeptCode (depart) {
  return request.get('/management/depart/checkDepartCode', {
    params: {
      id: depart.id || '',
      departCode: depart.departCode
    }
  })
}

/* 部门是否唯一 */
export function oneDeptUnified (depart) {
  return request.get('/management/depart/checkUnifiedCode', {
    params: {
      id: depart.id || '',
      unifiedCode: depart.unifiedCode
    }
  })
}
