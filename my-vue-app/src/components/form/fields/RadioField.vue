<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { RadioInput, FieldValue, SelectItem } from '@/types/fields'

const props = defineProps<{ field: RadioInput<FieldValue>; active: boolean }>()
const emit = defineEmits<{ change: [newValue: SelectItem<FieldValue>] }>()

const fieldRef = ref<{ focus?: () => void } | null>(null)

const onChange = (rawVal: unknown) => {
  const item = props.field.items.find((it) => it.value === rawVal)
  if (item) emit('change', item)
}

onMounted(() => { if (props.active) nextTick(() => fieldRef.value?.focus?.()) })
watch(() => props.active, (isActive) => { if (isActive) nextTick(() => fieldRef.value?.focus?.()) })
</script>

<template>
  <div>
    <div class="text-body-2 mb-1">{{ field.label.name }}</div>
    <v-radio-group
      ref="fieldRef"
      :model-value="field.value?.value"
      inline
      density="compact"
      hide-details="auto"
      @update:model-value="onChange"
    >
      <v-radio
        v-for="item in field.items"
        :key="String(item.value)"
        :label="item.label"
        :value="item.value"
      />
    </v-radio-group>
  </div>
</template>
