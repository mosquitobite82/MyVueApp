<template>
  <v-container>
    <v-card class="mx-auto pa-4" max-width="800">
      <v-card-title>PopupMenu Example</v-card-title>
      <v-card-subtitle>Right-click anywhere in this area to open the popup menu</v-card-subtitle>
      
      <v-card-text>
        <div
          class="demo-area"
          @contextmenu.prevent="handleContextMenu"
        >
          <p class="text-center text-grey">
            Right-click here to test the popup menu positioning!
          </p>
          <p class="text-center text-caption">
            Try clicking near edges to see the smart positioning in action.
          </p>
        </div>
      </v-card-text>
    </v-card>

    <PopupMenu
      v-model:visible="menuVisible"
      :x="menuX"
      :y="menuY"
    >
      <v-list-item @click="handleAction('Option 1')">
        <v-list-item-title>
          <v-icon start>mdi-file</v-icon>
          Option 1
        </v-list-item-title>
      </v-list-item>
      
      <v-list-item @click="handleAction('Option 2')">
        <v-list-item-title>
          <v-icon start>mdi-folder</v-icon>
          Option 2
        </v-list-item-title>
      </v-list-item>
      
      <v-divider />
      
      <v-list-item @click="handleAction('Copy')">
        <v-list-item-title>
          <v-icon start>mdi-content-copy</v-icon>
          Copy
        </v-list-item-title>
      </v-list-item>
      
      <v-list-item @click="handleAction('Paste')">
        <v-list-item-title>
          <v-icon start>mdi-content-paste</v-icon>
          Paste
        </v-list-item-title>
      </v-list-item>
      
      <v-divider />
      
      <v-list-item @click="handleAction('Delete')" class="text-red">
        <v-list-item-title>
          <v-icon start color="red">mdi-delete</v-icon>
          Delete
        </v-list-item-title>
      </v-list-item>
    </PopupMenu>

    <v-snackbar v-model="snackbar" :timeout="2000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PopupMenu from './PopupMenu.vue'

const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const snackbar = ref(false)
const snackbarText = ref('')

const handleContextMenu = (event: MouseEvent) => {
  menuX.value = event.clientX
  menuY.value = event.clientY
  menuVisible.value = true
}

const handleAction = (action: string) => {
  snackbarText.value = `You clicked: ${action}`
  snackbar.value = true
}
</script>

<style scoped>
.demo-area {
  min-height: 400px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  cursor: context-menu;
}

.demo-area:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>

