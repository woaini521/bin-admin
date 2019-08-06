import layout from '../../layout/layout'

export default {
  path: '/settings',
  component: layout,
  redirect: { name: 'Dict' },
  meta: { title: '系统设置', icon: 'ios-settings' },
  children: [
    {
      path: 'dict',
      name: 'Dict',
      component: () => import('../../views/sys/setting/dict'),
      meta: { title: '字典管理' }
    },
    {
      path: 'paramType',
      name: 'ParamType',
      component: () => import('../../views/sys/setting/param-type'),
      meta: { title: '参数类型' }
    },
    {
      path: 'paramSetting',
      name: 'ParamSetting',
      component: () => import('../../views/sys/setting/param-setting'),
      meta: { title: '参数设置' }
    }
  ]
}
