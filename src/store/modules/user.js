import { login } from '../../api/auth'
import { getInfo } from '../../api/user'
import util from '../../utils/util'
import { ACCESS_TOKEN } from '../mutation-types'
import { resetRouter } from '../../router'

export default {
  state: {
    token: '', // token
    roles: [],
    info: {} // user的登录信息
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },
  actions: {
    // 登录
    login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const token = response.data.data
          // console.log('vuex:')
          console.log(token)
          // 设置token
          util.cookies.set(ACCESS_TOKEN, token)
          commit('SET_TOKEN', token)
          resolve(token)
        }).catch(error => {
          console.log('error')
          reject(error)
        })
      })
    },
    // 登出
    logout ({ commit }) {
      return new Promise((resolve) => {
        // 删除缓存的token
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // 删除cookie
        util.cookies.remove(ACCESS_TOKEN)
        // 清空路由
        resetRouter()
        resolve()
      })
    },
    // 获取用户信息
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data.data
          // 判断角色权限是否存在,这里约定为roleCodes
          if (result.roleCodes && result.roleCodes.length > 0) {
            commit('SET_ROLES', result.roleCodes)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
