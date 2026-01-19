<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useBackendConnection } from '@/composables/useBackendConnection';
    
    const { backendStore, connectionError, isConnecting, retry } = useBackendConnection();
    
    // Local input state
    const inputValue = ref('');
    const elementId = 'demo-input';
    
    // Computed properties
    const isConnected = computed(() => backendStore.isConnected);
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
    
    const handleInput = async (event: Event) => {
      if (!isConnected.value) return;
      
      const target = event.target as HTMLInputElement;
      const oldValue = inputValue.value;
      const newValue = target.value;
      
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
                v-model="inputValue"
                label="Type something..."
                placeholder="Type something..."
                disabled="!isConnected"
                error-messages="Error messages"
                rules="rules"
              />
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
    
    