<template>
   <el-button class="button" v-if="type==2" type="primary"  @click="$emit('onClick')">
    <slot></slot>
  </el-button>
  <el-button class="button" v-else @click="$emit('onClick')">
    <slot></slot>
  </el-button>
  <!-- <button class="button submit-btn" @click="$emit('onClick')">
    <slot></slot>
  </button> -->
</template>
<script setup>
defineProps({ type: String })
</script>
<style scoped lang="scss">
.button {
  border-radius: 5px;
  width: 100px;
}
</style>
