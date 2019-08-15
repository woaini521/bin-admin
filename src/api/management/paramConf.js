// 参数配置
import request from '../api_request'

/* 获取参数类型树 */
export function getTypeTree (typeCode) {
  return request({
    url: '/management/confType/tree',
    method: 'get',
    params: {
      typeCode: typeCode
    }
  })
}

/* 获取所有类别列表 */
export function getConfList (query) {
  return request({
    url: '/management/conf/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      confName: query.confName,
      confCode: query.confCode,
      typeId: query.typeId,
      sort: 'sortNum,asc'
    }
  })
}

/* 新增类别信息 */
export function createConf (conf) {
  return request({
    url: '/management/conf/create',
    method: 'post',
    data: {
      typeId: conf.parentId,
      confName: conf.confName,
      confCode: conf.confCode,
      confValue: conf.confValue,
      realValue: conf.realValue,
      valueMode: conf.valueMode,
      valueRange: conf.valueRange,
      realValueRange: conf.realValueRange,
      sortNum: conf.sortNum,
      desc: conf.desc
    }
  })
}

/* 修改类别信息 */
export function modifyConf (conf) {
  return request({
    url: '/management/conf/modify',
    method: 'post',
    data: {
      id: conf.id,
      typeId: conf.parentId,
      confName: conf.confName,
      confCode: conf.confCode,
      confValue: conf.confValue,
      realValue: conf.realValue,
      valueMode: conf.valueMode,
      valueRange: conf.valueRange,
      realValueRange: conf.realValueRange,
      sortNum: conf.sortNum,
      desc: conf.desc
    }
  })
}

/* 删除类别 */
export function removeConf (conf) {
  return request({
    url: '/management/conf/remove',
    method: 'post',
    params: {
      id: conf.id
    }
  })
}

/* 参数名称是否唯一 */
export function oneConfName (conf) {
  return request({
    url: '/management/conf/checkNameExists',
    method: 'get',
    params: {
      id: conf.id || '',
      confName: conf.confName
    }
  })
}

/* 参数编码是否唯一 */
export function oneConfCode (conf) {
  return request({
    url: '/management/conf/checkCodeExists',
    method: 'get',
    params: {
      id: conf.id || '',
      confCode: conf.confCode
    }
  })
}
