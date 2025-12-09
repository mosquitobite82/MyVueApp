<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './home/HomePage.vue'
import ContextMenuDemo from './components/ContextMenuDemo.vue'

</script>

<template>
  <div class="app-container">
    <h1>My Vue App</h1>
    
    <ContextMenuDemo />
    
    <!-- <HomePage /> -->
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
}

</style>
