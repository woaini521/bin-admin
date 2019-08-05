import layout from '../../layout/layout'

export default {
  path: '/auth',
  component: layout,
  redirect: { name: 'menu' },
  meta: { title: '授权管理', icon: 'ios-ribbon' },
  children: [
    {
      path: 'menu',
      name: 'menu',
      component: () => import('../../views/sys/auth/menu'),
      meta: { title: '菜单管理' }
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('../../views/sys/auth/role'),
      meta: { title: '角色管理' }
    }
  ]
}
