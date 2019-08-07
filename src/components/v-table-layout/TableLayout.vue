<template>
  <div class="table-layout-wrapper">
    <div class="tree-view" v-if="$slots.tree">
      <div class="tree-inner">
        <b-scrollbar style="height: 100%;">
          <slot name="tree">树插槽</slot>
        </b-scrollbar>
      </div>
    </div>
    <div class="table-view">
      <b-container>
        <div class="view-inner" style="margin-right: 20px;">
          <slot name="filter" v-if="$slots.filter">查询条件插槽</slot>
          <div class="button-bar">
            <b-button type="primary" v-waves size="small" @click="handleAdd">
              <i class="el-icon-circle-plus-outline"></i> 新增
            </b-button>
            <slot name="ctrl"></slot>
          </div>
          <div class="table-inner">
            <slot name="table"></slot>
          </div>
          <div class="page-bar">
            <slot name="pager"></slot>
          </div>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTableLayout',
    methods: {
      handleAdd () {
        this.$emit('on-create')
      }
    }
  }
</script>
