<!--  -->
<script setup>
import PopWindow from '@/views/aiSystem/components/PopWindow.vue'
import SubmitBtn from "@/views/aiSystem/components/button/SubmitBtn.vue";
defineProps(['form', 'models', 'prompts', 'condition'])
defineEmits(['close', 'submit'])
</script>

<template>
  <PopWindow :condition="condition" @close="$emit('close')">
    <div class="pop-window-header">
      <h2 class="title">创建模型</h2>
    </div>
    <div class="pop-window-body">
      <div class="label">名字 <span class="desc">必选</span></div>
      <input type="text" v-model="form.name" placeholder="输入名字" />
      <div class="label">模型 <span class="desc">required</span></div>
      <el-select v-model="form.model" clearable placeholder="选择一个模型">
        <el-option v-for="v in models" :key="v.name" :label="v.name" :value="v.name" />
      </el-select>
      <div class="label">代练角色</div>
      <el-select v-model="form.prompt" clearable placeholder="选择一个角色">
        <el-option v-for="v in prompts" :key="v.key" :label="v.key" :value="v.key" />
      </el-select>
      <div class="label">排序 <span class="desc"></span></div>
      <input type="text" v-model="form.weight" placeholder="输入排序" />
    </div>
    <div class="pop-window-footer" style="margin-top: 20px;">
      <div class="form-btn">
        <SubmitBtn type="2" @click="$emit('submit')" >确定</SubmitBtn>
      </div>
    </div>
  </PopWindow>
</template>

<style scoped lang="scss">
@import url('./style.scss');
</style>
