<script setup lang="ts">
import { ref } from 'vue'

export interface MenuItem {
  title: string
  value: string
  icon?: string
  color?: string
  disabled?: boolean
}

interface Props {
  menuItems: MenuItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'menu-item-click': [item: MenuItem]
}>()

const isMenuOpen = ref(false)

const handleMenuItemClick = (item: MenuItem) => {
  if (item.disabled) return
  
  emit('menu-item-click', item)
  isMenuOpen.value = false
}

// Expose for testing
defineExpose({
  isMenuOpen,
  handleMenuItemClick,
})
</script>

<template>
  <v-menu v-model="isMenuOpen" :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <div
        v-bind="menuProps"
        data-test="clickable-activator"
        style="cursor: pointer; display: inline-block"
      >
        <slot />
      </div>
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="item in menuItems"
        :key="item.value"
        :disabled="item.disabled"
        :prepend-icon="item.icon"
        :value="item.value"
        @click="handleMenuItemClick(item)"
      >
        <v-list-item-title :class="item.color ? `text-${item.color}` : ''">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>



