export default {
  data () {
    return {
      tableWrapWidth: 0,
      currentTreeNode: null,
      filterOpened: false, // 查询列表是否打开
      listQuery: { // 查询通用条件,组件内部的可删除
        size: 10,
        page: 1
      },
      total: 0, // 当前页面显示的总数据,
      list: [], // 当前页面显示的数据列表
      listLoading: false, // 列表加载状态
      btnLoading: false, // 按钮加载状态
      dialogFormVisible: false, // 编辑页是否显示
      dialogStatus: '' // 编辑页显示状态[create,check,modify]
    }
  },
  computed: {
    editTitle () {
      const map = {
        check: '查看',
        modify: '修改',
        create: '新增'
      }
      return map[this.dialogStatus] || '标题'
    },
    tableWidth () {
      // 没有树结构的表格宽度= wrap -15*2 - 20*2
      return this.tableWrapWidth - 70
    },
    treeTableWidth () {
      // 包含树结构的表格宽度= wrap -15*2 - 20*2 -200
      return this.tableWrapWidth - 270
    }
  },
  mounted () {
    this.$EventBus.$on('/layout/resize', this._resizeTable)
  },
  methods: {
    // 1.监听窗口变化重置表格最大高度
    _resizeTable (width) {
      this.tableWrapWidth = width
      this.$refs.table && this.$refs.table.handleResize()
    },
    // 设置列表数据
    setListData (obj) {
      if (obj) {
        this.list = obj.list
        this.total = obj.total
        this.listLoading = false
      } else {
        this.list = []
        this.listLoading = true
      }
    },
    // 打开编辑页面
    openEditPage (status) {
      this.dialogStatus = status
      this.dialogFormVisible = true
      this.$refs.form && this.$refs.form.resetFields()
    },
    // 弹窗取消
    handleCancel () {
      this.$confirm({
        title: '警告',
        content: '此操作会清空当前操作，是否继续？',
        onOk: () => {
          this.dialogFormVisible = false
        }
      })
    },
    // 组件内部overwrite
    searchList () {
      console.error('searchList need overwrite (from mixin)')
    },
    // 查询条件查询
    handleFilter () {
      this.listQuery.page = 1
      this.searchList()
    },
    // 分页大小事件 */
    handleSizeChange (size) {
      this.listQuery.page = 1
      this.listQuery.size = size
      this.searchList()
    },
    // 分页跳转事件 */
    handleCurrentChange (page) {
      this.listQuery.page = page
      this.searchList()
    }
  }
}
