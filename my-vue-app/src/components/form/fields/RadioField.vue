<script setup lang="ts">
import type { RadioInput, FieldValue, SelectItem } from '@/types/fields'

const props = defineProps<{ field: RadioInput<FieldValue> }>()
const emit = defineEmits<{ change: [newValue: SelectItem<FieldValue>] }>()

const onChange = (rawVal: unknown) => {
  const item = props.field.items.find((it) => it.value === rawVal)
  if (item) emit('change', item)
}
</script>

<template>
  <div>
    <div class="text-body-2 mb-1">{{ field.label.name }}</div>
    <v-radio-group
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
