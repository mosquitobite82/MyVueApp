import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockSignalRHub } from '@/api/mock/signalr';
import type { StateChangeMessage, ClientEvent } from '@/api/mock/signalr';
import type { Entity } from './types';

/**
 * Backend State Store
 * 
 * Manages all state synchronized with the backend through SignalR.
 * - Connects to SignalR hub
 * - Subscribes to state changes from backend
 * - Sends events to backend
 * - Keeps frontend state in sync with backend at all times
 */
export const useBackendStore = defineStore('backend', () => {
  // State
  const entities = ref<Record<string, Entity>>({});
  const isConnected = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastUpdate = ref<number | null>(null);

  // Unsubscribe functions
  let unsubscribeStateChange: (() => void) | null = null;
  let unsubscribeConnectionState: (() => void) | null = null;

  // Getters
  const entityIds = computed(() => Object.keys(entities.value));
  const entityCount = computed(() => entityIds.value.length);
  const allEntities = computed(() => Object.values(entities.value));

  /**
   * Get entity by ID
   */
  const getEntityById = (id: string): Entity | undefined => {
    return entities.value[id];
  };

  /**
   * Handle state change message from backend
   */
  const handleStateChange = (message: StateChangeMessage): void => {
    const { entityId, property, value, timestamp } = message;

    // Create or update entity
    if (!entities.value[entityId]) {
      entities.value[entityId] = {
        id: entityId,
        [property]: value,
      };
    } else {
      entities.value[entityId] = {
        ...entities.value[entityId],
        [property]: value,
      };
    }

    // Update last update timestamp
    lastUpdate.value = timestamp;
  };

  /**
   * Handle connection state changes
   */
  const handleConnectionStateChange = (state: string): void => {
    isConnected.value = state === 'connected';
  };

  /**
   * Connect to the backend SignalR hub
   */
  const connect = async (): Promise<void> => {
    if (isConnected.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Start SignalR connection
      await mockSignalRHub.start();

      // Subscribe to state changes
      unsubscribeStateChange = mockSignalRHub.onStateChange(handleStateChange);

      // Subscribe to connection state changes
      unsubscribeConnectionState = mockSignalRHub.onConnectionStateChanged(
        handleConnectionStateChange
      );

      // Update connection status
      isConnected.value = mockSignalRHub.getConnectionState() === 'connected';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value = errorMessage;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Disconnect from the backend SignalR hub
   */
  const disconnect = (): void => {
    // Unsubscribe from events
    if (unsubscribeStateChange) {
      unsubscribeStateChange();
      unsubscribeStateChange = null;
    }

    if (unsubscribeConnectionState) {
      unsubscribeConnectionState();
      unsubscribeConnectionState = null;
    }

    // Stop the hub
    mockSignalRHub.stop();

    // Update state
    isConnected.value = false;
  };

  /**
   * Send a focus change event to the backend
   */
  const sendFocusChange = async (elementId: string, hasFocus: boolean): Promise<void> => {
    if (!isConnected.value) {
      throw new Error('Not connected to backend');
    }

    const event: ClientEvent = {
      type: 'focusChanged',
      elementId,
      hasFocus,
      timestamp: Date.now(),
    };

    await mockSignalRHub.sendEvent(event);
  };

  /**
   * Send a value change event to the backend
   */
  const sendValueChange = async (
    elementId: string,
    oldValue: string | number,
    newValue: string | number
  ): Promise<void> => {
    if (!isConnected.value) {
      throw new Error('Not connected to backend');
    }

    const event: ClientEvent = {
      type: 'valueChanged',
      elementId,
      oldValue,
      newValue,
      timestamp: Date.now(),
    };

    await mockSignalRHub.sendEvent(event);
  };

  /**
   * Clear all entities from the store
   */
  const clearEntities = (): void => {
    entities.value = {};
  };

  /**
   * Clear the error state
   */
  const clearError = (): void => {
    error.value = null;
  };

  return {
    // State
    entities,
    isConnected,
    isLoading,
    error,
    lastUpdate,

    // Getters
    entityIds,
    entityCount,
    allEntities,
    getEntityById,

    // Actions
    connect,
    disconnect,
    sendFocusChange,
    sendValueChange,
    clearEntities,
    clearError,
  };
});

