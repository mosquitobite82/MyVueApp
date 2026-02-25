<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { TextareaInput } from '@/types/fields'

const props = defineProps<{ field: TextareaInput; active: boolean }>()
const emit = defineEmits<{ blur: [currentValue: string]; focus: [] }>()

/** The local value the user is typing. */
const draft = ref<string | undefined>(undefined)
const setDraft = (val: string) => {
  draft.value = val
}

/** The value to display in the input. */
const displayValue = () => draft.value ?? props.field.value ?? ''

const focusableRef = ref<{ focus?: () => void } | null>(null)
const focus = () => focusableRef.value?.focus?.()

const commit = () => {
  const pendingValue = displayValue()
  draft.value = undefined
  emit('blur', pendingValue)
}

onMounted(() => props.active && nextTick(focus))
watch(
  () => props.active,
  (isActive) => isActive && nextTick(focus),
)
</script>
<template>
  <v-textarea
    ref="fieldRef"
    :label="field.label.name"
    :model-value="displayValue()"
    density="compact"
    variant="outlined"
    rows="2"
    auto-grow
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @focus="emit('focus')"
    @blur="commit"
  />
</template>
