<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { TextInput } from '@/types/fields'

const props = defineProps<{ field: TextInput; active: boolean }>()
const emit = defineEmits<{ blur: [currentValue: string]; focus: [] }>();

/** The reference to the input element that we can control focus on. */
const fieldRef = ref<{ focus?: () => void } | null>(null);

/** The local value the user is typing and hasn't been committed to backend yet. */
const draft = ref<string | undefined>(undefined);
/** The value to display in the input. */
const displayValue = () => draft.value ?? props.field.value ?? ''

const setDraft = (val: string) => { draft.value = val }

/** Called when the user blurs the input. This commits the local value to the backend. */
const commit = () => {
  const pending = draft.value
  draft.value = undefined
  emit('blur', pending ?? props.field.value ?? '')
}

/** On first mount: focus the input if this field is already the active one (e.g. initial state). */
onMounted(() => { if (props.active) nextTick(() => fieldRef.value?.focus?.()) });
/** If active state changes, we set the focus on the next tick (after DOM updates). */
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
