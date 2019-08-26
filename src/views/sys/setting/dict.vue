<template>
  <v-table-layout>
    <!--查询条件-->
    <v-filter-bar slot="filter">
      <v-filter-item title="字典名称">
        <b-input v-model.trim="listQuery.groupName" size="small" placeholder="请输入字典名称" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="字典编码">
        <b-input v-model.trim="listQuery.groupCode" size="small" placeholder="请输入字典编码" clearable></b-input>
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
      <!--字典类型-->
      <template v-slot:dictType="scope">
        {{ dictTypeMap[scope.row.dictType] }}
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button :disabled="!canModify" type="text" @click="handleDictItem(scope.row)" v-waves>字典项</b-button>
        <b-divider type="vertical"></b-divider>
        <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)" v-waves>修改</b-button>
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
    <b-drawer v-model="dialogFormVisible" :title="editTitle"
              :append-to-body="false" :mask-closable="false" width="500px" footer-hide>
      <!--增加编辑区域-->
      <div v-if="dialogStatus!=='check'" style="padding: 20px;">
        <b-form :model="dict" ref="form" :rules="ruleValidate" label-position="top">
          <b-form-item label="字典编码" prop="groupCode">
            <b-input v-model="dict.groupCode" placeholder="请输入字典编码" clearable></b-input>
          </b-form-item>
          <b-form-item label="字典名称" prop="groupName">
            <b-input v-model="dict.groupName" placeholder="请输入字典名称" clearable></b-input>
          </b-form-item>
          <b-form-item label="字典类型" prop="dictType">
            <b-select v-model="dict.dictType" size="large">
              <b-option v-for="item in dictTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
            </b-select>
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
    <!--字典项弹窗-->
    <dict-item ref="dictItem"></dict-item>
  </v-table-layout>
</template>

<script>
  import commonMixin from '../../../mixins/mixin'
  import permission from '../../../mixins/permission'
  import * as api from '../../../api/sys/dict'
  import { getDictType } from '../../../api/enum'
  import DictItem from '../components/dict-item'
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'Dict',
    components: { DictItem },
    mixins: [commonMixin, permission],
    data () {
      const validateDictGroupCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneGroupCode(this.dict).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('字典组编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateDictGroupName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneGroupName(this.dict).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('字典组名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        listQuery: {
          groupName: '',
          groupCode: ''
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
          { title: '字典编码', key: 'groupCode' },
          { title: '字典名称', key: 'groupName' },
          { title: '字典类型', slot: 'dictType', width: 120, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        dict: null,
        ruleValidate: {
          groupCode: [requiredRule, { validator: validateDictGroupCode, trigger: 'blur' }],
          groupName: [requiredRule, { validator: validateDictGroupName, trigger: 'blur' }]
        },
        dictTypeMap: { 'SYS': '系统字典', 'EXT': '内部单选' } // 默认值
      }
    },
    computed: {
      dictTypeOptions () {
        let ret = []
        Object.keys(this.dictTypeMap).forEach(key => {
          ret.push({ value: key, label: this.dictTypeMap[key] })
        })
        return ret
      },
      ENUM () {
        return { SYS: 'SYS', EXT: 'EXT' } // 常量比对键值对
      }
    },
    created () {
      this.getDictTypeEnum()
      this.resetDict()
      this.searchList()
    },
    methods: {
      /* [事件响应] */
      // filter-Bar:重置查询条件
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          groupName: '',
          groupCode: ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate () {
        this.resetDict()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify (row) {
        this.resetDict()
        this.dict = { ...this.dict, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove (row) {
        let dict = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前字典组吗？`,
          loading: true,
          onOk: () => {
            api.removeDictGroup(dict).then(res => {
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
            let fun = this.dialogStatus === 'create' ? api.createDictGroup : api.modifyDictGroup
            fun(this.dict).then(res => {
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
      // 弹出字典项编辑页
      handleDictItem (row) {
        this.$refs.dictItem && this.$refs.dictItem.open(row)
      },
      /* [数据接口] */
      // 通用枚举
      getDictTypeEnum () {
        getDictType().then(res => {
          if (res.status === 200) {
            this.dictTypeMap = res.data.data
          }
        })
      },
      // 重置对象
      resetDict () {
        this.dict = {
          id: '',
          groupCode: '',
          groupName: '',
          dictType: this.ENUM.EXT
        }
      },
      // 查询所有列表
      searchList () {
        this.setListData()
        api.getDictGroupList(this.listQuery).then(response => {
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
