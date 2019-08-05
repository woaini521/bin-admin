import layout from '../../layout/layout'

export default {
  path: '/logs',
  component: layout,
  redirect: { name: 'sysLog' },
  meta: { title: '日志管理', icon: 'ios-clipboard' },
  children: [
    {
      path: 'sysLog',
      name: 'sysLog',
      component: () => import('../../views/sys/logs/sys-log'),
      meta: { title: '系统日志' }
    },
    {
      path: 'funcLog',
      name: 'funcLog',
      component: () => import('../../views/sys/logs/func-log'),
      meta: { title: '功能日志' }
    }
  ]
}
