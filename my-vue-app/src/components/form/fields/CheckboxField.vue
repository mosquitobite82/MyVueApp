<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { Checkbox } from '@/types/fields'

const props = defineProps<{ field: Checkbox; active: boolean }>()
const emit = defineEmits<{ change: [newValue: boolean]; focus: [] }>()

const fieldRef = ref<{ focus?: () => void } | null>(null)

onMounted(() => { if (props.active) nextTick(() => fieldRef.value?.focus?.()) })
watch(() => props.active, (isActive) => { if (isActive) nextTick(() => fieldRef.value?.focus?.()) })
</script>

<template>
  <v-checkbox
    ref="fieldRef"
    :label="field.label.name"
    :model-value="field.value ?? false"
    density="compact"
    hide-details="auto"
    @update:model-value="(val) => emit('change', Boolean(val))"
    @focus="emit('focus')"
  />
</template>
