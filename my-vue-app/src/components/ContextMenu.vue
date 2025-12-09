<template>
  <Teleport to="body">
    <!-- Hidden activator element positioned at cursor -->
    <div
      v-if="visible"
      ref="activatorRef"
      :style="`position: fixed; left: ${x}px; top: ${y}px; width: 0; height: 0; pointer-events: none;`"
    ></div>

    <v-menu
      v-model="isVisible"
      :activator="activatorRef"
      location="bottom end"
      :close-on-content-click="true"
      :z-index="2000"
    >
      <v-list>
        <template v-for="(item, index) in menuItems" :key="index">
          <v-divider v-if="item.divider" />
          <v-list-item
            v-else
            @click="handleItemClick(item)"
          >
            <v-list-item-title>
              <v-icon v-if="item.icon" start>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface MenuItem {
  title?: string
  action?: string
  icon?: string
  divider?: boolean
}

interface Props {
  visible: boolean
  x: number
  y: number
  items: MenuItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'item-click': [item: MenuItem]
}>()

const activatorRef = ref<HTMLElement>()

const isVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const menuItems = computed(() => props.items)

const handleItemClick = (item: MenuItem) => {
  emit('item-click', item)
  emit('update:visible', false)
}
</script>

<style scoped>
/* Vuetify handles all the styling */
</style>
