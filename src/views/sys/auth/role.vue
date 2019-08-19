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
    <b-table slot="table" :columns="columns" :data="list" :loading="listLoading"
             stripe max-height="526" ref="table" :width="tableWidth">
      <template v-slot:name="scope">
        <a href="" @click.stop.prevent="handleCheck(scope.row)">{{ scope.row.name }}</a>
      </template>
      <template v-slot:roleType="scope">
        <b-tag v-if="scope.row.roleType===ENUM.I" type="primary">{{ roleTypeMap[scope.row.roleType] }}</b-tag>
        <b-tag v-else type="warning">{{ roleTypeMap[scope.row.roleType] }}</b-tag>
      </template>
      <!--角色授权栏-->
      <template v-slot:auth="scope">
        <b-button @click="handleRoleAuth(scope.row)" v-waves type="text" style="color:#1890ff;">编辑权限</b-button>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)" v-waves>修改</b-button>
        <!--是否有删除键-->
        <template v-if="canRemove && scope.row.roleType===ENUM.S">
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
              :mask-closable="false" width="880px" footer-hide>
      <!--查询内容区域-->
      <div v-if="dialogStatus==='check'" style="padding: 20px;">
        <v-key-label label="角色名称">{{ role.name }}</v-key-label>
        <v-key-label label="角色编码">{{ role.code }}</v-key-label>
        <v-key-label label="角色类型">{{ roleTypeMap[role.roleType] }}</v-key-label>
        <v-key-label label="父级角色名称">{{ role.parentName }}</v-key-label>
        <v-key-label label="描述" is-bottom>{{ role.desc }}</v-key-label>
        <div style="padding: 10px;text-align: center;">
          <b-button v-waves @click="dialogFormVisible=false">返 回</b-button>
        </div>
      </div>
      <div v-else style="padding: 20px;">
        <b-form :model="role" ref="form" :rules="ruleValidate" :label-width="100">
          <b-form-item label="角色名称" prop="name">
            <b-input v-model="role.name" placeholder="请输入角色名称" clearable></b-input>
          </b-form-item>
          <b-form-item label="角色编码" prop="code">
            <b-input v-model="role.code" placeholder="请输入角色编码" clearable></b-input>
          </b-form-item>
          <div flex="box:mean">
            <b-form-item label="父角色">
              <b-input :value="role.parentName" readonly class="choose-btn">
                <b-button slot="suffix" type="primary" v-waves @click="handleShowDialogChoose">
                  选择
                </b-button>
              </b-input>
            </b-form-item>
            <b-form-item label="角色类型" prop="roleType">
              <b-select v-model="role.roleType" placeholder="请选择角色类型" size="large">
                <b-option v-for="item in roleTypeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </b-option>
              </b-select>
            </b-form-item>
          </div>
          <b-form-item label="描述" prop="desc">
            <b-input v-model="role.desc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
          <b-form-item>
            <div style="text-align: center;">
              <b-button type="primary" v-waves @click="handleSubmit" :loading="btnLoading">确 定</b-button>
              <b-button v-waves @click="handleCancel">取 消</b-button>
            </div>
          </b-form-item>
        </b-form>
      </div>
    </b-drawer>
    <!--角色选择弹窗-->
    <role-choose ref="roleChoose" @on-choose="handleChooseOne"></role-choose>
    <!--角色授权抽屉-->
    <role-auth ref="roleAuth"></role-auth>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import permission from '../../../mixins/permission'
  import { getRoleType } from '../../../api/enum'
  import * as api from '../../../api/management/role'
  import RoleChoose from './role-choose'
  import RoleAuth from './role-auth'
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'Role',
    components: { RoleAuth, RoleChoose },
    mixins: [commonMixin, permission],
    data () {
      const validateName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneRoleName(this.role).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('角色名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneRoleCode(this.role).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('角色编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
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
          { title: '角色名称', slot: 'name' },
          { title: '角色编码', key: 'code' },
          { title: '父角色名称', key: 'parentName' },
          { title: '角色类型', slot: 'roleType' },
          { title: '描述', key: 'desc' },
          { title: '角色授权', slot: 'auth' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        role: null,
        ruleValidate: {
          name: [requiredRule, { validator: validateName, trigger: 'blur' }],
          code: [requiredRule, { validator: validateCode, trigger: 'blur' }]
        },
        roleTypeMap: { 'S': '系统创建', 'I': '内置角色' }
      }
    },
    computed: {
      roleTypeOptions () {
        let ret = []
        Object.keys(this.roleTypeMap).forEach(key => {
          ret.push({ value: key, label: this.roleTypeMap[key] })
        })
        return ret
      },
      ENUM () {
        return { S: 'S', I: 'I' } // 常量比对键值对I:系统角色，S：应用角色
      }
    },
    created () {
      this.getRoleTypeEnum()
      this.resetRole()
      this.searchList()
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
      // 编辑事件
      handleModify (row) {
        this.resetRole()
        this.role = { ...this.role, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove (row) {
        let role = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前角色吗？`,
          loading: true,
          onOk: () => {
            api.removeRole(role).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.searchList()
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
            let fun = this.dialogStatus === 'create' ? api.createRole : api.modifyRole
            fun(this.role).then(res => {
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
      // 弹窗选择角色
      handleShowDialogChoose () {
        this.$refs.roleChoose && this.$refs.roleChoose.open()
      },
      // 选中一个角色
      handleChooseOne (one) {
        // 获取选中角色并填充父角色id和名称
        this.role.parentId = one.id
        this.role.parentName = one.name
      },
      // 弹窗角色授权
      handleRoleAuth (row) {
        this.resetRole()
        this.role = { ...this.role, ...row }
        this.$refs.roleAuth && this.$refs.roleAuth.open(this.role)
      },
      /* [数据接口] */
      // 通用枚举
      getRoleTypeEnum () {
        getRoleType().then(res => {
          if (res.status === 200) {
            this.roleTypeMap = res.data.data
          }
        })
      },
      // 重置角色对象
      resetRole () {
        this.role = {
          id: '',
          name: '',
          code: '',
          roleType: this.ENUM.S,
          desc: '',
          parentId: '',
          parentName: ''
        }
      },
      // 查询所有部门列表
      searchList () {
        this.setListData()
        api.getRoleList(this.listQuery).then(response => {
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
