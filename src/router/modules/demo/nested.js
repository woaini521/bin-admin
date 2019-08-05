import layout from '../../../layout/layout'

export default {
  path: '/nested',
  name: 'nested',
  redirect: 'noRedirect',
  meta: { title: '嵌套菜单', icon: 'ios-git-merge' },
  component: layout,
  children: [
    {
      path: 'menu1',
      component: () => import('../../../views/demo/nested/menu1'), // Parent router-view
      name: 'menu1',
      meta: { title: '菜单1' },
      children: [
        {
          path: 'menu1-1',
          component: () => import('../../../views/demo/nested/menu1/menu1-1'),
          name: 'menu1-1',
          meta: { title: '菜单1-1' }
        },
        {
          path: 'menu1-2',
          component: () => import('../../../views/demo/nested/menu1/menu1-2'),
          name: 'menu1-2',
          meta: { title: '菜单1-2' },
          children: [
            {
              path: 'menu1-2-1',
              component: () => import('../../../views/demo/nested/menu1/menu1-2/menu1-2-1'),
              name: 'menu1-2-1',
              meta: { title: '菜单1-2-1' }
            },
            {
              path: 'menu1-2-2',
              component: () => import('../../../views/demo/nested/menu1/menu1-2/menu1-2-2'),
              name: 'menu1-2-2',
              meta: { title: '菜单1-2-2' }
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () => import('../../../views/demo/nested/menu1/menu1-3'),
          name: 'menu1-3',
          meta: { title: '菜单1-3' }
        }
      ]
    },
    {
      path: 'menu2',
      name: 'menu2',
      component: () => import('../../../views/demo/nested/menu2'),
      meta: { title: '菜单2' }
    }
  ]
}
