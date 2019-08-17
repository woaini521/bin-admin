// 参数设置组件，根据传入的类型去生成不同的组件
const STRING = '1'
const RADIO = '2'
const CHECKBOX = '3'
export default {
  name: 'param-conf',
  data () {
    return {
      currentValue: this.value,
      items: []
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    valueMode: {
      type: String,
      default: '1' // { '1': '字符串', '2': '内部单选', '3': '内部多选' }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  render (h) {
    let node
    if (this.valueMode === STRING) { // 如果是字符串则渲染输入框
      node = h('b-input', {
        props: {
          value: this.value,
          placeholder: '请输入参数值',
          clearable: true
        },
        on: { input: this.handleInput }
      })
    } else if (this.valueMode === RADIO) { // 单选框组件
      node = h('b-radio-group', {
          props: {
            value: this.value
          },
          on: { input: this.radioChange }
        },
        this.options.map((item) => {
          return h('b-radio', {
            props: { label: item.value }
          }, [item.label])
        })
      )
    } else { // 多选框组件
      node = h('b-checkbox-group', {
          props: {
            value: this.items
          },
          on: { input: this.checkboxChange }
        },
        this.options.map((item) => {
          return h('b-checkbox', {
            props: { label: item.value }
          }, [item.label])
        })
      )
    }
    return node
  },
  watch: {
    value: {
      handler (val) {
        // 缓存选中数组
        this.items = this.valueMode === CHECKBOX ? val.split(',') : []
      },
      immediate: true
    }
  },
  methods: {
    // 输入框输入
    handleInput (value) {
      this.$emit('input', value)
    },
    // 单选框改变
    radioChange (value) {
      this.$emit('input', value)
    },
    // 多选框数组转换成字符串
    checkboxChange (arr) {
      let value = []
      // 根据原options数组来决定选中顺序
      this.options.forEach(item => {
        if (arr.includes(item.value)) {
          value.push(item.value)
        }
      })
      this.$emit('input', value.join(','))
    }
  }
}
