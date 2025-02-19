<template>
  <button class="button cancel-btn" @click="$emit('onClick')">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.button {
  padding: 4px 11px;
  font-size: 14px;
  line-height: 1.5;
  color: inherit;
  border-radius: 2px;
  cursor: pointer;
}

.cancel-btn {
  border: 1px solid var(--border-primary);
  background-color: var(--btn-bgc-1);

  &:active {
    background-color: var(--btn-active-1) !important;
  }

  &:hover {
    background-color: var(--btn-hover-1);
  }
}
</style>
