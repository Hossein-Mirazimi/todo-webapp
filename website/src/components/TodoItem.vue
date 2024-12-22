<template>
    <div class="flex w-full items-center h-12 bg-[#fafafa] border-b-1 border-[#d2d3db] transition-all p-2 pl-4 gap-4 cursor-pointer" @click="$emit('checked', todoItem.id)" :class="{'line-through decoration-[#424242] opacity-50 decoration-[2px]': todoItem.completed}">
        <Checkbox :model-value="todoItem.completed" @update:model-value="$emit('checked', todoItem.id)" class="" />
        <div>{{todoItem.completed}}{{ todoItem.title }}</div>
        <button @click.stop="$emit('delete', todoItem.id)" class="size-[40px] rounded-full border-none ml-auto flex justify-center items-center bg-transparent">
            <img src="../assets/icons/icon-cross.svg" width="15px" alt="">
        </button>
    </div>
</template>

<script setup lang="ts">
import type { TodoItem } from '../types';
import Checkbox from './ui/Checkbox.vue';
interface IEmit {
    (event: 'checked', payload: TodoItem['id']): void
    (event: 'delete', payload: TodoItem['id']): void
}
defineProps<{ todoItem: TodoItem }>()
defineEmits<IEmit>();
</script>

<style scoped>
</style>