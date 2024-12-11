<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<template>
  <header>
    <nav>
      <ul>
      <li><RouterLink to="/">index</RouterLink></li>
      <li><RouterLink to="/test">Test</RouterLink></li>
      <li><RouterLink to="/404">404</RouterLink></li>
    </ul>
    </nav>
  </header>
  <main>
    <RouterView></RouterView>
  </main>
</template>