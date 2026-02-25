<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { DateTimeInput } from '@/types/fields'
import DateTimePicker from '@/components/form/DateTime/DateTime.vue'
import type { DateTime as DateTimeValue } from '@/components/form/DateTime/DateTime.vue'

const props = defineProps<{ field: DateTimeInput; active: boolean }>()
const emit = defineEmits<{ change: [newValue: string]; focus: [] }>()

const fieldRef = ref<{ focus?: () => void } | null>(null)

const pad = (n: number) => String(n).padStart(2, '0')

const parseDateTime = (s: string | undefined): DateTimeValue | null => {
  if (!s) return null
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}))?$/.exec(s.trim())
  if (!m) return null
  const month = Number(m[2])
  if (month < 1 || month > 12) return null
  return {
    year: Number(m[1]),
    month: month as DateTimeValue['month'],
    day: Number(m[3]),
    hour: Number(m[4] ?? 0),
    minute: Number(m[5] ?? 0),
    second: 0,
  }
}

const formatDateTime = (dt: DateTimeValue | null): string => {
  if (!dt) return ''
  return `${dt.year}-${pad(dt.month)}-${pad(dt.day)} ${pad(dt.hour)}:${pad(dt.minute)}`
}

const onChange = (dt: DateTimeValue | null) => {
  emit('change', formatDateTime(dt))
}

onMounted(() => { if (props.active) nextTick(() => fieldRef.value?.focus?.()) })
watch(() => props.active, (isActive) => { if (isActive) nextTick(() => fieldRef.value?.focus?.()) })
</script>

<template>
  <div>
    <div class="text-body-2 mb-1">{{ field.label.name }}</div>
    <DateTimePicker
      ref="fieldRef"
      :model-value="parseDateTime(field.value)"
      :placeholder="field.label.name"
      @focus="emit('focus')"
      @update:model-value="onChange"
    />
  </div>
</template>
