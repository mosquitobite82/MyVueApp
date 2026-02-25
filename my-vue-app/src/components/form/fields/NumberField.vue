<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { NumberInput } from '@/types/fields'

const props = defineProps<{ field: NumberInput; active: boolean }>()
const emit = defineEmits<{ blur: [currentValue: number]; focus: [] }>()

const fieldRef = ref<{ focus?: () => void } | null>(null)
const draft = ref<string | undefined>(undefined)

const displayValue = () => draft.value ?? String(props.field.value ?? '')
const setDraft = (val: string) => { draft.value = val }

const commit = () => {
  const pending = draft.value
  draft.value = undefined
  const parsed = pending !== undefined ? Number(pending) : NaN
  emit('blur', Number.isNaN(parsed) ? (props.field.value ?? 0) : parsed)
}

onMounted(() => { if (props.active) nextTick(() => fieldRef.value?.focus?.()) })
watch(() => props.active, (isActive) => { if (isActive) nextTick(() => fieldRef.value?.focus?.()) })
</script>

<template>
  <v-text-field
    ref="fieldRef"
    :label="field.label.name"
    :model-value="displayValue()"
    type="number"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @focus="emit('focus')"
    @blur="commit"
  />
</template>
