import layout from '../../layout/layout'

export default {
  path: '/setting',
  component: layout,
  redirect: { name: 'dict' },
  meta: { title: '系统设置', icon: 'ios-settings' },
  children: [
    {
      path: 'dict',
      name: 'dict',
      component: () => import('../../views/sys/setting/dict'),
      meta: { title: '字典管理' }
    },
    {
      path: 'paramType',
      name: 'paramType',
      component: () => import('../../views/sys/setting/param-type'),
      meta: { title: '参数类型' }
    },
    {
      path: 'paramSetting',
      name: 'paramSetting',
      component: () => import('../../views/sys/setting/param-setting'),
      meta: { title: '参数设置' }
    }
  ]
}
