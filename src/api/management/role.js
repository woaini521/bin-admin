// 角色管理相关请求
import request from '../api_request'

/* 获取所有角色列表 */
export function getRoleList (query) {
  return request({
    url: '/management/role/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name,
      sort: 'createDate,desc'
    }
  })
}

/* 新增角色信息 */
export function createRole (role) {
  return request({
    url: '/management/role/create',
    method: 'post',
    data: {
      name: role.name,
      code: role.code,
      roleType: role.roleType,
      desc: role.desc,
      parentId: role.parentId
    }
  })
}

/* 修改角色信息 */
export function modifyRole (role) {
  return request({
    url: '/management/role/modify',
    method: 'post',
    data: {
      id: role.id,
      name: role.name,
      code: role.code,
      desc: role.desc,
      parentId: role.parentId
    }
  })
}

/* 删除角色 */
export function removeRole (role) {
  return request({
    url: '/management/role/remove',
    method: 'post',
    params: {
      id: role.id
    }
  })
}

/* 角色名称唯一 */
export function oneRoleName (role) {
  return request({
    url: '/management/role/checkNameExists',
    method: 'get',
    params: {
      id: role.id || '',
      roleName: role.name
    }
  })
}

/* 角色编码唯一 */
export function oneRoleCode (role) {
  return request({
    url: '/management/role/checkCodeExists',
    method: 'get',
    params: {
      id: role.id || '',
      roleCode: role.code
    }
  })
}
