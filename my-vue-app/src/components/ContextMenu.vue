<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface MenuItem {
  label: string
  icon?: string
  action: () => void
  disabled?: boolean
}

interface Props {
  menuItems?: MenuItem[]
  on?: 'left-click' | 'right-click'
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [],
  on: 'right-click'
})

const showMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
const containerRef = ref<HTMLElement | null>(null)
const isDropdownMode = ref(false)

const handleContextMenu = (event: MouseEvent) => {
  if (props.on !== 'right-click') return

  // Prevent the default browser context menu
  event.preventDefault()
  event.stopPropagation()

  isDropdownMode.value = false

  // Set menu position at cursor
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }

  // Show the menu
  showMenu.value = true
}

const handleClick = (event: MouseEvent) => {
  if (props.on !== 'left-click') return

  event.preventDefault()
  event.stopPropagation()

  isDropdownMode.value = true

  // Use the container element for positioning since it now wraps the content
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    
    // Position below the element (dropdown style), aligned to left edge
    menuPosition.value = {
      x: rect.left,
      y: rect.bottom + 4 // 4px gap below element
    }
  }

  // Show the menu
  showMenu.value = true
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const menuElement = document.querySelector('.context-menu')
  
  // Don't close if clicking inside the container (for left-click mode)
  if (containerRef.value?.contains(target)) {
    return
  }
  
  if (menuElement && !menuElement.contains(target)) {
    showMenu.value = false
  }
}

const handleMenuItemClick = (item: MenuItem) => {
  if (!item.disabled) {
    item.action()
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Also hide menu on scroll
  document.addEventListener('scroll', () => {
    showMenu.value = false
  }, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div 
    ref="containerRef"
    class="context-menu-container"
    :class="{ 'left-click-mode': props.on === 'left-click' }"
    @contextmenu="handleContextMenu"
    @click="handleClick"
  >
    <!-- Wrapped content goes here -->
    <slot></slot>

    <!-- Context Menu -->
    <Teleport to="body">
      <div
        v-if="showMenu"
        class="context-menu"
        :style="{
          top: `${menuPosition.y}px`,
          left: `${menuPosition.x}px`
        }"
      >
        <!-- Custom menu items slot -->
        <slot name="menu" :close="() => showMenu = false">
          <!-- Default menu items if provided via props -->
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="menu-item"
            :class="{ disabled: item.disabled }"
            @click="handleMenuItemClick(item)"
          >
            <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
            <span class="menu-label">{{ item.label }}</span>
          </div>
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.context-menu-container {
  position: relative;
  display: contents;
}

.context-menu-container.left-click-mode {
  display: inline-block;
  vertical-align: top;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 180px;
  z-index: 9999;
  animation: fadeIn 0.15s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.menu-item:hover:not(.disabled) {
  background-color: #f0f0f0;
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-icon {
  font-size: 16px;
  display: flex;
  align-items: center;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.menu-item.disabled .menu-label {
  color: #999;
}
</style>

