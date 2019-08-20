<template>
  <v-table-layout>
    <!--树结构-->
    <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="菜单名称">
        <b-input v-model.trim="listQuery.menuName" size="small" placeholder="请输入菜单名称" clearable></b-input>
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
      <template v-slot:name="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.name }}</a>
      </template>
      <!--菜单类型-->
      <template v-slot:type="scope">
        <b-tag>
          {{ menuTypeMap[scope.row.type] }}
        </b-tag>
      </template>
      <!--状态-->
      <template v-slot:delFlag="scope">
        <b-switch v-model="scope.row.delFlag" :true-value="ENUM.N" :false-value="ENUM.Y"
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
    <!--编辑抽屉-->
    <b-drawer v-model="dialogFormVisible" :append-to-body="false" fullscreen footer-hide :title="editTitle">
      <!--查询内容区域-->
      <div v-if="dialogStatus==='check'" style="width: 880px;padding: 20px 0 0 20px;">
        <v-key-label label="菜单名称" is-half is-first>{{ menu.name }}</v-key-label>
        <v-key-label label="上级菜单" is-half>{{ currentTreeNode.title }}</v-key-label>
        <v-key-label label="菜单类型" is-half is-first>
          <b-tag>{{ menuTypeMap[menu.type] }}</b-tag>
        </v-key-label>
        <v-key-label label="排序编号" is-half>{{ menu.sortNum }}</v-key-label>
        <v-key-label label="菜单路径">{{ menu.url }}</v-key-label>
        <v-key-label label="菜单路径串">{{ menu.route }}</v-key-label>
        <v-key-label label="前端路由" is-bottom>{{ menu.path }}</v-key-label>
        <div style="padding: 10px;text-align: center;">
          <b-button v-waves @click="dialogFormVisible=false">返 回</b-button>
        </div>
      </div>
      <!--增加编辑区域-->
      <div v-else style="width: 880px;padding: 20px 0 0 60px;">
      </div>
    </b-drawer>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import permission from '../../../mixins/permission'
  import * as api from '../../../api/management/menu'
  import { getYn, getMenuType } from '../../../api/enum'

  export default {
    name: 'Menu',
    mixins: [commonMixin, permission],
    data () {
      return {
        listQuery: {
          menuName: '',
          parentId: '', // 父菜单id
          delFlag: ''
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
          { title: '菜单名称', slot: 'name' },
          { title: '菜单类型', slot: 'type', width: 180, align: 'center' },
          { title: '菜单路径', key: 'url' },
          { title: '前端路由', key: 'path' },
          { title: '排序编号', key: 'sortNum', width: 80, align: 'center' },
          { title: '状态', slot: 'delFlag', width: 180, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        menu: null,
        ruleValidate: {},
        ynMap: { 'N': '否', 'Y': '是' }, // 默认值这里Y是可以删除，可删除状态及为禁用
        menuTypeMap: { '1': '功能菜单', '2': '目录菜单', '3': '动作菜单' },
        TYPE: { FUN: '1', DIR: '2', ACT: '3' }
      }
    },
    computed: {
      menuTypeOptions () {
        let ret = []
        Object.keys(this.menuTypeMap).forEach(key => {
          ret.push({ value: key, label: this.menuTypeMap[key] })
        })
        return ret
      },
      ENUM () {
        return { N: 'N', Y: 'Y' } // 常量比对键值对
      }
    },
    created () {
      this.getYnEnum()
      this.getMenuTypeEnum()
      this.initTree()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange (data, node) {
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          if (this.dialogStatus !== 'check') {
            this.currentTreeNode = node
            this.menu.parentId = node.id
          }
        } else {
          this.currentTreeNode = node
          this.listQuery.parentId = node.id
          this.handleFilter()
        }
      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          menuName: '',
          delFlag: this.ENUM.N,
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate () {
        this.resetMenu()
        this.openEditPage('create')
      },
      // 查看按钮事件
      handleCheck (row) {
        this.menu = { ...row }
        this.openEditPage('check')
      },
      // 单个启用禁用
      handleChangeDelFlag (row) {
        let menu = { ...row }
        api.changeDelFlag(menu).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            this.initTree()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
          }
        })
      },
      /* [数据接口] */
      // 重置对象
      resetMenu () {
        this.menu = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          name: '',
          sortNum: '',
          url: '',
          type: '',
          path: '',
          permission: []
        }
      },
      // 通用枚举
      getYnEnum () {
        getYn().then(res => {
          if (res.status === 200) {
            this.ynMap = res.data.data
          }
        })
      },
      // 菜单类型
      getMenuTypeEnum () {
        getMenuType().then(res => {
          if (res.status === 200) {
            this.menuTypeMap = res.data.data
          }
        })
      },
      // tree:初始化树结构
      initTree () {
        this.treeData = []
        // 请求响应返回树结构
        api.getMenuTree().then(response => {
          const tree = response.data.data || {}
          let mapper = node => {
            return {
              id: node.id,
              title: node.menuName,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = mapper(tree)
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.functionId = this.currentTreeNode.id
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
        api.getMenuList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
