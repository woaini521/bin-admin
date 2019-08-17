<template>
  <v-table-layout>
    <!--树结构-->
    <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="部门名称">
        <b-input v-model.trim="listQuery.departName" size="small" placeholder="请输入部门名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="显示禁用" width="160px">
        <b-switch size="large" v-model="listQuery.delFlag" true-value="Y" false-value="N"
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
      <template v-slot:departName="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.departName }}</a>
      </template>
      <!--状态-->
      <template v-slot:delFlag="scope">
        <b-tag v-if="scope.row.delFlag==='N'" type="primary" size="medium">启用</b-tag>
        <b-tag v-else type="danger" size="medium">禁用</b-tag>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button :disabled="canModify && scope.row.delFlag==='Y'"
                  type="text" @click="handleModify(scope.row)" v-waves>
          修改
        </b-button>
        <!--有修改权限则显示启用禁用按钮-->
        <template v-if="canModify">
          <b-divider type="vertical"></b-divider>
          <b-button type="text" @click="handleChangeStatus(scope.row)" v-waves
                    :style="{color:scope.row.delFlag==='Y'?'green':'red'}">
            {{ scope.row.delFlag==='Y'?'启用':'禁用' }}
          </b-button>
        </template>
        <!--是否有删除键-->
        <template v-if="canRemove && scope.row.delFlag==='Y'">
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
        <v-key-label label="部门名称" label-width="150px" is-half is-first>{{ depart.departName }}</v-key-label>
        <v-key-label label="部门编码" is-half>{{ depart.departCode }}</v-key-label>
        <v-key-label label="部门类型" label-width="150px" is-half is-first>{{ depart.departKind }}</v-key-label>
        <v-key-label label="排序编号" is-half>{{ depart.sortNum }}</v-key-label>
        <v-key-label label="统一社会信用代码" label-width="150px" is-half is-first>{{ depart.unifiedCode }}</v-key-label>
        <v-key-label label="部门全称" is-half>{{ depart.fullName }}</v-key-label>
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
            <b-input v-model="depart.remark" placeholder="请输入备注" type="textarea"></b-input>
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

  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

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
      const validateDepartKind = (rule, value, callback) => {
        if (value.length > 0) {
          this.$refs.form && this.$refs.form.validateField('fullName')
          this.$refs.form && this.$refs.form.validateField('unifiedCode')
          callback()
        }
      }
      const validateFullName = (rule, value, callback) => {
        if (this.depart.departKind === '一般组织' && value.length === 0) {
          callback(new Error('一般组织类型需要填写部门全称'))
        } else {
          callback()
        }
      }
      const validateUnified = (rule, value, callback) => {
        console.log(value)
        if (this.depart.departKind === '一般组织') {
          if (value.length === 0) {
            callback(new Error('一般组织必须填写此项'))
          } else if (value === '00000000000000000X') {
            callback(new Error('一般组织不能填写此代码'))
          } else {
            callback()
          }
        } else {
          if (value === '00000000000000000X' || value.length === 0) {
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
          delFlag: 'N'
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
          { title: '类别名称', slot: 'departName' },
          { title: '完整编码', key: 'departCode', align: 'center' },
          { title: '类别编码', key: 'departKind', width: 120, align: 'center' },
          { title: '排序编号', key: 'fullName' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        depart: null,
        ruleValidate: {
          departName: [requiredRule, { validator: validateDepartName, trigger: 'blur' }],
          departCode: [requiredRule, { validator: validateDepartCode, trigger: 'blur' }],
          departKind: [
            { required: true, message: '必填项', trigger: 'change' },
            { validator: validateDepartKind, trigger: 'change' }
          ],
          fullName: [{ validator: validateFullName, trigger: 'blur' }],
          unifiedCode: [{ validator: validateUnified, trigger: 'blur' }]
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
          delFlag: 'N',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate () {
        this.resetDept()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify (row) {
        this.resetDept()
        this.depart = { ...this.depart, ...row }
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck (row) {
        this.depart = { ...row }
        this.openEditPage('check')
      },
      // 弹窗提示是否启用禁用
      handleChangeStatus (row) {
        let depart = { ...row }
        depart.delFlag = depart.delFlag === 'N' ? 'Y' : 'N'
        this.$confirm({
          title: '警告',
          content: `确认 [${depart.delFlag === 'N' ? '启用' : '禁用'}] 当前部门吗？`,
          onOk: () => {
            api.changeDelFlag(depart).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.initTree()
              } else {
                this.$message({ type: 'danger', content: '操作失败' })
              }
            })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove (row) {
        let depart = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前部门吗？`,
          loading: true,
          onOk: () => {
            api.removeDepart(depart).then(res => {
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
            let fun = this.dialogStatus === 'create' ? api.createDept : api.modifyDept
            fun(this.depart).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.$message({ type: 'error', content: res.data.message })
              }
            })
          }
        })
      },
      /* [数据接口] */
      // 重置对象
      resetDept () {
        this.depart = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          departName: '',
          departCode: '',
          departKind: '',
          regionId: '',
          sortNum: 0,
          unifiedCode: '',
          fullName: '',
          remark: ''
        }
      },
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
            this.$set(this.treeData[0], 'expand', true)
            this.searchList()
          }
        })
      },
      // 查询所有部门列表
      searchList () {
        this.setListData()
        api.getDeptList(this.listQuery).then(response => {
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
