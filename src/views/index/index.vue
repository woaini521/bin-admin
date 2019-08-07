<template>
  <b-container>
    <div class="index-wrap">
      <div class="info">
        <h2>介绍</h2>
        <b-alert show-icon>
          本项目默认你有一定的 Vue 基础和 bin-ui , element-ui 使用经验,如果你对这些还不熟悉，我们建议你先查阅相关文档
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
