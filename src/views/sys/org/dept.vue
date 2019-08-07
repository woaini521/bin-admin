<template>
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
    <!--中央表格-->
    <b-table slot="table" :columns="columns" :data="list" :loading="listLoading" stripe>
      <template v-slot:action="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">查看</a>
      </template>
    </b-table>
    <b-page slot="pager" :total="total" show-sizer></b-page>
  </v-table-layout>
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
          { title: '部门名称', key: 'departName' },
          { title: '统一社会信用代码', key: 'unifiedCode' },
          { title: '部门全称', key: 'fullName' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
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
      handleCheck (row) {
        console.log(row)
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
        this._setListData()
        api.getDeptList(this.listQuery).then(response => {
          if (response.status === 200) {
            this._setListData({
              list: response.data.rows,
              total: response.data.total
            })
            this.$print(this.list)
          }
        })
      }
    }
  }
</script>
