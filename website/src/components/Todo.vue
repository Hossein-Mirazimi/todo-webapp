<template>
    <Form class="mb-4" @submit="addNewTodo" />
    <TodoLists class="mb-4" :todoLists="todoLists" />
    <Filter v-model="filter" />
    <p class="mt-8 text-center text-[#9394a5] opacity-80 text-sm">Drag and drop to reorder list</p>
</template>

<script setup lang="ts">
import Form from './Form.vue';
import TodoLists from './TodoLists.vue';
import Filter from './Filter.vue';
import { useTodoListProvider } from '../composables/useTodoList';

const { todoLists, filter, addNewTodo } = useTodoListProvider()

</script>