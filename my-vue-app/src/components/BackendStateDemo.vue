<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBackendConnection } from '@/composables/useBackendConnection';
import TextInput from './form/TextInput.vue';
import ConnectionStatus from './alert/ConnectionStatus.vue';

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
const handleFocus = async (hasFocus: boolean) => {
  if (!isConnected.value) return;
  
  try {
    await backendStore.sendFocusChange(elementId, hasFocus);
    console.log(`Focus ${hasFocus ? 'gained' : 'lost'} on ${elementId}`);
  } catch (err) {
    console.error('Failed to send focus event:', err);
  }
};

const handleInput = async (newValue : string) => {
  if (!isConnected.value) return;
  
  const oldValue = inputValue.value;
  inputValue.value = newValue;
  
  try {
    await backendStore.sendValueChange(elementId, oldValue, newValue);
    console.log(`Value changed from "${oldValue}" to "${newValue}"`);
  } catch (err) {
    console.error('Failed to send value change:', err);
    // Revert on error
    inputValue.value = oldValue;
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

        <!-- Demo Input -->
        <div class="mb-6">
          <TextInput
            :input-value="inputValue"
            label="Type something..."
            placeholder="Type something..."
            :disabled="!isConnected"
            :error-messages="[]"
            :rules="[]"
            @focus="handleFocus(true)"
            @blur="handleFocus(false)"
            @input="handleInput"
          />
        </div>

        <!-- Statistics -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-text class="text-center">
                <div class="text-h4 mb-2">{{ entityCount }}</div>
                <div class="text-caption">Entities</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-text class="text-center">
                <div class="text-h4 mb-2">
                  <v-icon :color="isConnected ? 'success' : 'error'">
                    {{ isConnected ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                </div>
                <div class="text-caption">Connection</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-text class="text-center">
                <div class="text-body-2 mb-2">{{ lastUpdate }}</div>
                <div class="text-caption">Last Update</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Entity List -->
        <div>
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-h6">Backend Entities</h3>
            <v-btn
              size="small"
              variant="outlined"
              :disabled="entityCount === 0"
              @click="handleClearEntities"
            >
              Clear All
            </v-btn>
          </div>

          <v-alert
            v-if="entityCount === 0"
            type="info"
            variant="tonal"
          >
            No entities yet. Type in the input above to create some!
          </v-alert>

          <v-list v-else lines="two">
            <v-list-item
              v-for="entity in entities"
              :key="entity.id"
              :title="entity.id"
              :subtitle="JSON.stringify(entity, null, 2)"
            >
              <template #prepend>
                <v-icon>mdi-database</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.text-h4 {
  font-weight: 600;
}
</style>

