<template>
  <v-table-layout>
    <!--树结构-->
    <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="参数名称">
        <b-input v-model.trim="listQuery.confName" size="small" placeholder="请输入参数名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="参数名称">
        <b-input v-model.trim="listQuery.confName" size="small" placeholder="请输入参数名称" clearable></b-input>
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
      <template v-slot:confName="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.confName }}</a>
      </template>
      <!--状态-->
      <template v-slot:valueMode="scope">
        <b-tag type="primary" size="medium">{{ scope.row.valueMode}}</b-tag>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)" v-waves>
          修改
        </b-button>
        <!--是否有删除键-->
        <template v-if="canRemove">
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
        <v-key-label label="所属类型" is-half is-first>{{ conf.typeId }}</v-key-label>
        <v-key-label label="参数名称" is-half>{{ conf.confName }}</v-key-label>
        <v-key-label label="参数编码" is-half is-first>{{ conf.confCode }}</v-key-label>
        <v-key-label label="完整编码" is-half>{{ conf.routeCode }}</v-key-label>
        <v-key-label label="取值模式" is-half is-first>{{ conf.valueMode }}</v-key-label>
        <v-key-label label="排序编号" is-half>{{ conf.sortNum }}</v-key-label>
        <v-key-label label="参数值" is-half is-first>{{ conf.confValue }}</v-key-label>
        <v-key-label label="内部值" is-half>{{ conf.realValue }}</v-key-label>
        <v-key-label label="取值范围" is-half is-first>{{ conf.valueRange }}</v-key-label>
        <v-key-label label="内部取值范围" is-half>{{ conf.realValueRange }}</v-key-label>
        <v-key-label label="描述" is-bottom>{{ conf.desc }}</v-key-label>
        <div style="padding: 10px;text-align: center;">
          <b-button v-waves @click="dialogFormVisible=false">取 消</b-button>
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
  import * as api from '../../../api/management/paramConf'

  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }
  export default {
    name: 'ParamSetting',
    mixins: [commonMixin, permission],
    data () {
      const validateConfName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneConfName(this.conf).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('参数名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateConfCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneConfCode(this.conf).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('参数编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        listQuery: {
          confName: '',
          confCode: '',
          typeId: ''
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
          { title: '参数名称', slot: 'confName' },
          { title: '参数编码', key: 'confCode' },
          { title: '完整编码', key: 'routeCode' },
          { title: '取值模式', slot: 'valueMode', width: 120, align: 'center' },
          { title: '当前值', key: 'confValue', width: 120, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        conf: null,
        ruleValidate: {
          typeName: [requiredRule, { validator: validateConfName, trigger: 'blur' }],
          typeCode: [requiredRule, { validator: validateConfCode, trigger: 'blur' }]
        }
      }
    },
    created () {
      this.initTree()
      this.resetConf()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange (data, node) {
        this.currentTreeNode = node
        this.listQuery.typeId = node.id
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.conf.typeId = node.id
        } else {
          this.handleFilter()
        }
      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          confName: '',
          confCode: '',
          typeId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate () {
        this.resetConf()
        this.openEditPage('create')
      },
      // 查看按钮事件
      handleCheck (row) {
        this.conf = { ...row }
        this.openEditPage('check')
      },
      /* [数据接口] */
      // 重置对象
      resetConf () {
        this.conf = {
          id: '',
          typeId: this.currentTreeNode ? this.currentTreeNode.id : '',
          confName: '',
          confCode: '',
          confValue: '',
          realValue: '',
          valueMode: '',
          valueRange: '',
          realValueRange: '',
          sortNum: 0,
          desc: ''
        }
      },
      // tree:初始化树结构
      initTree () {
        this.treeData = []
        // 请求响应返回树结构 这里这拉取conf ，参数设置下的类型树
        api.getTypeTree('conf').then(response => {
          const tree = response.data.data || []
          let mapper = node => {
            return {
              id: node.id,
              title: node.text,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = tree[0] ? mapper(tree[0]) : []
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.typeId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.searchList()
          }
        })
      },
      // 查询所有列表
      searchList () {
        this.setListData()
        api.getConfList(this.listQuery).then(response => {
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
