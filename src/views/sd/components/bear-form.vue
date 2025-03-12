<script setup>
import { ref, toRaw } from "vue";
import { defineProps } from 'vue';

const props = defineProps({
    labelWidth: String,
    label: String
});

</script>
<template>
    <div class="bear-form">
        <div class="label">
            {{ props.label }}
        </div>
        <div class="slot">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped lang="scss">
.bear-form{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .label{
        color: #4f5966;
        font-size: 15px;
        font-weight: bold;
    }
    .slot{

    }
}

</style>
