import layout from '../../layout/layout'
import sysMain from '../../views/sys'

export default {
  path: '/sys',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '系统设置', icon: 'ios-flower' },
  children: [
    {
      path: 'org',
      component: sysMain,
      redirect: { name: 'User' },
      meta: { title: '组织管理', icon: 'ios-git-network' },
      children: [
        {
          path: 'user',
          name: 'User',
          component: () => import(/* webpackChunkName: "org" */ '../../views/sys/org/user'),
          meta: { title: '用户管理' }
        },
        {
          path: 'dept',
          name: 'Dept',
          component: () => import(/* webpackChunkName: "org" */ '../../views/sys/org/dept'),
          meta: { title: '部门管理' }
        }
      ]
    },
    {
      path: 'auth',
      component: sysMain,
      redirect: { name: 'Menu' },
      meta: { title: '授权管理', icon: 'ios-ribbon' },
      children: [
        {
          path: 'menu',
          name: 'Menu',
          component: () => import(/* webpackChunkName: "auth" */ '../../views/sys/auth/menu'),
          meta: { title: '菜单管理' }
        },
        {
          path: 'role',
          name: 'Role',
          component: () => import(/* webpackChunkName: "auth" */ '../../views/sys/auth/role'),
          meta: { title: '角色管理' }
        }
      ]
    },
    {
      path: 'logs',
      component: sysMain,
      redirect: { name: 'SysLog' },
      meta: { title: '日志管理', icon: 'ios-clipboard' },
      children: [
        {
          path: 'sysLog',
          name: 'SysLog',
          component: () => import(/* webpackChunkName: "logs" */ '../../views/sys/logs/sys-log'),
          meta: { title: '系统日志' }
        }
      ]
    },
    {
      path: 'setting',
      component: sysMain,
      redirect: { name: 'Dict' },
      meta: { title: '系统设置', icon: 'ios-settings' },
      children: [
        {
          path: 'dict',
          name: 'Dict',
          component: () => import(/* webpackChunkName: "setting" */ '../../views/sys/setting/dict'),
          meta: { title: '字典管理' }
        },
        {
          path: 'paramType',
          name: 'ParamType',
          component: () => import(/* webpackChunkName: "setting" */ '../../views/sys/setting/param-type'),
          meta: { title: '类别信息' }
        },
        {
          path: 'paramSetting',
          name: 'ParamSetting',
          component: () => import(/* webpackChunkName: "setting" */ '../../views/sys/setting/param-setting'),
          meta: { title: '参数设置' }
        }
      ]
    }
  ]
}
