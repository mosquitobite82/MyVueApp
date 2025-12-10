<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './home/HomePage.vue'
import ContextMenuDemo from './components/ContextMenuDemo.vue'
import VuetifyContextMenuDemo from './components/VuetifyContextMenuDemo.vue'

const showVuetifyDemo = ref(true)
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn-toggle
              v-model="showVuetifyDemo"
              mandatory
              color="primary"
              class="mb-6"
            >
              <v-btn :value="false">Custom ContextMenu</v-btn>
              <v-btn :value="true">Vuetify ContextMenu</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>

      <VuetifyContextMenuDemo v-if="showVuetifyDemo" />
      
      <div v-else class="app-container">
        <ContextMenuDemo />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
}

</style>
