<template>
  <v-table-layout>
    <!--树结构-->
    <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect" ref="tree"
            @on-select-change="handTreeCurrentChange"></b-tree>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="类别名称">
        <b-input v-model.trim="listQuery.typeName" size="small" placeholder="请输入类别名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="类别编码">
        <b-input v-model.trim="listQuery.typeCode" size="small" placeholder="请输入类别编码" clearable></b-input>
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
    <b-drawer v-model="dialogFormVisible" :append-to-body="false" :title="editTitle"
              footer-hide fullscreen>
      <!--增加编辑区域-->
      <div v-if="dialogStatus!=='check'" style="width: 880px;padding: 20px 0 0 60px;">
        <!--调试用，显示id-->
        <b-form :model="type" ref="form" :rules="ruleValidate" :label-width="130">
          <div flex="box:mean">
            <b-form-item label="类别名称" prop="typeName">
              <b-input v-model="type.typeName" placeholder="请输入类别名称" clearable></b-input>
            </b-form-item>
            <b-form-item label="类别编码" prop="typeCode">
              <b-input v-model="type.typeCode" placeholder="请输入类别编码" clearable></b-input>
            </b-form-item>
          </div>
          <div flex="box:mean">
            <b-form-item label="父级类别">
              <b-input v-if="currentTreeNode" :value="currentTreeNode.title" disabled></b-input>
            </b-form-item>
            <b-form-item label="排序编号" prop="sortNum">
              <b-input-number :min="0" v-model="type.sortNum" style="width: 100%;"></b-input-number>
            </b-form-item>
          </div>
          <b-form-item label="描述" prop="desc">
            <b-input v-model="type.desc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
          <b-form-item>
            <b-button type="primary" v-waves @click="handleSubmit" :loading="btnLoading">确 定</b-button>
            <b-button v-waves @click="handleCancel">取 消</b-button>
          </b-form-item>
        </b-form>
      </div>
    </b-drawer>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import permission from '../../../mixins/permission'
  import * as api from '../../../api/sys/paramType'
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'ParamType',
    mixins: [commonMixin, permission],
    data () {
      const validateTypeName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneTypeName(this.type).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('类别名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateTypeCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneTypeCode(this.type).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('类别编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        listQuery: {
          typeName: '',
          parentId: ''
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
          { title: '类别名称', key: 'typeName' },
          { title: '类别编码', key: 'typeCode', width: 120, align: 'center' },
          { title: '完整编码', key: 'route', align: 'center' },
          { title: '排序编号', key: 'sortNum', width: 120, align: 'center' },
          { title: '描述', key: 'desc', width: 300, tooltip: true },
          { title: '操作', slot: 'action', width: 180 }
        ],
        type: null,
        ruleValidate: {
          typeName: [requiredRule, { validator: validateTypeName, trigger: 'blur' }],
          typeCode: [requiredRule, { validator: validateTypeCode, trigger: 'blur' }]
        }
      }
    },
    created () {
      this.initTree()
      this.resetType()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange (data, node) {
        this.currentTreeNode = node
        this.listQuery.parentId = node.id
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.type.parentId = node.id
        }
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          typeName: '',
          typeCode: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate () {
        this.resetType()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify (row) {
        this.resetType()
        this.type = { ...this.type, ...row }
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck (row) {
        this.type = { ...row }
        this.openEditPage('check')
      },
      // 弹窗提示是否删除
      handleRemove (row) {
        let type = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前类别吗？`,
          loading: true,
          onOk: () => {
            api.removeType(type).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.initTree()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 表单提交
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createType : api.modifyType
            fun(this.type).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.initTree()
              } else {
                this.$message({ type: 'error', content: res.data.message })
              }
            })
          }
        })
      },
      /* [数据接口] */
      // 重置对象
      resetType () {
        this.type = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          typeName: '',
          typeCode: '',
          sortNum: 0,
          desc: ''
        }
      },
      // tree:初始化树结构
      initTree () {
        this.treeData = []
        // 请求响应返回树结构
        api.getTypeTree().then(response => {
          const tree = response.data.data || []
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree[0] ? this.treeMapper(tree[0]) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              // 这里要注意，扩展响应式属性需要这么写
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.parentId = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      },
      // 查询所有列表
      searchList () {
        this.setListData()
        api.getTypeList(this.listQuery).then(response => {
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
