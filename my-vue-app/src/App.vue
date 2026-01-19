<script setup lang="ts">
import { ref } from 'vue'
import ContextMenuDemo from './components/ContextMenuDemo.vue'
import VuetifyContextMenuDemo from './components/VuetifyContextMenuDemo.vue'
import ClickableWithMenuDemo from './components/ClickableWithMenuDemo.vue'

const showVuetifyDemo = ref(true)
</script>

<template>
  <v-app>
    <v-main>
    <VuetifyContextMenuDemo />
      <ClickableWithMenuDemo />
    </v-main>
  </v-app>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
}
</style>
