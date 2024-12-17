<template>
    <Container class="pt-[10dvh]">
        <AppHeader class="mb-5" />
        <ClientOnly>
            <Todo />
        </ClientOnly>
    </Container>
</template>

<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue';
import Container from '../components/ui/Container.vue';
import ClientOnly from '../components/common/ClientOnly.vue';
import Todo from '../components/Todo.vue';
</script>
