<template>
    <label class="flex justify-center items-center size-6 relative bg-[#d2d3db] rounded-full cursor-pointer">
        <input type="checkbox" v-model="modelValue" class="absolute cursor-pointer size-0">
        <span class="size-[22px] bg-[#fafafa] rounded-full bg-no-repeat" :class="{'active': modelValue}"></span>
    </label>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>()
</script>

<style scoped>
.active {
    width: 24px;
    height: 24px;
    background: url('../../assets/icons/icon-check.svg'), linear-gradient(#57ddff, #c058f3);
    background-position: center;
    background-repeat: no-repeat;
}
</style>