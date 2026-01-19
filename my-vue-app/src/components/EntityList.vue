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
</template>
<script setup lang="ts">
  import { useBackendConnection } from '@/composables/useBackendConnection';
  import { computed } from 'vue';

  const { backendStore } = useBackendConnection();

  const entityCount = computed(() => backendStore.entityCount);
  const entities = computed(() => backendStore.allEntities);

  const handleClearEntities = () => {
    backendStore.clearEntities();
  };

</script>