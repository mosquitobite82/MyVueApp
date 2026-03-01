<script setup lang="ts">
import { inject, computed } from 'vue'
import type { Field, FieldValue } from '@/types/fields'
import { COMMIT_FIELD_KEY, ACTIVE_FIELD_KEY, REQUEST_FOCUS_KEY, NOTIFY_FOCUS_KEY } from '@/composables/useFormCommit'
import TextField from '@/components/form/fields/TextField.vue'
import TextareaField from '@/components/form/fields/TextareaField.vue'
import NumberField from '@/components/form/fields/NumberField.vue'
import CheckboxField from '@/components/form/fields/CheckboxField.vue'
import SelectField from '@/components/form/fields/SelectField.vue'
import RadioField from '@/components/form/fields/RadioField.vue'
import DateTimeField from '@/components/form/fields/DateTimeField.vue'

const props = defineProps<{
  field: Field<FieldValue>
  sectionId: string
  fieldIndex: number
}>()

const commitField = inject(COMMIT_FIELD_KEY)!
const activeField = inject(ACTIVE_FIELD_KEY)
const requestFocus = inject(REQUEST_FOCUS_KEY)!
const notifyFocusGained = inject(NOTIFY_FOCUS_KEY)!

const fieldId = computed(() => `${props.sectionId}:${props.fieldIndex}`)
const isActive = computed(() => activeField?.value === fieldId.value)

/** Called by immediate-change fields (checkbox, select, radio, datetime). */
const handleChange = (newValue: unknown) => {
  commitField(props.sectionId, props.fieldIndex, props.field.value, newValue).catch(console.error)
}

/** Called when a text/textarea/number field loses focus; sends value to backend for validation + focus advance. */
const handleBlur = (currentValue: unknown) => {
  requestFocus(props.sectionId, props.fieldIndex, currentValue).catch(console.error)
}

/** Called when any field gains focus (click or programmatic); syncs activeFieldId with the backend. */
const handleFocus = () => {
  if (activeField?.value === fieldId.value) return
  notifyFocusGained(props.sectionId, props.fieldIndex)
}
</script>

<template>
  <TextField      v-if="field.type === 'text'"     :field="field" :active="isActive" @blur="handleBlur"   @focus="handleFocus" />
  <TextareaField  v-else-if="field.type === 'textarea'"           :field="field" :active="isActive" @blur="handleBlur"   @focus="handleFocus" />
  <NumberField    v-else-if="field.type === 'number'"             :field="field" :active="isActive" @blur="handleBlur"   @focus="handleFocus" />
  <CheckboxField  v-else-if="field.type === 'checkbox'"           :field="field" :active="isActive" @change="handleChange" @focus="handleFocus" />
  <SelectField    v-else-if="field.type === 'select'"             :field="field" :active="isActive" @change="handleChange" @focus="handleFocus" />
  <RadioField     v-else-if="field.type === 'radio'"              :field="field" :active="isActive" @change="handleChange" @focus="handleFocus" />
  <DateTimeField  v-else-if="field.type === 'datetime'"           :field="field" :active="isActive" @change="handleChange" @focus="handleFocus" />
</template>
