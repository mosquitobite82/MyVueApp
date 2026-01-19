<script setup lang="ts">
import { ref } from 'vue'
import VuetifyContextMenuDemo from './components/VuetifyContextMenuDemo.vue'
import ClickableWithMenuDemo from './components/ClickableWithMenuDemo.vue'
import BackendStateDemo from './components/BackendStateDemo.vue'

const showVuetifyDemo = ref(true);
const showMockSignalRDemo = ref(true);

</script>

<template>
  <v-app>
    <v-main>
      <BackendStateDemo />
      <!-- <VuetifyContextMenuDemo /> -->
      <!-- <ClickableWithMenuDemo /> -->
    </v-main>
  </v-app>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
}
</style>
