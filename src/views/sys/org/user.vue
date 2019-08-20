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
        <b-switch size="large" v-model="listQuery.status" :true-value="ENUM.DISABLE" :false-value="ENUM.ENABLE"
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
        <b-tag v-if="scope.row.status===ENUM.INIT" type="primary">初始</b-tag>
        <b-switch v-else
                  v-model="scope.row.status" :true-value="ENUM.ENABLE" :false-value="ENUM.DISABLE"
                  inactive-color="#ff4949" size="large"
                  @on-change="handleChangeStatus(scope.row)">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </b-switch>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
        <b-button :disabled="canModify && scope.row.status===ENUM.DISABLE"
                  type="text" @click="handleModify(scope.row)" v-waves>
          修改
        </b-button>
        <!--是否有重置密码-->
        <template v-if="canModify">
          <b-divider type="vertical"></b-divider>
          <b-button type="text" v-waves @click="handleResetPwd(scope.row)">重置密码</b-button>
        </template>
        <!--是否有删除键-->
        <template v-if="canRemove && scope.row.status===ENUM.DISABLE">
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
        <v-key-label label="登录名称" is-half is-first>{{ user.username }}</v-key-label>
        <v-key-label label="用户编码" is-half>{{ user.userCode }}</v-key-label>
        <v-key-label label="中文名称" is-half is-first>{{ user.realName }}</v-key-label>
        <v-key-label label="电话号码" is-half>{{ user.mobile | mobileFilter }}</v-key-label>
        <v-key-label label="所属组织" is-half is-first>{{ currentTreeNode.title }}</v-key-label>
        <v-key-label label="电子邮件" is-half>{{ user.email }}</v-key-label>
        <v-key-label label="角色">
          <template v-if="user.roles">
            <b-tag type="info" v-for="role in user.roles" :key="role.id">{{ role.name }}</b-tag>
          </template>
          <span v-else>未选择</span>
        </v-key-label>
        <v-key-label label="备注" is-bottom>{{ user.remark }}</v-key-label>
        <div style="padding: 10px;text-align: center;">
          <b-button v-waves @click="dialogFormVisible=false">返 回</b-button>
        </div>
      </div>
      <!--增加编辑区域-->
      <div v-else style="width: 880px;padding: 20px 0 0 60px;">
        <b-form :model="user" ref="form" :rules="ruleValidate" :label-width="100">
          <div flex="box:mean">
            <b-form-item label="登录名称" prop="username">
              <!--登录名称编辑时不可修改-->
              <b-input v-model="user.username" placeholder="请输入登录名称" clearable
                       :disabled="dialogStatus==='modify'"></b-input>
            </b-form-item>
            <b-form-item label="用户编码" prop="userCode">
              <b-input v-model="user.userCode" placeholder="请输入用户编码" clearable></b-input>
            </b-form-item>
          </div>
          <div flex="box:mean">
            <b-form-item label="中文名称" prop="realName">
              <b-input v-model="user.realName" placeholder="请输入中文名称" clearable></b-input>
            </b-form-item>
            <b-form-item label="手机号码" prop="mobile">
              <b-input v-model="user.mobile" placeholder="请输入手机号码" clearable></b-input>
            </b-form-item>
          </div>
          <div flex="box:mean">
            <b-form-item label="所属组织">
              <b-input v-if="currentTreeNode" :value="currentTreeNode.title" disabled></b-input>
            </b-form-item>
            <b-form-item label="电子邮件" prop="email">
              <b-input v-model="user.email" placeholder="请输入邮箱" clearable></b-input>
            </b-form-item>
          </div>
          <b-form-item label="角色">
            <b-tag :key="role.id" v-for="role in user.roles"
                   :closable="!isAdmin(user)" @on-close="handleRemoveRole(role)">
              {{ role.name }}
            </b-tag>
            <b-button type="primary" v-waves size="small" style="vertical-align: middle;" plain
                      :disabled="isAdmin(user)" @click="handleShowDialogChoose">选择角色
            </b-button>
          </b-form-item>
          <b-form-item label="备注" prop="remark">
            <b-input v-model="user.remark" placeholder="请输入备注" type="textarea"></b-input>
          </b-form-item>
          <b-form-item>
            <b-button type="primary" v-waves @click="handleSubmit" :loading="btnLoading">确 定</b-button>
            <b-button v-waves @click="handleCancel">取 消</b-button>
          </b-form-item>
        </b-form>
      </div>
    </b-drawer>
    <!--角色选择弹窗-->
    <role-choose ref="roleChoose" @on-choose="handleChooseOne"></role-choose>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import permission from '../../../mixins/permission'
  import { getDeptTree } from '../../../api/management/depart'
  import * as api from '../../../api/management/userManage'
  import { getUserStatus } from '../../../api/enum'
  import { isEmail, isTelCode } from '../../../utils/validate'
  import { Decrypt, Encrypt } from '../../../utils/secret'
  import { deepCopy } from '../../../utils/assist'
  import RoleChoose from '../auth/role-choose'
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'User',
    components: { RoleChoose },
    mixins: [commonMixin, permission],
    data () {
      const validateUsername = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneUsername(this.user).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('登录名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateUserCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneUserCode(this.user).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('用户编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (value.length > 0) {
          if (isTelCode(value)) {
            // 手机号加密后比对是否重复
            let encrypt = Encrypt(value)
            api.oneMobile({ id: this.user.id, mobile: encrypt }).then(response => {
              if (response.data.data === 0) {
                callback()
              } else {
                callback(new Error('电话号码重复'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('输入正确的电话号码格式'))
          }
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (value.length > 0) {
          if (isEmail(value)) {
            api.oneEmail(this.user).then(response => {
              if (response.data.data === 0) {
                callback()
              } else {
                callback(new Error('邮箱重复'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('输入正确的邮箱地址'))
          }
        } else {
          callback()
        }
      }
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
          { title: '用户编码', key: 'userCode', align: 'center' },
          { title: '用户状态', slot: 'status', width: 180, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        user: null,
        ruleValidate: {
          username: [requiredRule, { validator: validateUsername, trigger: 'blur' }],
          userCode: [requiredRule, { validator: validateUserCode, trigger: 'blur' }],
          mobile: [{ validator: validateMobile, trigger: 'blur' }],
          email: [{ validator: validateEmail, trigger: 'blur' }]
        },
        statusMap: { 'I': '初始', 'Y': '启用', 'D': '禁用' }
      }
    },
    filters: {
      mobileFilter (value) {
        return value && value.length > 0 ? Decrypt(value) : ''
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
          status: this.ENUM.ENABLE,
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
        this.user = deepCopy({ ...this.user, ...row })
        // 解密手机号显示
        this.user.mobile = Decrypt(this.user.mobile)
        this.openEditPage('modify')
      },
      // 弹窗选择角色
      handleShowDialogChoose () {
        this.$refs.roleChoose && this.$refs.roleChoose.open()
      },
      // 选中一个角色
      handleChooseOne (role) {
        if (role.id && role.id.length > 0) {
          if (this.user.roles.findIndex(item => item.id === role.id) === -1) {
            this.user.roles.push(role)
          }
        }
      },
      // 删除一个角色
      handleRemoveRole (role) {
        this.user.roles.splice(this.user.roles.indexOf(role), 1)
      },
      // 当前用户是否是管理员
      isAdmin (user) {
        return user.id ? user.id === 'pre_ncloud_sys_user_10000' : false
      },
      // 查看按钮事件
      handleCheck (row) {
        this.user = { ...row }
        this.openEditPage('check')
      },
      // 表单提交
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createUser : api.modifyUser
            fun(this.user).then(res => {
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
      // 单个启用禁用
      handleChangeStatus (row) {
        let user = { ...row }
        api.changeStatus(user).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            // this.handleFilter()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove (row) {
        let user = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前用户吗？`,
          loading: true,
          onOk: () => {
            api.removeUser(user).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 弹窗提示是否重置用户的密码
      handleResetPwd (row) {
        let user = { ...row }
        this.$confirm({
          title: '警告',
          content: `确定要重置此用户的密码吗？`,
          loading: true,
          onOk: () => {
            api.resetUserPwd(user).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
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
          status: this.ENUM.ENABLE,
          email: '',
          mobile: '',
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
          }
        })
      }
    }
  }
</script>
