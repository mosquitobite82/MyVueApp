<script setup lang="ts">
import { inject } from 'vue'
import type { Field, FieldValue } from '@/types/fields'
import { COMMIT_FIELD_KEY } from '@/composables/useFormCommit'
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

const handleChange = (newValue: unknown) => {
  commitField(props.sectionId, props.fieldIndex, props.field.value, newValue).catch(console.error)
}
</script>

<template>
  <TextField      v-if="field.type === 'text'"      :field="field" @change="handleChange" />
  <TextareaField  v-else-if="field.type === 'textarea'"  :field="field" @change="handleChange" />
  <NumberField    v-else-if="field.type === 'number'"    :field="field" />
  <CheckboxField  v-else-if="field.type === 'checkbox'"  :field="field" @change="handleChange" />
  <SelectField    v-else-if="field.type === 'select'"    :field="field" @change="handleChange" />
  <RadioField     v-else-if="field.type === 'radio'"     :field="field" @change="handleChange" />
  <DateTimeField  v-else-if="field.type === 'datetime'"  :field="field" @change="handleChange" />
</template>
