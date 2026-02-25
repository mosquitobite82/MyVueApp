<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { TextInput } from '@/types/fields'

const props = defineProps<{ field: TextInput; active: boolean }>()
const emit = defineEmits<{ blur: [currentValue: string]; focus: [] }>()

const fieldRef = ref<{ focus?: () => void } | null>(null)
const draft = ref<string | undefined>(undefined)

const displayValue = () => draft.value ?? props.field.value ?? ''
const setDraft = (val: string) => { draft.value = val }

const commit = () => {
  const pending = draft.value
  draft.value = undefined
  emit('blur', pending ?? props.field.value ?? '')
}

onMounted(() => { if (props.active) nextTick(() => fieldRef.value?.focus?.()) })
watch(() => props.active, (isActive) => { if (isActive) nextTick(() => fieldRef.value?.focus?.()) })
</script>

<template>
  <v-text-field
    ref="fieldRef"
    :label="field.label.name"
    :model-value="displayValue()"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @focus="emit('focus')"
    @blur="commit"
  />
</template>
