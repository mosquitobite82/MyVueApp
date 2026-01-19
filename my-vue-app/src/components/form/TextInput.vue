<template>
  <v-text-field
    :model-value="inputValue"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="errorMessages"
    :rules="rules"
    persistent-hint
    @focus="emit('focus', true)"
    @blur="emit('blur', false)"
    @update:model-value="emit('input-update', {inputId: props.inputId, val: $event})"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  inputId: string;
  inputValue: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  errorMessages: string[];
  rules: any[];
}>();

const emit = defineEmits<{
  (e: 'focus', hasFocus: boolean): void;
  (e: 'blur', hasFocus: boolean): void;
  (e: 'input-update', newValue: {inputId: string, val: string}): void;
}>();
</script>
