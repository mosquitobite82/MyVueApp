<template>
  <div
    class="context-menu-item"
    :class="{ disabled: disabled, divider: divider }"
    @click="handleClick"
  >
    <slot v-if="!divider"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  divider?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.disabled && !props.divider) {
    emit('click')
  }
}
</script>

<style scoped>
.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s;
}

.context-menu-item:hover:not(.disabled):not(.divider) {
  background-color: #f0f0f0;
}

.context-menu-item.disabled {
  color: #999;
  cursor: not-allowed;
}

.context-menu-item.divider {
  height: 1px;
  padding: 0;
  margin: 4px 0;
  background-color: #e0e0e0;
  cursor: default;
}
</style>

