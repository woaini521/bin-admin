import layout from '../../layout'

// 容器组件
const Wrap = {
  render: h => {
    return h('router-view')
  }
}

export default {
  path: '/sys',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '系统管理', icon: 'ios-flower' },
  children: [
    {
      path: 'org',
      component: Wrap,
      redirect: { name: 'User' },
      meta: { title: '组织管理', icon: 'ios-git-network' },
      children: [
        {
          path: 'user',
          name: 'User',
          component: () => import(/* webpackChunkName: "org" */ '../../pages/sys/org/User'),
          meta: { title: '用户管理' }
        },
        {
          path: 'dept',
          name: 'Dept',
          component: () => import(/* webpackChunkName: "org" */ '../../pages/sys/org/Dept'),
          meta: { title: '部门管理' }
        }
      ]
    },
    {
      path: 'auth',
      component: Wrap,
      redirect: { name: 'Menu' },
      meta: { title: '授权管理', icon: 'ios-ribbon' },
      children: [
        {
          path: 'menu',
          name: 'Menu',
          component: () => import(/* webpackChunkName: "auth" */ '../../pages/sys/auth/Menu'),
          meta: { title: '菜单管理' }
        },
        {
          path: 'role',
          name: 'Role',
          component: () => import(/* webpackChunkName: "auth" */ '../../pages/sys/auth/Role'),
          meta: { title: '角色管理' }
        }
      ]
    },
    {
      path: 'logs',
      component: Wrap,
      redirect: { name: 'SysLog' },
      meta: { title: '日志管理', icon: 'ios-clipboard' },
      children: [
        {
          path: 'sysLog',
          name: 'SysLog',
          component: () => import(/* webpackChunkName: "logs" */ '../../pages/sys/logs/SysLog'),
          meta: { title: '系统日志' }
        }
      ]
    },
    {
      path: 'setting',
      component: Wrap,
      redirect: { name: 'Dict' },
      meta: { title: '系统设置', icon: 'ios-settings' },
      children: [
        {
          path: 'dict',
          name: 'Dict',
          component: () => import(/* webpackChunkName: "setting" */ '../../pages/sys/setting/Dict'),
          meta: { title: '字典管理' }
        },
        {
          path: 'paramType',
          name: 'ParamType',
          component: () => import(/* webpackChunkName: "setting" */ '../../pages/sys/setting/ParamType'),
          meta: { title: '类别信息' }
        },
        {
          path: 'paramSetting',
          name: 'ParamSetting',
          component: () => import(/* webpackChunkName: "setting" */ '../../pages/sys/setting/ParamSetting'),
          meta: { title: '参数设置' }
        }
      ]
    }
  ]
}
