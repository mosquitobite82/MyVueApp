<script setup lang="ts">
import type { Checkbox } from '@/types/fields'

defineProps<{ field: Checkbox }>()
const emit = defineEmits<{ change: [newValue: boolean] }>()
</script>

<template>
  <v-checkbox
    :label="field.label.name"
    :model-value="field.value ?? false"
    density="compact"
    hide-details="auto"
    @update:model-value="(val) => emit('change', Boolean(val))"
  />
</template>
