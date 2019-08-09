import layout from '../../layout/layout'

export default {
  path: '/logs',
  component: layout,
  redirect: { name: 'SysLog' },
  meta: { title: '日志管理', icon: 'ios-clipboard' },
  children: [
    {
      path: 'sysLog',
      name: 'SysLog',
      component: () => import(/* webpackChunkName: "logs" */ '../../views/sys/logs/sys-log'),
      meta: { title: '系统日志' }
    }
    // {
    //   path: 'funcLog',
    //   name: 'FuncLog',
    //   component: () => import(/* webpackChunkName: "logs" */ '../../views/sys/logs/func-log'),
    //   meta: { title: '功能日志' }
    // }
  ]
}
