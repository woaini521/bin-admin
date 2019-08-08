<template>
  <v-table-layout>
    <!--树结构-->
    <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="部门名称">
        <b-input v-model.trim="listQuery.departName" size="small" placeholder="请输入部门名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="显示禁用">
        <b-switch size="large" v-model="listQuery.delFlag">
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
    <b-table slot="table" :columns="columns" :data="list" :loading="listLoading" stripe>
      <template v-slot:departName="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.departName }}</a>
      </template>
      <!--状态-->
      <template v-slot:delFlag="scope">
        <b-tag v-if="scope.row.delFlag==='N'" type="success">启用</b-tag>
        <b-tag v-else type="danger">禁用</b-tag>
      </template>
      <template v-slot:action="scope">
        <a href="" @click.stop.prevent="handleModify(scope.row)">编辑</a>
      </template>
    </b-table>
    <!--下方分页器-->
    <b-page slot="pager" :total="total" show-sizer></b-page>
    <!--编辑抽屉-->
    <b-drawer v-model="dialogFormVisible" :append-to-body="false" fullscreen footer-hide :title="editTitle">
      <!--查询内容区域-->
      <div v-if="dialogStatus==='check'" style="width: 880px;padding: 20px 0 0 20px;">
        <v-key-label label="部门名称" label-width="150px" is-half is-first>{{ depart.departName }}</v-key-label>
        <v-key-label label="部门全称" is-half>{{ depart.fullName }}</v-key-label>
        <v-key-label label="统一社会信用代码" label-width="150px" is-half is-first>{{ depart.unifiedCode }}</v-key-label>
        <v-key-label label="部门编码" is-half>{{ depart.departCode }}</v-key-label>
        <v-key-label label="备注" label-width="150px" is-bottom>{{ depart.remark }}</v-key-label>
        <div style="padding: 10px;text-align: center;">
          <b-button v-waves @click="dialogFormVisible=false">取 消</b-button>
        </div>
      </div>
      <!--增加编辑区域-->
      <div v-else style="width: 880px;padding: 20px 0 0 60px;">
        <!--调试用，显示id-->
        <b-form :model="depart" ref="form" :rules="ruleValidate" :label-width="130">
          <div flex="box:mean">
            <b-form-item label="部门名称" prop="departName">
              <b-input v-model="depart.departName" placeholder="请输入部门名称" clearable></b-input>
            </b-form-item>
            <b-form-item label="统一社会信用代码" prop="unifiedCode">
              <b-input v-model="depart.unifiedCode" placeholder="请输入统一社会信用代码" clearable></b-input>
            </b-form-item>
          </div>
          <div flex="box:mean">
            <b-form-item label="部门编码" prop="departCode">
              <b-input v-model="depart.departCode" placeholder="请输入部门编码" clearable></b-input>
            </b-form-item>
            <b-form-item label="部门全称" prop="fullName">
              <b-input v-model="depart.fullName" placeholder="请输入部门全称" clearable></b-input>
            </b-form-item>
          </div>
          <div flex="box:mean">
            <b-form-item label="上级部门">
              <b-input v-if="currentTreeNode" :value="currentTreeNode.title" disabled></b-input>
            </b-form-item>
            <b-form-item label="行政区划代码" prop="regionId">
              <b-input v-model="depart.regionId" placeholder="请输入行政区划代码" clearable></b-input>
            </b-form-item>
          </div>
          <div flex="box:mean">
            <b-form-item label="部门类型" prop="departKind">
              <b-select v-model="depart.departKind">
                <b-option value="机构">机构</b-option>
                <b-option value="一般组织">一般组织</b-option>
              </b-select>
            </b-form-item>
            <b-form-item label="排序编号" prop="sortNum">
              <b-input-number :min="0" v-model="depart.sortNum" style="width: 100%;"></b-input-number>
            </b-form-item>
          </div>
          <b-form-item label="备注" prop="remark">
            <b-input v-model="depart.remark" placeholder="请输入备注" clearable type="textarea"></b-input>
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
  import * as api from '../../../api/management/depart'
  import { verifyUnifiedCode } from '../../../utils/validate'

  export default {
    name: 'Dept',
    mixins: [commonMixin, permission],
    data () {
      const validateDepartName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneDeptName(this.depart).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('部门名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateDepartCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneDeptCode(this.depart).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('部门编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateUnified = (rule, value, callback) => {
        if (value.length > 0) {
          if (value === '00000000000000000X') {
            callback()
          } else {
            if (verifyUnifiedCode(value)) {
              api.oneDeptUnified(this.depart)
                .then(response => {
                  if (response.data.data === 0) {
                    callback()
                  } else {
                    callback(new Error('部门编码重复'))
                  }
                })
                .catch(() => {
                  callback(new Error('请求验证重复性出错'))
                })
            } else {
              callback(new Error('请输入正确的统一社会信用代码'))
            }
          }
        }
      }
      return {
        listQuery: {
          departName: '',
          parentId: '',
          delFlag: false
        },
        treeData: [],
        columns: [
          { title: '部门名称', slot: 'departName' },
          { title: '统一社会信用代码', key: 'unifiedCode' },
          { title: '部门全称', key: 'fullName' },
          { title: '状态', slot: 'delFlag' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
        ],
        depart: null,
        ruleValidate: {
          departName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' },
            { validator: validateDepartName, trigger: 'blur' }
          ],
          departCode: [
            { required: true, message: '部门编码不能为空', trigger: 'blur' },
            { validator: validateDepartCode, trigger: 'blur' }
          ],
          unifiedCode: [
            { required: true, message: '统一社会信用代码必填', trigger: 'blur' },
            { validator: validateUnified, trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.initTree()
      this.resetDept()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange (data, node) {
        this.currentTreeNode = node
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.depart.parentId = node.id
        } else {
          this.listQuery.parentId = node.id
          this.handleFilter()
        }
      },
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          departName: '',
          delFlag: false
        }
      },
      // 新增按钮事件
      handleCreate () {
        this.resetDept()
        this._openEditPage('create')
      },
      // 编辑事件
      handleModify (row) {
        this.depart = { ...row }
        this._openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck (row) {
        this.depart = { ...row }
        this._openEditPage('check')
      },
      // 表单提交
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createDept : api.modifyDept
            fun(this.depart).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.initTree()
              } else {
                this.$message({ type: 'error', content: res.data.message })
              }
            })
            console.log(this.depart)
          }
        })
      },
      /* [数据接口] */
      // tree:初始化树结构
      // 重置栏目对象
      resetDept () {
        this.depart = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          departName: '',
          departCode: '',
          departKind: '',
          regionId: '',
          sortNum: 0,
          unifiedCode: '00000000000000000X',
          fullName: '',
          remark: ''
        }
      },
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
            this.$set(this.treeData[0], 'expand', true)
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
            console.log(this.list)
          }
        })
      }
    }
  }
</script>
