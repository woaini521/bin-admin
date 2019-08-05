<template>
  <b-container>
    <div class="index-wrap">
      <div class="info">
        <h2>介绍</h2>
        <p>
          Bin Admin 是一个企业级中后台前端/设计解决方案，在基于BinUI 基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，
          进一步提升企业级中后台产品设计研发过程中的『用户』体验。随着业务逻辑的不断增加，我们将持续迭代，逐步沉淀和总结出更多设计模式和相应的代码实现，
          阐述中后台产品模板/组件/业务场景的最佳实践，也十分期待你的反馈。
        </p>
        <b-alert show-icon>
          本项目默认你有一定的 Vue 基础和 bin-ui , element-ui 使用经验,如果你对这些还不熟悉，我们建议你先查阅相关文档，下方会统一给出文档连接
        </b-alert>
      </div>
    </div>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['userInfo'])
    }
  }
</script>

<style scoped lang="stylus">
  .index-wrap {
    .logo {
      padding: 50px;
      text-align: center;
    }
    .info {
      padding: 20px;
      color: #314659;
      font-size: 14px;
      line-height: 2;
      p, pre {
        padding: 12px 20px;
        margin: 16px 0;
        overflow: auto;
      }
      pre {
        border-radius: 2px;
        background: #f2f4f5;
        font-family: Lucida Console, Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
      }
      .link {
        padding: 0 10px;
      }
    }
  }
</style>
