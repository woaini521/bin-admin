// 系统日志管理相关请求
import request from '../api_request'

/* 获取所有部门列表 */
export function getLogList (query) {
  return request.get('/management/log/search', {
    params: {
      size: query.size,
      page: query.page - 1,
      operateName: query.operateName,
      sort: 'operateDate,desc'
    }
  })
}
