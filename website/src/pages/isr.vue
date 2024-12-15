<route lang="json5">
    {
        "meta": { "renderMode": "SSR" }
    }
</route>
    
<template>
    <div>
        <h1>[ISR] Hello World {{ status }}</h1>
        {{ dddddddd }}
    </div>
</template>

<script setup lang="ts">
import { useAsyncData } from '../plugins/ssr-context/composable';
type ddd = {"userId":boolean,"id":boolean,"title":string,"completed":boolean}
const { data: dddddddd, status } = useAsyncData<ddd, null>('test', async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json());

    return res;
}, { deep: false })
</script>

<style scoped>

</style>