import { asyncRouterMap, constantRouterMap } from '../../router/routes'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除,这里暂时通过这种方式获取
 *
 * @param functions 所有用户路由权限列表
 * @param  route 路由
 * @param parentPath
 * @returns {boolean}
 */
function hasPermission (functions, route, parentPath = '') {
  if (route.meta && route.meta.roles) {
    return true
  } else {
    const tempPath = parentPath.length > 0 ? parentPath + '/' + route.path : route.path
    return functions.indexOf(tempPath) > -1
  }
}

function filterAsyncRoutes (routes, functions, parentPath = '') {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(functions, tmp, parentPath)) {
      // console.log(`匹配[${parentPath.length === 0 ? '父级路由' : '子路由'}] ${tmp.path} 路由成功`)
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, functions, tmp.path)
      }
      if (!tmp.children || tmp.children.length > 0) {
        res.push(tmp)
      }
    }
  })

  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: [] // 左侧菜单栏的缓存路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateRoutes ({ commit }, functions) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRoutes(asyncRouterMap, functions)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
