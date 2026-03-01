<script setup lang="ts">
import { ref } from 'vue';
import { fetchHello } from '@/api/backend/helloApi';

const result = ref<string | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

const testConnection = async () => {
  result.value = null;
  error.value = null;
  loading.value = true;
  try {
    const data = await fetchHello();
    result.value = `${data.message} (${new Date(data.timestamp).toLocaleString()})`;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Request failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-title class="text-subtitle-1">Hello World connection test</v-card-title>
    <v-card-text>
      <p class="text-body-2 text-medium-emphasis mb-2">
        Call the backend GET /api/hello to verify frontend ↔ backend connectivity.
      </p>
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="testConnection"
      >
        Test connection
      </v-btn>
      <div v-if="result" class="mt-3 text-body-2 text-success">
        {{ result }}
      </div>
      <div v-if="error" class="mt-3 text-body-2 text-error">
        {{ error }}
      </div>
    </v-card-text>
  </v-card>
</template>
