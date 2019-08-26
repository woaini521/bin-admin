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
  ]
}
