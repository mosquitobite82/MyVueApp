<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBackendConnection } from '@/composables/useBackendConnection';
import Form from './form/Form.vue';
import ConnectionStatus from './alert/ConnectionStatus.vue';
import Statistics from './Statistics.vue';
import EntityList from './EntityList.vue';

const { backendStore, connectionError, isConnecting, retry } = useBackendConnection();

// Local input state
const inputValue = ref('');
const elementId = 'demo-input';

// Computed properties
const isConnected = computed(() => backendStore.isConnected);
const entities = computed(() => backendStore.allEntities);
const error = computed(() => backendStore.error || connectionError.value);
const entityCount = computed(() => backendStore.entityCount);
const lastUpdate = computed(() => {
  if (!backendStore.lastUpdate) return 'Never';
  return new Date(backendStore.lastUpdate).toLocaleTimeString();
});

// Event handlers
const handleFocus = async (newValue: {inputId: string, hasFocus: boolean}) => {
  if (!isConnected.value) return;
  
  try {
    await backendStore.sendFocusChange(newValue.inputId, newValue.hasFocus);
    console.log(`Focus ${newValue.hasFocus ? 'gained' : 'lost'} on ${newValue.inputId}`);
  } catch (err) {
    console.error('Failed to send focus event:', err);
  }
};

const handleInput = async (update : {inputId: string, val: string, oldValue: string}) => {
  if (!isConnected.value) return;
  
  try {
    await backendStore.sendValueChange(update.inputId, update.oldValue, update.val);
    console.log(`Value changed from "${update.oldValue}" to "${update.val}"`);
  } catch (err) {
    console.error('Failed to send value change:', err);
    // Revert on error
    inputValue.value = update.oldValue;
  }
};

const handleRetry = async () => {
  try {
    await retry();
  } catch (err) {
    console.error('Retry failed:', err);
  }
};

const handleClearEntities = () => {
  backendStore.clearEntities();
};

const handleClearError = () => {
  backendStore.clearError();
};
</script>

<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Backend State Store Demo</v-card-title>
      
      <v-card-text>
        <ConnectionStatus
          :is-connecting="isConnecting"
          :is-connected="isConnected"
          :error="error"
          :handle-retry="handleRetry"
        />

        <ErrorDisplay
          :error="error"
          :handle-clear-error="handleClearError"
        />

        <div class="mb-6">
          <Form :is-connected="isConnected" @form-change="handleInput" @focus-change="handleFocus" />
        </div>
        <Statistics />

        <EntityList />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.text-h4 {
  font-weight: 600;
}
</style>

