<!--  -->
<script setup>
import PopWindow from '@/views/aiSystem/components/PopWindow.vue'
defineProps(['form', 'models', 'prompts', 'condition'])
defineEmits(['close', 'submit'])
</script>

<template>
  <PopWindow :condition="condition" @close="$emit('close')">
    <div class="pop-window-header">
      <h2 class="title">Edit Agent</h2>
    </div>
    <div class="pop-window-body">
      <div class="label">Agent name <span class="desc">required</span></div>
      <input type="text" v-model="form.name" placeholder="Agent name" />
      <div class="label">Agent persona</div>
      <el-select v-model="form.prompt" clearable placeholder="select a template">
        <el-option v-for="v in prompts" :key="v.key" :label="v.key" :value="v.key" />
      </el-select>
      <div class="label">Weight <span class="desc"></span></div>
      <input type="text" v-model="form.weight" placeholder="For sort" />
    </div>
    <div class="pop-window-footer">
      <div class="form-btn">
        <SubmitBtn @click="$emit('submit')">Done</SubmitBtn>
      </div>
    </div>
  </PopWindow>
</template>

<style scoped lang="scss">
@import url('./style.scss');
</style>
