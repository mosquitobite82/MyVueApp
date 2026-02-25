<script setup lang="ts">
import { ref } from 'vue'
import { useFormStore } from '@/stores/formStore'
import type { Field, FieldValue } from '@/types/fields'
import DateTimePicker from '@/components/form/DateTime/DateTime.vue'
import type { DateTime as DateTimeValue } from '@/components/form/DateTime/DateTime.vue'

const props = defineProps<{
  field: Field<FieldValue>
  sectionId: string
  fieldIndex: number
}>()

const store = useFormStore()

// --- Draft for text / textarea ---
const draft = ref<string | undefined>(undefined)

const textDisplayValue = (storeValue: string) =>
  draft.value !== undefined ? draft.value : storeValue

const setDraft = (val: string) => {
  draft.value = val
}

const commitField = async (storeValue: string) => {
  const pending = draft.value
  draft.value = undefined
  if (pending === undefined || pending === storeValue) return
  try {
    await store.sendFieldChange(props.sectionId, props.fieldIndex, storeValue, pending)
  } catch (err) {
    console.error('Failed to commit field change:', err)
  }
}

// --- DateTime helpers ---
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
</script>

<template>
  <v-text-field
    v-if="field.type === 'text'"
    :label="field.label.name"
    :model-value="textDisplayValue(field.value ?? '')"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @blur="() => commitField(field.value ?? '')"
  />

  <v-textarea
    v-else-if="field.type === 'textarea'"
    :label="field.label.name"
    :model-value="textDisplayValue(field.value ?? '')"
    density="compact"
    variant="outlined"
    rows="2"
    auto-grow
    hide-details="auto"
    @update:model-value="(val) => setDraft(String(val))"
    @blur="() => commitField(field.value ?? '')"
  />

  <v-text-field
    v-else-if="field.type === 'number'"
    :label="field.label.name"
    :model-value="field.value ?? ''"
    type="number"
    density="compact"
    variant="outlined"
    readonly
    hide-details="auto"
  />

  <v-checkbox
    v-else-if="field.type === 'checkbox'"
    :label="field.label.name"
    :model-value="field.value ?? false"
    density="compact"
    hide-details="auto"
    @update:model-value="(val) => store.sendFieldChange(sectionId, fieldIndex, field.value ?? false, Boolean(val)).catch(console.error)"
  />

  <v-select
    v-else-if="field.type === 'select'"
    :label="field.label.name"
    :items="field.items"
    :model-value="field.value?.value"
    item-title="label"
    item-value="value"
    density="compact"
    variant="outlined"
    hide-details="auto"
    @update:model-value="(rawVal) => {
      const item = field.items.find((it) => it.value === rawVal)
      if (item) store.sendFieldChange(sectionId, fieldIndex, field.value, item).catch(console.error)
    }"
  />

  <div v-else-if="field.type === 'radio'">
    <div class="text-body-2 mb-1">{{ field.label.name }}</div>
    <v-radio-group
      :model-value="field.value?.value"
      inline
      density="compact"
      hide-details="auto"
      @update:model-value="(rawVal) => {
        const item = field.items.find((it) => it.value === rawVal)
        if (item) store.sendFieldChange(sectionId, fieldIndex, field.value, item).catch(console.error)
      }"
    >
      <v-radio
        v-for="item in field.items"
        :key="String(item.value)"
        :label="item.label"
        :value="item.value"
      />
    </v-radio-group>
  </div>

  <div v-else-if="field.type === 'datetime'">
    <div class="text-body-2 mb-1">{{ field.label.name }}</div>
    <DateTimePicker
      :model-value="parseDateTime(field.value)"
      :placeholder="field.label.name"
      @update:model-value="(dt) => {
        const str = formatDateTime(dt)
        store.sendFieldChange(sectionId, fieldIndex, field.value ?? '', str).catch(console.error)
      }"
    />
  </div>
</template>
