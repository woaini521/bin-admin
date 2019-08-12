<template>
  <v-table-layout>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="角色名称">
        <b-input v-model.trim="listQuery.name" size="small" placeholder="角色名称" clearable></b-input>
      </v-filter-item>
      <!--添加查询按钮位置-->
      <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
    </v-filter-bar>
    <!--控制栏-->
    <template slot="ctrl" v-if="canCreate">
      <b-button type="primary" v-waves size="small" icon="ios-add" @click="handleCreate">新增</b-button>
    </template>
    <!--中央表格-->
    <b-table slot="table" :columns="columns" :data="list" :loading="listLoading" stripe max-height="526">
      <template v-slot:name="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.name }}</a>
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
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'Role',
    mixins: [commonMixin, permission],
    data () {
      return {
        listQuery: {
          name: ''
        },
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
          { title: '角色名称', slot: 'departName' },
          { title: '角色编码', key: 'departCode', align: 'center' },
          { title: '部门类型', key: 'departKind', width: 120, align: 'center' },
          { title: '部门全称', key: 'fullName' },
          { title: '状态', slot: 'delFlag', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        role: null
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          name: ''
        }
      },
      // 查看按钮事件
      handleCheck (row) {
        this.role = { ...row }
        this.openEditPage('check')
      },
      // 新增按钮事件
      handleCreate () {
        this.resetRole()
        this.openEditPage('create')
      },
      /* [数据接口] */
      // 重置角色对象
      resetRole () {
        this.role = {
          id: ''
        }
      },
      // 查询所有部门列表
      searchList () {
        // this.setListData()
        // api.getDeptList(this.listQuery).then(response => {
        //   if (response.status === 200) {
        //     this.setListData({
        //       list: response.data.rows,
        //       total: response.data.total
        //     })
        //   }
        // })
      }
    }
  }
</script>
