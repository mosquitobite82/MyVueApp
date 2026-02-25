<script setup lang="ts">
import { ref } from 'vue'
import type { TextareaInput } from '@/types/fields'

const props = defineProps<{ field: TextareaInput }>()
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
  <v-textarea
    :label="field.label.name"
    :model-value="displayValue()"
    density="compact"
    variant="outlined"
    rows="2"
    auto-grow
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @blur="commit"
  />
</template>
