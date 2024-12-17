<template>
    <div class="todo-container">
        <div v-if="!todoLists.length" class="empty-container">
            No todo items left!
        </div>
        <ul v-else class="list-none">
            <li v-for="todoItem in todoLists" :key="todoItem.id">
                <TodoItem :todoItem="todoItem" @checked="completeTodoItem" @delete="deleteTodoById"/>
            </li>
        </ul>
        <div class="actions">
            <p><span>{{ todoLists.length }}</span> items left</p>
            <button @click="clearCompletedTodos" class="hover:text-[#484b6a]">Clear Completed</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTodoListContext } from '../composables/useTodoList';
import type { TodoLists } from '../types';
import TodoItem from './TodoItem.vue';

defineProps<{todoLists: TodoLists}>()
const { clearCompletedTodos, completeTodoItem, deleteTodoById } = useTodoListContext();
</script>

<style scoped>
.todo-container {
    @apply bg-[#fafafa];
    box-shadow: 1px 8px 10px #d7d7db9a, 2px 5px 7px #d7d7db9a, 1px 7px 4px #d7d7db9a;
}
.empty-container {
    @apply w-full h-[100px] text-center text-[#424242] rounded-t-sm flex items-center justify-center;
    border-bottom: 1px solid #d2d3db;
    box-shadow: inset 0 0 5px 2px #d7d7db9a;
}
.actions {
    @apply flex justify-between items-center h-12 text-[0.8rem] p-4 text-[#9394a5];
}
</style>