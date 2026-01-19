# Backend State Store

A Pinia store that manages all state synchronized with the backend through SignalR. This store ensures that the frontend state is **always up-to-date** with the backend state.

## Architecture

Following the application architecture:

1. **All states come from backend** - The store receives state updates through SignalR
2. **State changes via events** - Send events to backend, which processes and responds with state changes
3. **Frontend subscribes to changes** - The store automatically updates when backend sends state changes
4. **Always synchronized** - Frontend state is kept in sync with backend at all times

## Features

✅ Automatic connection to SignalR hub  
✅ Real-time state synchronization  
✅ Entity-based state management  
✅ Type-safe operations  
✅ Error handling and loading states  
✅ Vue Composition API compatible  
✅ Fully tested with 23 passing tests  

## Installation

The store is automatically available after Pinia setup in `main.ts`:

```typescript
import { createPinia } from 'pinia';

const pinia = createPinia();
app.use(pinia);
```

## Basic Usage

### 1. Connect to Backend

```typescript
import { useBackendStore } from '@/stores';

const backendStore = useBackendStore();

// Connect to the backend
await backendStore.connect();

// Check connection status
console.log(backendStore.isConnected); // true
```

### 2. Send Events to Backend

```typescript
// Send focus change event
await backendStore.sendFocusChange('input-username', true);

// Send value change event
await backendStore.sendValueChange('input-username', 'john', 'john_doe');
```

### 3. Access Synchronized State

```typescript
// Get all entities
const allEntities = backendStore.allEntities;

// Get specific entity
const entity = backendStore.getEntityById('entity1');

// Get entity count
const count = backendStore.entityCount;

// Get entity IDs
const ids = backendStore.entityIds;
```

### 4. Monitor Connection State

```typescript
// Check if connected
if (backendStore.isConnected) {
  console.log('Connected to backend');
}

// Check for errors
if (backendStore.error) {
  console.error('Backend error:', backendStore.error);
}

// Check loading state
if (backendStore.isLoading) {
  console.log('Connecting...');
}
```

### 5. Disconnect

```typescript
// Clean up when done
backendStore.disconnect();
```

## Vue Component Integration

### Complete Example with Composition API

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useBackendStore } from '@/stores';

const backendStore = useBackendStore();
const inputValue = ref('');

// Computed properties for reactive state
const isConnected = computed(() => backendStore.isConnected);
const entities = computed(() => backendStore.allEntities);
const error = computed(() => backendStore.error);

// Connect on mount
onMounted(async () => {
  try {
    await backendStore.connect();
    console.log('Connected to backend');
  } catch (err) {
    console.error('Failed to connect:', err);
  }
});

// Disconnect on unmount
onUnmounted(() => {
  backendStore.disconnect();
});

// Handle input focus
const handleFocus = async (hasFocus: boolean) => {
  try {
    await backendStore.sendFocusChange('my-input', hasFocus);
  } catch (err) {
    console.error('Failed to send focus event:', err);
  }
};

// Handle input value change
const handleValueChange = async (newValue: string) => {
  const oldValue = inputValue.value;
  inputValue.value = newValue;
  
  try {
    await backendStore.sendValueChange('my-input', oldValue, newValue);
  } catch (err) {
    console.error('Failed to send value change:', err);
    // Revert on error
    inputValue.value = oldValue;
  }
};
</script>

<template>
  <div>
    <div v-if="!isConnected" class="warning">
      Not connected to backend
    </div>
    
    <div v-if="error" class="error">
      Error: {{ error }}
      <button @click="backendStore.clearError">Dismiss</button>
    </div>

    <input
      v-model="inputValue"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
      @input="handleValueChange($event.target.value)"
      placeholder="Type something..."
    />

    <div class="entities">
      <h3>Backend Entities ({{ entities.length }})</h3>
      <div v-for="entity in entities" :key="entity.id">
        {{ entity.id }}: {{ JSON.stringify(entity) }}
      </div>
    </div>
  </div>
</template>
```

### Composable for Reusability

Create a composable for common patterns:

```typescript
// composables/useBackendConnection.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { useBackendStore } from '@/stores';

export function useBackendConnection() {
  const backendStore = useBackendStore();
  const connectionError = ref<string | null>(null);

  onMounted(async () => {
    if (backendStore.isConnected) {
      return; // Already connected
    }

    try {
      await backendStore.connect();
    } catch (err) {
      connectionError.value = err instanceof Error ? err.message : 'Unknown error';
    }
  });

  onUnmounted(() => {
    // Only disconnect if no other components are using it
    // In production, you might want more sophisticated connection management
    backendStore.disconnect();
  });

  return {
    backendStore,
    connectionError,
    isConnected: () => backendStore.isConnected,
  };
}
```

Usage in component:

```vue
<script setup lang="ts">
import { useBackendConnection } from '@/composables/useBackendConnection';

const { backendStore, connectionError, isConnected } = useBackendConnection();

// Now you can use backendStore without worrying about connection
const sendEvent = async () => {
  if (!isConnected()) return;
  
  await backendStore.sendFocusChange('element1', true);
};
</script>
```

## API Reference

### State

- `entities: Record<string, Entity>` - All entities synchronized from backend
- `isConnected: boolean` - Connection status
- `isLoading: boolean` - Loading state during connection
- `error: string | null` - Error message if any
- `lastUpdate: number | null` - Timestamp of last state update

### Getters

- `entityIds: string[]` - Array of all entity IDs
- `entityCount: number` - Total number of entities
- `allEntities: Entity[]` - Array of all entities
- `getEntityById(id: string): Entity | undefined` - Get specific entity

### Actions

- `connect(): Promise<void>` - Connect to backend SignalR hub
- `disconnect(): void` - Disconnect from backend
- `sendFocusChange(elementId: string, hasFocus: boolean): Promise<void>` - Send focus event
- `sendValueChange(elementId: string, oldValue: string | number, newValue: string | number): Promise<void>` - Send value change event
- `clearEntities(): void` - Clear all entities
- `clearError(): void` - Clear error state

### Types

```typescript
interface Entity {
  id: string;
  [key: string]: unknown;
}

interface BackendState {
  entities: Record<string, Entity>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number | null;
}
```

## State Updates

The store automatically receives and processes state changes from the backend:

```typescript
// When backend sends a state change:
{
  entityId: 'user-123',
  property: 'name',
  value: 'John Doe',
  timestamp: 1234567890
}

// The store automatically updates:
backendStore.entities['user-123'] = {
  id: 'user-123',
  name: 'John Doe'
};
```

Multiple properties of the same entity can be updated:

```typescript
// First update
{ entityId: 'user-123', property: 'name', value: 'John' }
// Result: { id: 'user-123', name: 'John' }

// Second update
{ entityId: 'user-123', property: 'email', value: 'john@example.com' }
// Result: { id: 'user-123', name: 'John', email: 'john@example.com' }
```

## Error Handling

Always wrap store actions in try-catch blocks:

```typescript
try {
  await backendStore.connect();
} catch (err) {
  console.error('Connection failed:', err);
  // Show error to user
}

try {
  await backendStore.sendValueChange('input1', 'old', 'new');
} catch (err) {
  console.error('Failed to send event:', err);
  // Revert local state if needed
}
```

## Testing

The store is fully tested. Example test:

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useBackendStore } from '@/stores';

describe('My Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should use backend store', async () => {
    const store = useBackendStore();
    
    await store.connect();
    
    expect(store.isConnected).toBe(true);
  });
});
```

## Best Practices

1. **Always check connection** before sending events
2. **Handle errors gracefully** in UI
3. **Use composables** for reusable connection logic
4. **Clean up** by disconnecting when components unmount
5. **Don't mutate state directly** - let backend updates drive state changes
6. **Use computed properties** for reactive access to store state
7. **Test with mocks** for predictable behavior

## Integration with SignalR Mock

The store integrates seamlessly with the mock SignalR API:

```typescript
// The store uses the mock SignalR hub
import { mockSignalRHub } from '@/api/mock/signalr';

// When you connect the store, it:
// 1. Starts the SignalR connection
// 2. Subscribes to state changes
// 3. Subscribes to connection state changes
// 4. Updates store state automatically
```

## Migration to Production

When migrating to a real backend:

1. Replace `@/api/mock/signalr` with your real SignalR client
2. Update entity types to match your backend models
3. Add authentication if needed
4. Configure SignalR hub URL
5. Add reconnection logic
6. Update error handling for production scenarios

## See Also

- [Mock SignalR API Documentation](../api/mock/signalr/README.md)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

