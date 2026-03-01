<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useFormStore } from '@/stores/formStore';
import { useBackendSelectionStore } from '@/stores/backendSelectionStore';
import { getFormHubUrl } from '@/api/backend/formApi';
import type { FormBackendId } from '@/stores/backendSelectionStore';

const formStore = useFormStore();
const backendSelection = useBackendSelectionStore();

const realBackendHubUrl = computed(() => getFormHubUrl());

const selected = ref<FormBackendId>(backendSelection.backend);
const isSwitching = ref(false);

async function onBackendChange(newBackend: FormBackendId): Promise<void> {
  if (newBackend === backendSelection.backend) return;

  isSwitching.value = true;
  try {
    formStore.disconnect();
    backendSelection.setBackend(newBackend);
    await formStore.connect();
  } catch (err) {
    console.error('Failed to switch backend:', err);
  } finally {
    isSwitching.value = false;
  }
}

watch(selected, (val) => onBackendChange(val));

// Keep in sync if backend is changed elsewhere
watch(() => backendSelection.backend, (val) => {
  selected.value = val;
});
</script>

<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-title class="text-subtitle-1">Form backend</v-card-title>
    <v-card-text>
      <p class="text-body-2 text-medium-emphasis mb-2">
        Switch between mock and real .NET SignalR backend. Same data and API on both.
      </p>
      <v-select
        v-model="selected"
        :items="backendSelection.backendOptions"
        item-title="title"
        item-value="value"
        label="Backend"
        density="compact"
        variant="outlined"
        hide-details
        :disabled="isSwitching || formStore.isLoading"
        class="max-w-xs"
      />
      <div v-if="isSwitching" class="mt-2 text-body-2 text-medium-emphasis">
        Switching backend…
      </div>
      <p v-else-if="backendSelection.backend === 'real'" class="mt-2 text-body-2 text-medium-emphasis">
        Real backend URL: <code class="text-caption">{{ realBackendHubUrl }}</code> — ensure the .NET app is running there.
      </p>
    </v-card-text>
  </v-card>
</template>
