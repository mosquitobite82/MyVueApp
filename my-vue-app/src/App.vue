<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './home/HomePage.vue'
import ContextMenu, { type MenuItem } from './components/ContextMenu.vue'

const menuVisible = ref(false)
const x = ref(0)
const y = ref(0)

const menuItems: MenuItem[] = [
  { title: 'Copy', action: 'copy', icon: 'mdi-content-copy' },
  { title: 'Paste', action: 'paste', icon: 'mdi-content-paste' },
  { divider: true },
  { title: 'Cut', action: 'cut', icon: 'mdi-content-cut' },
  { title: 'Delete', action: 'delete', icon: 'mdi-delete' },
  { divider: true },
  { title: 'Properties', action: 'properties', icon: 'mdi-cog' },
]

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  x.value = event.clientX
  y.value = event.clientY
  menuVisible.value = true
}

const handleMenuItemClick = (item: MenuItem) => {
  console.log(`Action: ${item.action}`)
}
</script>

<template>
  <div class="app-container" @contextmenu="handleContextMenu">
    <h1>My Vue App</h1>
    <!-- <div class="demo-area">
      <p>Right-click anywhere in this area to see the context menu!</p>
      <p>The menu will automatically adjust its position if it doesn't fit.</p>
    </div> -->

    <!-- <PopupMenuExample /> -->

    <HomePage />
    
    <ContextMenu
      v-model:visible="menuVisible"
      :x="x"
      :y="y"
      :items="menuItems"
      @item-click="handleMenuItemClick"
    />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
}

.demo-area {
  padding: 40px;
  margin: 20px 0;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: context-menu;
}

.demo-area p {
  margin: 10px 0;
}
</style>
