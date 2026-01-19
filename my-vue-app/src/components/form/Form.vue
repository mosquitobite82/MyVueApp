<template>
  <div class="mb-6">
    <template v-for="input in form" :key="input.inputId">
    <TextInput
      v-if="input.inputType === 'text'"
      :input-id="input.inputId"
      :input-value="input.inputValue"
      label="Type something..."
      placeholder="Type something..."
      :disabled="!props.isConnected"
      :error-messages="[]"
      :rules="[]"
      @focus="handleFocus({inputId: input.inputId, hasFocus: true})"
      @blur="handleFocus({inputId: input.inputId, hasFocus: false})"
      @input-update="handleTextUpdate({inputId: input.inputId, val: $event.val})"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
import TextInput from './TextInput.vue';

  const form = ref<{inputId: string, inputType: string, inputValue: string}[]>([{inputId: 'input1', inputType: 'text', inputValue: ''}]);
  
  const props = defineProps<{
    isConnected: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'form-change', newValue: {inputId: string, val: string, oldValue: string}): void;
    (e: 'focus-change', newValue: {inputId: string, hasFocus: boolean}): void;
  }>();

  const emitFormChange = (update: {inputId: string, val: string, oldValue: string}) => {
    emit('form-change', update);
  };

  const emitFocusChange = (newValue: {inputId: string, hasFocus: boolean}) => {
    emit('focus-change', newValue);
  };

  const handleTextUpdate = (newValue: {inputId: string, val: string}) => {
    const input = form.value.find(input => input.inputId === newValue.inputId);
    if (!input) {
      throw new Error(`Input not found for inputId: ${newValue.inputId}`);
    }
    const oldValue = input.inputValue;

    input.inputValue = newValue.val;
    emitFormChange({inputId: newValue.inputId, val: newValue.val, oldValue: oldValue});
  };

  const handleFocus = ({inputId, hasFocus}: {inputId: string, hasFocus: boolean}) => {
    form.value = form.value
      .map(input => input.inputId === inputId ? { ...input, hasFocus: hasFocus } : input);
    emitFocusChange({inputId: inputId, hasFocus: hasFocus});
  };
</script>