<script setup>
import { ref, toRaw } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  option: Array,
});
const isOn = ref(null);
const cardOptionsFun = (e) => {
  isOn.value = e;
};
</script>
<template>
  <div class="bear-cardOptions">
    <div class="bear-cardOptions-box" v-if="option.length != 0">
      <div
        class="bear-cardOptions-content"
        @click="cardOptionsFun(index)"
        :class="
          isOn == index
            ? 'bear-cardOptions-content-active'
            : 'bear-cardOptions-content-noActive'
        "
        v-for="(item, index) in option"
        :key="index"
      >
        <div>{{ item.name }}</div>
        <div v-if="isOn == index">
          <el-icon color="#676af1">
            <check />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="bear-cardOptions-blank" v-else>
        <div>
            暂无预设
        </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.bear-cardOptions-box {
  .bear-cardOptions-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #4f5966;
    border-radius: 3px;
    padding: 10px 15px;
    margin-bottom: 10px;
  }
  .bear-cardOptions-content:hover {
    border: 1px solid #8688f4;
    background: #efeffe;
  }
  .bear-cardOptions-content-active {
    border: 1px solid #8688f4;
    background: #efeffe;
  }
  .bear-cardOptions-content-noActive {
    border: 1px solid #ebedf0;
    background: #ffffff;
  }
}
.bear-cardOptions-blank{
    width: 100%;
    color: #4f5966;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    height: 60px;
}
</style>
