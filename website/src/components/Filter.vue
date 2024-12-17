<template>
    <div class="filters">
        <button class="text-[#9394a5]" @click="onClickHandler(Filters.All)" :class="{'!text-[#3a7bfd]': modelValue === Filters.All}">All</button>
        <button class="text-[#9394a5]" @click="onClickHandler(Filters.Active)" :class="{'!text-[#3a7bfd]': modelValue === Filters.Active}">Active</button>
        <button class="text-[#9394a5]" @click="onClickHandler(Filters.Completed)" :class="{'!text-[#3a7bfd]': modelValue === Filters.Completed}">Completed</button>
    </div>
</template>

<script setup lang="ts">
import { Filters } from '../types/todo';

const modelValue = defineModel<Filters>();

function onClickHandler(newVal: Filters) {
    modelValue.value = newVal;
}
</script>

<style scoped>
.filters {
    @apply rounded-sm bg-[#fafafa] flex justify-between items-center h-12 px-16 py-0 text-sm font-bold;
    box-shadow: 2px 5px 10px #d7d7db9a;
}
</style>