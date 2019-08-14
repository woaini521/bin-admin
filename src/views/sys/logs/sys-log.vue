<template>
  <v-table-layout>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="操作名称">
        <b-input v-model.trim="listQuery.operateName" size="small" placeholder="请输入操作名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="模块名称">
        <b-input v-model.trim="listQuery.moduleName" size="small" placeholder="请输入模块名称" clearable></b-input>
      </v-filter-item>
      <!--添加查询按钮位置-->
      <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
    </v-filter-bar>
    <!--中央表格-->
    <b-table slot="table" :columns="columns" :data="list" :loading="listLoading"
             stripe max-height="526" ref="table" :width="tableWidth">
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button type="text" v-waves @click="handleCheck(scope.row)">查看</b-button>
      </template>
    </b-table>
    <!--下方分页器-->
    <b-page slot="pager" :total="total" show-sizer
            @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
    <!--编辑抽屉-->
    <b-drawer v-model="dialogFormVisible" :append-to-body="false" width="800px" footer-hide :title="editTitle">
      <!--查询内容区域-->
      <div v-if="dialogStatus==='check'" style="padding: 20px;">
        <v-key-label label="操作名称">{{ current.operateName }}</v-key-label>
        <v-key-label label="模块名称">{{ current.moduleName }}</v-key-label>
        <v-key-label label="操作类型">{{ current.operateType }}</v-key-label>
        <v-key-label label="请求路径">{{ current.requestUrl }}</v-key-label>
        <v-key-label label="登录名称">{{ current.loginName }}</v-key-label>
        <v-key-label label="操作时间">{{ current.operateDate }}</v-key-label>
        <v-key-label label="远程地址">{{ current.remoteAddress }}</v-key-label>
        <v-key-label label="操作结果" is-bottom>{{ current.actionResult }}</v-key-label>
        <div style="padding: 10px;text-align: center;">
          <b-button v-waves @click="dialogFormVisible=false">取 消</b-button>
        </div>
      </div>
    </b-drawer>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import permission from '../../../mixins/permission'
  import * as api from '../../../api/management/sysLog'

  export default {
    name: 'SysLog',
    mixins: [commonMixin, permission],
    data () {
      return {
        listQuery: {
          operateName: ''
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
          { title: '操作名称', key: 'operateName' },
          { title: '模块名称', key: 'moduleName' },
          { title: '操作人员', key: 'loginName' },
          { title: '操作时间', key: 'operateDate' },
          { title: '远程地址', key: 'remoteAddress' },
          { title: '操作结果', key: 'actionResult' },
          { title: '操作', slot: 'action', width: 130, align: 'center' }
        ],
        current: null
      }
    },
    created () {
      this.searchList()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          operateName: '',
          moduleName: ''
        }
      },
      // 查看按钮事件
      handleCheck (row) {
        this.current = { ...row }
        this.openEditPage('check')
      },
      // 查询所有列表
      searchList () {
        this.setListData()
        api.getLogList(this.listQuery).then(response => {
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
