<script setup lang="ts">
import BackendStateDemo from './components/BackendStateDemo.vue'
import MockSignalRControl from './components/MockSignalRControl.vue'
</script>

<template>
  <v-app>
    <v-main>
      <!-- <MockSignalRControl /> -->
      <BackendStateDemo />
    </v-main>
  </v-app>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
}
</style>
