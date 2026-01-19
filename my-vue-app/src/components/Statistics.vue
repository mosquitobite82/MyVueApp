<template>
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
</template>

<script setup lang="ts">
import { useBackendConnection } from '@/composables/useBackendConnection';
import { computed } from 'vue';

const { backendStore } = useBackendConnection();

const entityCount = computed(() => backendStore.entityCount);
const isConnected = computed(() => backendStore.isConnected);
const lastUpdate = computed(() => backendStore.lastUpdate);
</script>