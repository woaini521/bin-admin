// 系统日志管理相关请求
import request from '../api_request'

/* 获取所有列表 */
export function getDictGroupList (query) {
  return request({
    url: '/management/dict/group/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      groupName: query.groupName,
      groupCode: query.groupCode,
      sort: 'createDate,desc'
    }
  })
}

/* 新增字典组 */
export function createDictGroup (dict) {
  const data = {
    groupName: dict.groupName,
    groupCode: dict.groupCode,
    dictType: dict.dictType
  }
  return request({
    url: '/management/dict/group/create',
    method: 'post',
    data
  })
}

/* 修改字典组 */
export function modifyDictGroup (dict) {
  const data = {
    id: dict.id,
    groupName: dict.groupName,
    groupCode: dict.groupCode,
    dictType: dict.dictType
  }
  return request({
    url: '/management/dict/group/modify',
    method: 'post',
    data
  })
}

/* 删除字典组 */
export function removeDictGroup (dict) {
  return request({
    url: '/management/dict/group/remove',
    method: 'post',
    params: {
      id: dict.id
    }
  })
}

/* 字典组名称唯一 */
export function oneGroupName (dict) {
  return request({
    url: '/management/dict/group/checkNameExists',
    method: 'get',
    params: {
      id: dict.id || '',
      groupName: dict.groupName
    }
  })
}

/* 字典组名称唯一 */
export function oneGroupCode (dict) {
  return request({
    url: '/management/dict/group/checkCodeExists',
    method: 'get',
    params: {
      id: dict.id || '',
      groupCode: dict.groupCode
    }
  })
}
