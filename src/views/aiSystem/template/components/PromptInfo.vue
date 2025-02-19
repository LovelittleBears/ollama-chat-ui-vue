<!--  -->
<script setup>
import PopWindow from '@/views/aiSystem/components/PopWindow.vue'
import SubmitBtn from '@/views/aiSystem/components/button/SubmitBtn.vue'
defineProps(['form', 'condition'])
defineEmits(['submit', 'close'])
</script>

<template>
  <PopWindow :condition="condition" @close="$emit('close')">
    <div class="pop-window-header">
      <h2 class="title">Prompt template</h2>
    </div>
    <div class="pop-window-body">
      <div class="label">Name <span class="desc">required unique</span></div>
      <input type="text" v-model="form.key" />
      <div class="label">Value <span class="desc">required</span></div>
      <textarea v-model="form.value"></textarea>
    </div>
    <div class="pop-window-footer">
      <SubmitBtn @click="$emit('submit')">Done</SubmitBtn>
    </div>
  </PopWindow>

</template>

<style scoped lang="scss">
.pop-window-header {

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
    color: var(--text-03);
  }
}

.pop-window-body {
  flex: 1;
  margin: 2em 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .label {
    font-weight: 400;
    color: var(--text-02);

    .desc {
      font-size: 0.8rem;
      color: #979797;
    }
  }

  input,
  textarea {
    padding: 4px 11px;
    font-size: 14px;
    line-height: 1.5;
    color: #444c3f;
    outline: none;
    border: 1px solid #9cb294;
    background-color: var(--bgc-02);
    border-radius: 2px;
  }

  textarea {
    min-height: 200px;
    height: auto;
    resize: vertical;
  }
}

.pop-window-footer {
  display: flex;
  justify-content: end;
}
</style>
