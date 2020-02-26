// 资源信息
import request from '../request'

/* 获取资源信息列表 */
export function getResInfoList(query) {
  return request({
    url: '/api/dir/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceCode: query.resourceCode,
      resourceName: query.resourceName,
      status: query.status,
      availableStatus: query.availableStatus,
      resProperty: query.resProperty
    }
  })
}

/* 获取我的采集资源列表（无分页） */
export function getMyGather(resourceName) {
  return request({
    url: '/api/dir/mygather',
    method: 'get',
    params: {
      resourceName
    }
  })
}

/* 获取其中一个资源的所有字段 */
export function getFields(resourceKey) {
  return request({
    url: '/api/dir/items',
    method: 'get',
    params: {
      resourceKey
    }
  })
}

/* 查询目录明细 */
export function getResDetail(id) {
  return request({
    url: '/api/dir/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/* 获取资源性质树 */
export function getResPropertyTree() {
  return request({
    url: '/api/dir/classify/tree',
    method: 'get',
    params: {
      code: 'B'
    }
  })
}

/* 新增资源信息 */
export function createResInfo(res) {
  // items 排序
  let items = res.items.map((item, index) => {
    return { ...item, fieldSort: index }
  })
  return request({
    url: '/api/dir/create',
    method: 'post',
    data: {
      tableName: res.tableName, // 元信息表名字
      personClass: res.personClass, // 主体类别
      metadataKey: res.metadataKey, // 资源标识符
      resourceName: res.resourceName, // 资源名称
      resourceCode: '210' + res.metadataCode + res.resourceCode,
      resourceKey: res.resourceKey,
      resourceDesc: res.resourceDesc, // 资源描述
      updatePeriod: res.updatePeriod, // 更新周期
      expiryLimit: res.expiryLimit, // 有效期限
      resProperty: res.resProperty, // 资源性质
      sharedType: res.sharedType, // 共享属性
      sharedConditions: res.sharedConditions, // 共享条件
      sharedMode: res.sharedMode, // 共享方式
      isOpen: res.isOpen, // 开放属性
      openCondition: res.openCondition, // 开放条件
      items: items
    }
  })
}

/* 修改资源信息 */
export function modifyResInfo(res) {
  // items 排序
  let items = res.items.map((item, index) => {
    return { ...item, fieldSort: index }
  })
  return request({
    url: '/api/dir/modify',
    method: 'post',
    data: {
      id: res.id,
      tableName: res.tableName, // 元信息表名字
      personClass: res.personClass, // 主体类别
      metadataKey: res.metadataKey, // 资源标识符
      resourceName: res.resourceName, // 资源名称
      resourceCode: '210' + res.metadataCode + res.resourceCode,
      resourceDesc: res.resourceDesc, // 资源描述
      resourceKey: res.resourceKey,
      updatePeriod: res.updatePeriod, // 更新周期
      expiryLimit: res.expiryLimit, // 有效期限
      resProperty: res.resProperty, // 资源性质
      sharedType: res.sharedType, // 共享属性
      shareCondition: res.shareCondition, // 共享条件
      shareMode: res.shareMode, // 共享方式
      isOpen: res.isOpen, // 开放属性
      openCondition: res.openCondition, // 开放条件
      items: items
    }
  })
}

/* 删除资源信息 */
export function removeResInfo(res) {
  return request({
    url: '/api/dir/delete',
    method: 'post',
    params: {
      id: res.id
    }
  })
}

/* 发布资源信息 */
export function publishResInfo(res) {
  return request({
    url: '/api/dir/publish',
    method: 'post',
    params: {
      id: res.id
    }
  })
}

/* 查询扩展配置 */
export function queryExt(resourceKey) {
  return request({
    url: '/api/dir/ext/query',
    method: 'get',
    params: {
      resourceKey
    }
  })
}

/* 扩展配置保存 */
export function saveExt(resourceKey, extInfos) {
  return request({
    url: '/api/dir/ext/save',
    method: 'post',
    data: extInfos, // 配置对象
    params: {
      resourceKey
    }
  })
}

/* 资源编码是否重复 */
export function checkResCodeExist(id, code) {
  return request({
    url: '/api/dir/exist',
    method: 'get',
    params: {
      resId: id,
      code
    }
  })
}
