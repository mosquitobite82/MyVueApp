<script setup lang="ts">
import type { SelectInput, FieldValue, SelectItem } from '@/types/fields'

const props = defineProps<{ field: SelectInput<FieldValue> }>()
const emit = defineEmits<{ change: [newValue: SelectItem<FieldValue>] }>()

const onChange = (rawVal: unknown) => {
  const item = props.field.items.find((it) => it.value === rawVal)
  if (item) emit('change', item)
}
</script>

<template>
  <v-select
    :label="field.label.name"
    :items="field.items"
    :model-value="field.value?.value"
    item-title="label"
    item-value="value"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @update:model-value="onChange"
  />
</template>
