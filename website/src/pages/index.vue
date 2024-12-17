<template>
    <Container class="pt-[10dvh]">
        <AppHeader class="mb-5" />
        <Form class="mb-4" @submit="addNewTodo" />
        <TodoLists class="mb-4" :todoLists="todoLists" />
        <Filter v-model="filter" />
        <p class="mt-8 text-center text-[#9394a5] opacity-80 text-sm">Drag and drop to reorder list</p>
    </Container>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import Container from '../components/Container.vue';
import Form from '../components/Form.vue';
import TodoLists from '../components/TodoLists.vue';
import Filter from '../components/Filter.vue';
import { useTodoListProvider } from '../composables/useTodoList';

const { todoLists, filter, addNewTodo } = useTodoListProvider()
</script>

<style scoped>
.b {
    color: #9394a5
}
</style>