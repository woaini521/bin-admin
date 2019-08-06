import layout from '../../layout/layout'

export default {
  path: '/auth',
  component: layout,
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
}
