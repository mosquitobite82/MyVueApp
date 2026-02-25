<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { SelectInput, FieldValue, SelectItem } from '@/types/fields'

const props = defineProps<{ field: SelectInput<FieldValue>; active: boolean }>()
const emit = defineEmits<{ change: [newValue: SelectItem<FieldValue>]; focus: [] }>()

const fieldRef = ref<{ focus?: () => void } | null>(null)

const onChange = (rawVal: unknown) => {
  const item = props.field.items.find((it) => it.value === rawVal)
  if (item) emit('change', item)
}

onMounted(() => { if (props.active) nextTick(() => fieldRef.value?.focus?.()) })
watch(() => props.active, (isActive) => { if (isActive) nextTick(() => fieldRef.value?.focus?.()) })
</script>

<template>
  <v-select
    ref="fieldRef"
    :label="field.label.name"
    :items="field.items"
    :model-value="field.value?.value"
    item-title="label"
    item-value="value"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @focus="emit('focus')"
    @update:model-value="onChange"
  />
</template>
