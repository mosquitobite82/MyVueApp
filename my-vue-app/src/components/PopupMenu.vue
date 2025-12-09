<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="activatorRef"
      :style="activatorStyle"
      style="position: fixed; width: 0; height: 0; pointer-events: none;"
    />
    <v-menu
      v-model="isOpen"
      :activator="activatorRef"
      :location="menuLocation"
      :open-on-hover="false"
      :open-on-click="false"
      :close-on-content-click="closeOnContentClick"
      :offset="offset"
      transition="scale-transition"
      :z-index="zIndex"
    >
      <v-list density="compact">
        <slot></slot>
      </v-list>
    </v-menu>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  visible: boolean
  x: number
  y: number
  closeOnContentClick?: boolean
  zIndex?: number
  offset?: number | string | number[]
}

const props = withDefaults(defineProps<Props>(), {
  closeOnContentClick: true,
  zIndex: 2000,
  offset: 4
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const activatorRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

// Position the invisible activator at the mouse cursor
const activatorStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
}))

// Determine menu location based on cursor position and viewport
const menuLocation = computed(() => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Estimate menu size (you can adjust these values based on your typical menu size)
  const estimatedMenuWidth = 200
  const estimatedMenuHeight = 300
  
  const fitsRight = props.x + estimatedMenuWidth <= viewportWidth
  const fitsBottom = props.y + estimatedMenuHeight <= viewportHeight
  
  // Determine horizontal alignment
  const horizontal = fitsRight ? 'end' : 'start'
  
  // Determine vertical alignment
  const vertical = fitsBottom ? 'bottom' : 'top'
  
  // Vuetify location format: "vertical horizontal"
  // e.g., "bottom end" means menu appears below and to the right
  return `${vertical} ${horizontal}`
})

// Sync isOpen with visible prop
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      // Ensure the activator is positioned before opening
      await nextTick()
      isOpen.value = true
    } else {
      isOpen.value = false
    }
  },
  { immediate: true }
)

// Emit when menu closes
watch(isOpen, (newVal) => {
  if (!newVal && props.visible) {
    emit('update:visible', false)
  }
})

// Close menu on escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    emit('update:visible', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Vuetify handles all the styling, so we keep this minimal */
</style>

