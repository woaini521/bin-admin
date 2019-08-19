import layout from '../../layout/layout'

export default {
  path: '/setting',
  component: layout,
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
