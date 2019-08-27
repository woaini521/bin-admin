<template>
  <div style="height:100%;">
    <transition name="fade-transverse" mode="out-in" @enter="enter">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['cachedViews']),
      key () {
        return this.$route.fullPath
      }
    },
    methods: {
      enter: function (el) {
        const $parent = this.$parent
        if ($parent && $parent.$options.name === 'Layout') {
          $parent.calcTableWidth()
        }
      }
    }
  }
</script>
