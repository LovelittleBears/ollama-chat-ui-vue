<!--  -->
<script setup>
defineEmits(['close'])
defineProps({ condition: Boolean })

</script>

<template>
  <div @click="$emit('close')" :class="condition ? 'visible' : 'invisible'" class="model"> </div>
  <!-- <div @click="$emit('close')" :class="'invisible'" > </div> -->
  <div class="pop-window-content" :class="condition ? 'visible' : 'invisible-scale'">
    <div class="icon icon-close" @click="$emit('close')"></div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 990;
  backdrop-filter: blur(4px);

  transition: all 0.1s linear;
}

.invisible-scale {
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, -50%) scale(.95) !important;
}

.pop-window-content {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 999;
  padding: 1em;
  overflow: auto;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  width: 800px;
  min-height: 400px;
  max-width: 80%;
  max-height: 80%;
  background-color: #fff;
  box-shadow: 0px 0px 6px rgba(54, 83, 56, 0.297);
  transition: all 0.1s ease-out;
}

.icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  mask-image: url('@/assets/svg/cancel.svg');

  &:hover {
    background-color: red;
  }
}
</style>
