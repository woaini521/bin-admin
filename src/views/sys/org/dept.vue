<template>
  <b-container ref="container" bg-color="#f0f2f8">
    <v-table-layout>
      <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
      <!--查询条件-->
      <v-filter-bar slot="filter">
        <v-filter-item title="部门名称">
          <b-input v-model.trim="listQuery.departName" size="small" placeholder="请输入部门名称" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <b-table slot="table" :columns="columns" :data="data" border stripe></b-table>
      <b-page slot="pager" :total="100" show-sizer></b-page>
    </v-table-layout>
  </b-container>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import * as api from '../../../api/management/depart'

  export default {
    name: 'Dept',
    mixins: [commonMixin],
    data () {
      return {
        listQuery: {
          departName: '',
          parentId: ''
        },
        treeData: [],
        columns: [
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '年龄',
            key: 'age'
          },
          {
            title: '出生日期',
            key: 'birthday'
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        data: [
          {
            name: '王小明',
            age: 18,
            birthday: '1990-04-22',
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '1990-02-11',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '1991-06-16',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '1992-09-02',
            address: '深圳市南山区深南大道'
          },
          {
            name: '张小发',
            age: 33,
            birthday: '1989-12-22',
            address: '南京市龙眠大道'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '1990-02-11',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '1991-06-16',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '1992-09-02',
            address: '深圳市南山区深南大道'
          },
          {
            name: '张小发',
            age: 33,
            birthday: '1989-12-22',
            address: '南京市龙眠大道'
          },
          {
            name: '张小发',
            age: 33,
            birthday: '1989-12-22',
            address: '南京市龙眠大道'
          }
        ]
      }
    },
    created () {
      this.initTree()
    },
    methods: {
      /** [事件响应] **/
      handTreeCurrentChange (data, node) {
        console.log(node)
      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          departName: ''
        }
      },
      /** [数据接口] **/
      // tree:初始化树结构
      initTree () {
        this.treeData = []
        // 请求响应返回树结构
        api.getDeptTree().then(response => {
          const tree = response.data.data || []
          let mapper = node => {
            return {
              id: node.id,
              title: node.text,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = tree[0] && tree[0].code === 'top' ? mapper(tree[0]) : []
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.parentId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.searchList()
          }
        })
      },
      // 查询所有部门列表
      searchList () {
        // this._setListData()
        api.getDeptList(this.listQuery).then(response => {
          if (response.status === 200) {
            console.log(response.data)
            // this._setListData({
            //   list: response.data.rows,
            //   total: response.data.total
            // })
          }
        })
      }
    }
  }
</script>
