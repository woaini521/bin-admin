import layout from '../../layout/layout'

export default {
  path: '/sys',
  component: layout,
  redirect: 'noRedirect',
  meta: { title: '系统设置', icon: 'ios-flower' },
  children: [
    {
      path: 'logs',
      component: () => import('../../views/sys/index'),
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
  ]
}
