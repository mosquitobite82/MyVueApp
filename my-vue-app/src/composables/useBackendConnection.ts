import { ref, onMounted, onUnmounted } from 'vue';
import { useBackendStore } from '@/stores';

/**
 * Composable for managing backend connection lifecycle
 * 
 * Automatically connects on mount and disconnects on unmount.
 * Provides reactive access to connection state and error handling.
 * 
 * @example
 * ```typescript
 * const { backendStore, connectionError, isConnected } = useBackendConnection();
 * 
 * // Use the store
 * if (isConnected.value) {
 *   await backendStore.sendFocusChange('input1', true);
 * }
 * ```
 */
export function useBackendConnection() {
  const backendStore = useBackendStore();
  const connectionError = ref<string | null>(null);
  const isConnecting = ref(false);

  onMounted(async () => {
    // Skip if already connected
    if (backendStore.isConnected) {
      return;
    }

    isConnecting.value = true;
    connectionError.value = null;

    try {
      await backendStore.connect();
    } catch (err) {
      connectionError.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Backend connection failed:', err);
    } finally {
      isConnecting.value = false;
    }
  });

  onUnmounted(() => {
    // Disconnect when component unmounts
    // Note: In a real app, you might want to keep the connection alive
    // if multiple components use it. Consider connection pooling.
    backendStore.disconnect();
  });

  /**
   * Retry connection
   */
  const retry = async (): Promise<void> => {
    connectionError.value = null;
    backendStore.clearError();
    
    try {
      await backendStore.connect();
    } catch (err) {
      connectionError.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    }
  };

  return {
    backendStore,
    connectionError,
    isConnecting,
    retry,
  };
}

