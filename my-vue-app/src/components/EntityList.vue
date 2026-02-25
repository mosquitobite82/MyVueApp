<template>
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

    <v-alert v-if="entityCount === 0" type="info" variant="tonal">
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

    <div class="mt-6">
      <div class="d-flex align-center justify-space-between mb-3">
        <h3 class="text-h6">Form State</h3>
        <v-chip
          v-if="formStore.form?.lastUpdate"
          size="small"
          variant="tonal"
          color="primary"
        >
          Updated {{ new Date(formStore.form.lastUpdate).toLocaleTimeString() }}
        </v-chip>
      </div>

      <v-alert v-if="!formStore.form" type="info" variant="tonal">
        No form state received yet.
      </v-alert>

      <v-sheet v-else rounded="sm" color="surface-variant" class="pa-3">
        <pre class="form-json">{{ JSON.stringify(formStore.form, null, 2) }}</pre>
      </v-sheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBackendConnection } from '@/composables/useBackendConnection'
import { useFormStore } from '@/stores/formStore'

const { backendStore } = useBackendConnection()
const formStore = useFormStore()

const entityCount = computed(() => backendStore.entityCount)
const entities = computed(() => backendStore.allEntities)

const handleClearEntities = () => {
  backendStore.clearEntities()
}
</script>

<style scoped>
.form-json {
  font-family: monospace;
  font-size: 0.75rem;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}
</style>