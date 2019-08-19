<template>
  <v-table-layout>
    <!--树结构-->
    <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="用户名称">
        <b-input v-model.trim="listQuery.username" size="small" placeholder="请输入用户名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="真实姓名">
        <b-input v-model.trim="listQuery.realName" size="small" placeholder="请输入真实姓名" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="禁用状态" width="160px">
        <b-switch size="large" v-model="listQuery.delFlag" :true-value="ENUM.Y" :false-value="ENUM.N"
                  @on-change="handleFilter">
          <span slot="open">显示</span>
          <span slot="close">隐藏</span>
        </b-switch>
      </v-filter-item>
      <!--添加查询按钮位置-->
      <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
    </v-filter-bar>
    <!--控制栏-->
    <template slot="ctrl" v-if="canCreate">
      <b-button type="primary" v-waves size="small" icon="ios-add" @click="handleCreate">新增</b-button>
    </template>
    <!--中央表格-->
    <b-table slot="table" :columns="columns" :data="list" :loading="listLoading"
             stripe max-height="526" ref="table" :width="treeTableWidth">
      <template v-slot:username="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.username }}</a>
      </template>
      <!--状态-->
      <template v-slot:status="scope">
        <b-tag v-if="scope.row.status===ENUM.INIT">初始</b-tag>
        <b-switch v-else
                  v-model="scope.row.status" :true-value="ENUM.ENABLE" :false-value="ENUM.DISABLE"
                  inactive-color="#ff4949" size="large"
                  @on-change="handleChangeDelFlag(scope.row)">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </b-switch>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
        <b-button :disabled="canModify && scope.row.delFlag===ENUM.Y"
                  type="text" @click="handleModify(scope.row)" v-waves>
          修改
        </b-button>
        <!--是否有删除键-->
        <template v-if="canRemove && scope.row.delFlag===ENUM.Y">
          <b-divider type="vertical"></b-divider>
          <b-button type="text" v-waves style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
        </template>
      </template>
    </b-table>
    <!--下方分页器-->
    <b-page slot="pager" :total="total" show-sizer
            @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import permission from '../../../mixins/permission'
  import { getDeptTree } from '../../../api/management/depart'
  import * as api from '../../../api/management/userManage'
  import { getUserStatus } from '../../../api/enum'

  export default {
    name: 'User',
    mixins: [commonMixin, permission],
    data () {
      return {
        listQuery: {
          username: '',
          realName: '',
          status: '',
          departId: ''
        },
        treeData: [],
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 50,
            align: 'center',
            indexMethod: (row) => {
              return this.listQuery.size * (this.listQuery.page - 1) + row._index + 1
            }
          },
          { title: '用户名称', slot: 'username' },
          { title: '中文名称', key: 'realName' },
          { title: '用户编码', key: 'userCode', width: 120, align: 'center' },
          { title: '排序编号', key: 'sortNum', width: 80, align: 'center' },
          { title: '用户状态', slot: 'status', width: 180, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        user: null,
        statusMap: { 'I': '初始', 'Y': '启用', 'D': '禁用' }
      }
    },
    computed: {
      ENUM () {
        return { INIT: 'I', ENABLE: 'Y', DISABLE: 'D' } // 常量比对键值对 初始状态不可启用禁用和删除
      }
    },
    created () {
      this.getUserStatusEnum()
      this.resetUser()
      this.initTree()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange (data, node) {
        this.currentTreeNode = node
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.user.departId = node.id
        } else {
          this.listQuery.departId = node.id
          this.handleFilter()
        }
      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          username: '',
          realName: '',
          delFlag: this.ENUM.N,
          departId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate () {
        this.resetUser()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify (row) {
        this.resetUser()
        this.user = { ...this.user, ...row }
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck (row) {
        this.user = { ...row }
        this.openEditPage('check')
      },
      /* [数据接口] */
      // 通用枚举
      getUserStatusEnum () {
        getUserStatus().then(res => {
          if (res.status === 200) {
            this.statusMap = res.data.data
          }
        })
      },
      // 重置对象
      resetUser () {
        this.user = {
          id: '',
          departId: this.currentTreeNode ? this.currentTreeNode.id : '',
          username: '',
          realName: '',
          userCode: '',
          status: '',
          email: '',
          mobile: 0,
          sortNum: '',
          remark: '',
          roles: []
        }
      },
      // tree:初始化树结构
      initTree () {
        this.treeData = []
        // 请求响应返回树结构
        getDeptTree().then(response => {
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
            this.$set(this.treeData[0], 'expand', true)
            this.resetQuery()
          }
        })
      },
      // 查询所有部门列表
      searchList () {
        this.setListData()
        api.getUserList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
            console.log(this.list)
          }
        })
      }
    }
  }
</script>
