<script setup lang="ts">
import { ref } from 'vue'
import type { TextInput } from '@/types/fields'

const props = defineProps<{ field: TextInput }>()
const emit = defineEmits<{ change: [newValue: string] }>()

const draft = ref<string | undefined>(undefined)

const displayValue = () => draft.value ?? props.field.value ?? ''
const setDraft = (val: string) => {
  draft.value = val
}

const commit = () => {
  const pending = draft.value
  draft.value = undefined
  if (pending === undefined || pending === (props.field.value ?? '')) return
  emit('change', pending)
}
</script>

<template>
  <v-text-field
    :label="field.label.name"
    :model-value="displayValue()"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @blur="commit"
  />
</template>
