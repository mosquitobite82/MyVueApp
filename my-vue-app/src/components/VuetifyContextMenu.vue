<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

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
const activatorRef = ref<HTMLElement | null>(null)
const virtualActivatorRef = ref<HTMLElement | null>(null)

// For right-click, we create a virtual activator at the cursor position
const isRightClickMode = computed(() => props.on === 'right-click')

const createVirtualActivator = (x: number, y: number) => {
  // Create a virtual element at cursor position for v-menu to anchor to
  const virtual = document.createElement('div')
  virtual.style.position = 'fixed'
  virtual.style.left = `${x}px`
  virtual.style.top = `${y}px`
  virtual.style.width = '0px'
  virtual.style.height = '0px'
  virtual.style.pointerEvents = 'none'
  document.body.appendChild(virtual)
  return virtual
}

const handleContextMenu = async (event: MouseEvent) => {
  if (props.on !== 'right-click') return

  event.preventDefault()
  event.stopPropagation()

  // Clean up old virtual activator
  if (virtualActivatorRef.value) {
    document.body.removeChild(virtualActivatorRef.value)
  }

  // Create virtual activator at cursor position
  virtualActivatorRef.value = createVirtualActivator(event.clientX, event.clientY)
  
  menuPosition.value = { x: event.clientX, y: event.clientY }
  
  await nextTick()
  showMenu.value = true
}

const handleMenuClose = () => {
  showMenu.value = false
  
  // Clean up virtual activator after menu closes
  if (virtualActivatorRef.value) {
    setTimeout(() => {
      if (virtualActivatorRef.value) {
        document.body.removeChild(virtualActivatorRef.value)
        virtualActivatorRef.value = null
      }
    }, 100)
  }
}

const handleMenuItemClick = (item: MenuItem) => {
  if (!item.disabled) {
    item.action()
    handleMenuClose()
  }
}

// Location strategy for v-menu (only used in left-click mode)
const menuLocation = 'bottom start'

// Expose for testing
defineExpose({
  showMenu,
  menuPosition,
  virtualActivatorRef,
  handleMenuItemClick,
  handleMenuClose,
})
</script>

<template>
  <!-- Left-click mode: use standard v-menu with activator -->
  <v-menu
    v-if="props.on === 'left-click'"
    v-model="showMenu"
    :close-on-content-click="false"
    :location="menuLocation"
    offset="4"
  >
    <template v-slot:activator="{ props: menuProps }">
      <span
        ref="activatorRef"
        v-bind="menuProps"
        class="left-click-activator"
      >
        <slot></slot>
      </span>
    </template>

    <v-list density="compact" class="context-menu-list">
      <slot name="menu" :close="handleMenuClose">
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :disabled="item.disabled"
          @click="handleMenuItemClick(item)"
        >
          <template v-if="item.icon" v-slot:prepend>
            <span class="menu-icon">{{ item.icon }}</span>
          </template>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
      </slot>
    </v-list>
  </v-menu>

  <!-- Right-click mode: manual positioning with teleport -->
  <div
    v-else
    @contextmenu="handleContextMenu"
    class="right-click-container"
  >
    <slot></slot>

    <Teleport to="body">
      <v-menu
        v-if="virtualActivatorRef"
        v-model="showMenu"
        :activator="virtualActivatorRef"
        :close-on-content-click="false"
        location="bottom start"
        offset="0"
      >
        <v-list density="compact" class="context-menu-list">
          <slot name="menu" :close="handleMenuClose">
            <v-list-item
              v-for="(item, index) in menuItems"
              :key="index"
              :disabled="item.disabled"
              @click="handleMenuItemClick(item)"
            >
              <template v-if="item.icon" v-slot:prepend>
                <span class="menu-icon">{{ item.icon }}</span>
              </template>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </slot>
        </v-list>
      </v-menu>
    </Teleport>
  </div>
</template>

<style scoped>
.left-click-activator {
  /* Use inline to avoid affecting layout, child elements control their own display */
  display: inline;
  vertical-align: baseline;
}

.right-click-container {
  display: contents;
}

.context-menu-list {
  min-width: 180px;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}
</style>


