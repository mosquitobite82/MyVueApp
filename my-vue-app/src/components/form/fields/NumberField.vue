<script setup lang="ts">
import { ref } from 'vue'
import type { NumberInput } from '@/types/fields'

const props = defineProps<{ field: NumberInput }>()
const emit = defineEmits<{ change: [newValue: number] }>()

const draft = ref<string | undefined>(undefined)

const displayValue = () => draft.value ?? String(props.field.value ?? '')
const setDraft = (val: string) => { draft.value = val }

const commit = () => {
  const pending = draft.value
  draft.value = undefined
  if (pending === undefined) return
  const parsed = Number(pending)
  if (Number.isNaN(parsed) || parsed === props.field.value) return
  emit('change', parsed)
}
</script>

<template>
  <v-text-field
    :label="field.label.name"
    :model-value="displayValue()"
    type="number"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @blur="commit"
  />
</template>
