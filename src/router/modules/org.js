import layout from '../../layout/layout'

export default {
  path: '/org',
  component: layout,
  redirect: { name: 'user' },
  meta: { title: '组织管理', icon: 'ios-git-network' },
  children: [
    {
      path: 'user',
      name: 'user',
      component: () => import('../../views/sys/org/user'),
      meta: { title: '用户管理' }
    },
    {
      path: 'dept',
      name: 'dept',
      component: () => import('../../views/sys/org/dept'),
      meta: { title: '部门管理' }
    }
  ]
}
