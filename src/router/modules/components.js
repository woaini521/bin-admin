import layout from '../../layout'

export default {
  path: '/components',
  component: layout,
  redirect: { name: 'JsonEditorDemo' },
  meta: { title: '组件', icon: 'ios-cube' },
  children: [
    {
      path: 'jsonEditor',
      name: 'JsonEditorDemo',
      component: () => import('../../pages/demo/components/JsonEditorDemo'),
      meta: { title: 'Json编辑器' }
    },
    {
      path: 'chart',
      name: 'ChartDemo',
      component: () => import('../../pages/demo/components/ChartDemo'),
      meta: { title: '图表容器' }
    }
  ]
}
