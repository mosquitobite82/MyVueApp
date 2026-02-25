<script setup lang="ts">
import type { NumberInput } from '@/types/fields'

defineProps<{ field: NumberInput }>()
</script>

<template>
  <v-text-field
    :label="field.label.name"
    :model-value="field.value ?? ''"
    type="number"
    density="compact"
    variant="outlined"
    readonly
    hide-details="auto"
  />
</template>
