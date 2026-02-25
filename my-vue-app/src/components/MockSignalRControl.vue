<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBackendStore } from '@/stores'
import { mockSignalRHub } from '@/api/mock/signalr'
import { useBackendConnection } from '@/composables/useBackendConnection'
import TextInput from '@/components/form/TextInput/TextInput.vue'

const { backendStore, isConnecting, connectionError, retry } = useBackendConnection()

// --- Hub config controls ---
const minChanges = ref(1)
const maxChanges = ref(1)

watch([minChanges, maxChanges], ([min, max]) => {
  // Keep min <= max
  if (min > max) maxChanges.value = min
  mockSignalRHub.configure({
    minStateChangesPerAction: minChanges.value,
    maxStateChangesPerAction: Math.max(minChanges.value, maxChanges.value),
  })
})

// --- Send event form ---
const entityId = ref('entity-1')
const rawValue = ref('hello')
const simError = ref<string | null>(null)
const simPending = ref(false)

const parsedValue = computed(() => {
  const v = rawValue.value.trim()
  if (v === 'true') return true
  if (v === 'false') return false
  const n = Number(v)
  if (!Number.isNaN(n) && v !== '') return n
  return v
})

const onElementIdUpdate = (payload: { inputId: string; val: string }) => {
  entityId.value = payload.val
}
const onNewValueUpdate = (payload: { inputId: string; val: string }) => {
  rawValue.value = payload.val
}

const sendEvent = async () => {
  simError.value = null

  if (!backendStore.isConnected) {
    simError.value = 'Not connected — connect first.'
    return
  }

  if (!entityId.value.trim()) {
    simError.value = 'Entity ID is required.'
    return
  }

  simPending.value = true
  try {
    // sendEvent triggers scheduleAutoStateChange N times (per min/max config),
    // each producing distinct property values visible in the state table.
    await mockSignalRHub.sendEvent({
      type: 'valueChanged',
      elementId: entityId.value.trim(),
      oldValue: '',
      newValue: parsedValue.value as string | number,
      timestamp: Date.now(),
    })
  } catch (err) {
    simError.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    simPending.value = false
  }
}

// --- Reactive state display ---
const lastUpdate = computed(() =>
  backendStore.lastUpdate ? new Date(backendStore.lastUpdate).toLocaleTimeString() : 'Never',
)

const stateRows = computed(() =>
  backendStore.allEntities.flatMap((entity) =>
    Object.entries(entity)
      .filter(([key]) => key !== 'id')
      .map(([key, val]) => ({
        rowKey: `${entity.id}-${key}`,
        entityId: entity.id,
        property: key,
        displayValue: JSON.stringify(val),
      })),
  ),
)

// Track update count so the user can see N messages arriving
const updateCount = ref(0)

// Flash the row that just changed (keyed by entityId+property)
const recentlyUpdated = ref<Set<string>>(new Set())

watch(
  () => backendStore.entities,
  (newEntities, oldEntities) => {
    updateCount.value++
    Object.entries(newEntities).forEach(([entityId, entity]) => {
      Object.keys(entity)
        .filter((k) => k !== 'id')
        .forEach((prop) => {
          const rowKey = `${entityId}-${prop}`
          const changed = !oldEntities[entityId] || oldEntities[entityId][prop] !== entity[prop]
          if (changed) {
            recentlyUpdated.value.add(rowKey)
            setTimeout(() => {
              recentlyUpdated.value.delete(rowKey)
            }, 1000)
          }
        })
    })
  },
  { deep: true },
)

const handleRetry = async () => {
  try {
    await retry()
  } catch {
    // connectionError is already set by the composable
  }
}
</script>

<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title class="text-h6">MockSignalR Control Panel</v-card-title>

      <!-- Connection status -->
      <v-card-text class="pb-0">
        <v-alert v-if="isConnecting" type="info" density="compact" class="mb-4">
          Connecting…
        </v-alert>
        <v-alert v-else-if="connectionError" type="error" density="compact" class="mb-4">
          {{ connectionError }}
          <v-btn size="x-small" variant="text" class="ml-2" @click="handleRetry">Retry</v-btn>
        </v-alert>
        <v-alert v-else-if="backendStore.isConnected" type="success" density="compact" class="mb-4">
          Connected
        </v-alert>
        <v-alert v-else type="warning" density="compact" class="mb-4"> Disconnected </v-alert>
      </v-card-text>

      <v-divider class="my-2" />

      <!-- State changes per action config -->
      <v-card-text class="pb-0">
        <div class="text-subtitle-1 font-weight-medium mb-1">State Changes Per Action</div>
        <div class="text-caption text-medium-emphasis mb-3">
          When an event is sent to the mock backend, it will respond with a random number of state
          change messages in this range.
        </div>
        <v-row dense align="center">
          <v-col cols="12" sm="5">
            <v-slider
              v-model="minChanges"
              label="Min"
              :min="1"
              :max="10"
              :step="1"
              thumb-label
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="5">
            <v-slider
              v-model="maxChanges"
              label="Max"
              :min="minChanges"
              :max="10"
              :step="1"
              thumb-label
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="2" class="text-caption text-medium-emphasis text-center">
            {{ minChanges === maxChanges ? minChanges : `${minChanges} – ${maxChanges}` }}
            {{ minChanges === maxChanges ? 'update' : 'updates' }}
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider class="my-2" />

      <!-- Send event section -->
      <v-card-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">Send Event</div>
        <div class="text-caption text-medium-emphasis mb-3">
          Sends a <code>valueChanged</code> event through the hub. The mock backend will respond
          with between <strong>{{ minChanges }}</strong> and <strong>{{ maxChanges }}</strong>
          state change messages, each updating a different property.
        </div>

        <v-row dense>
          <v-col cols="12" sm="6">
            <TextInput
              input-id="mock-signalr-element-id"
              :input-value="entityId"
              label="Element ID"
              placeholder="e.g. entity-1"
              :disabled="false"
              :error-messages="[]"
              :rules="[]"
              @input-update="onElementIdUpdate"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <TextInput
              input-id="mock-signalr-new-value"
              :input-value="rawValue"
              label="New Value"
              :placeholder="`Parsed as ${typeof parsedValue}: ${JSON.stringify(parsedValue)}`"
              :disabled="false"
              :error-messages="[]"
              :rules="[]"
              @input-update="onNewValueUpdate"
            />
          </v-col>
        </v-row>

        <v-alert v-if="simError" type="error" density="compact" class="mt-3">
          {{ simError }}
        </v-alert>

        <v-btn
          class="mt-4"
          color="primary"
          :disabled="!backendStore.isConnected || simPending"
          :loading="simPending"
          @click="sendEvent"
        >
          Send Event
        </v-btn>
      </v-card-text>

      <v-divider class="my-2" />

      <!-- Reactive state display -->
      <v-card-text>
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="text-subtitle-1 font-weight-medium">Current Store State</div>
          <div class="d-flex align-center gap-3">
            <v-chip size="x-small" color="primary" variant="tonal">
              {{ updateCount }} updates received
            </v-chip>
            <span class="text-caption text-medium-emphasis ml-2">Last: {{ lastUpdate }}</span>
          </div>
        </div>

        <div v-if="stateRows.length === 0" class="text-body-2 text-medium-emphasis font-italic">
          No entities yet — send an event to see state changes appear.
        </div>

        <v-table v-else density="compact">
          <thead>
            <tr>
              <th>Entity ID</th>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in stateRows"
              :key="row.rowKey"
              :style="{
                transition: 'background-color 0.5s',
                backgroundColor: recentlyUpdated.has(row.rowKey) ? 'rgba(76, 175, 80, 0.15)' : '',
              }"
            >
              <td>{{ row.entityId }}</td>
              <td>{{ row.property }}</td>
              <td>
                <code>{{ row.displayValue }}</code>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
