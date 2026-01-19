<template>
    <!-- Connection Status -->
    <v-alert
      v-if="isConnecting"
      type="info"
      variant="tonal"
      class="mb-4"
    >
      Connecting to backend...
    </v-alert>
    
    <v-alert
      v-else-if="!isConnected"
      type="warning"
      variant="tonal"
      class="mb-4"
    >
      <div class="d-flex align-center justify-space-between">
        <span>Not connected to backend</span>
        <v-btn
          size="small"
          color="primary"
          @click="handleRetry"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <v-alert
      v-else
      type="success"
      variant="tonal"
      class="mb-4"
    >
      Connected to backend
    </v-alert>

</template>
<script setup lang="ts">
    const props = defineProps<{
        isConnecting: boolean
        isConnected: boolean
        error: string | null
        handleRetry: () => void
    }>();
</script>