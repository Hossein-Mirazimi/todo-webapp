<template>
    <Container class="pt-[10dvh]">
        <AppHeader class="mb-5" />
        <Todo />
    </Container>
</template>

<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue';
import Container from '../components/ui/Container.vue';
import Todo from '../components/Todo.vue';
</script>
