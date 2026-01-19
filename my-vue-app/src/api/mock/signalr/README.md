# Mock SignalR API

A mock implementation of SignalR hub for testing and development purposes. This simulates real-time bidirectional communication between the frontend and backend.

## Architecture Overview

Following the application architecture:
- **Frontend sends events to backend** (e.g., `focusChanged`, `valueChanged`)
- **Backend processes events and sends state changes** back to the frontend
- **All state changes are propagated** to subscribed components
- **Frontend state stays synchronized** with backend state

## Features

- ✅ Simulates connection lifecycle (disconnected → connecting → connected)
- ✅ Send events to backend with network delay simulation
- ✅ Receive state change messages from backend
- ✅ Multiple subscribers support
- ✅ Configurable delays for testing
- ✅ Error simulation for testing edge cases
- ✅ Automatic state change simulation after events
- ✅ TypeScript support with full type safety

## Installation

```typescript
import { mockSignalRHub, MockSignalRHub } from '@/api/mock/signalr';
```

## Basic Usage

### 1. Start the Connection

```typescript
import { mockSignalRHub } from '@/api/mock/signalr';

// Start the SignalR connection
await mockSignalRHub.start();

// Check connection state
console.log(mockSignalRHub.getConnectionState()); // 'connected'
```

### 2. Send Events to Backend

```typescript
import type { ClientEvent } from '@/api/mock/signalr';

// Send a focus change event
const focusEvent: ClientEvent = {
  type: 'focusChanged',
  elementId: 'input-username',
  hasFocus: true,
  timestamp: Date.now(),
};

await mockSignalRHub.sendEvent(focusEvent);

// Send a value change event
const valueEvent: ClientEvent = {
  type: 'valueChanged',
  elementId: 'input-username',
  oldValue: 'john',
  newValue: 'john_doe',
  timestamp: Date.now(),
};

await mockSignalRHub.sendEvent(valueEvent);
```

### 3. Subscribe to State Changes

```typescript
import type { StateChangeMessage } from '@/api/mock/signalr';

// Subscribe to state changes
const unsubscribe = mockSignalRHub.onStateChange((message: StateChangeMessage) => {
  console.log('State changed:', {
    entityId: message.entityId,
    property: message.property,
    value: message.value,
    timestamp: message.timestamp,
  });
  
  // Update your component state here
});

// Later, unsubscribe when component unmounts
unsubscribe();
```

### 4. Stop the Connection

```typescript
// Stop the connection when done
mockSignalRHub.stop();
```

## Vue Composition API Integration

Here's a complete example using Vue 3 Composition API:

```typescript
import { ref, onMounted, onUnmounted } from 'vue';
import { mockSignalRHub } from '@/api/mock/signalr';
import type { StateChangeMessage, ClientEvent } from '@/api/mock/signalr';

export function useSignalR() {
  const isConnected = ref(false);
  const lastStateChange = ref<StateChangeMessage | null>(null);
  let unsubscribe: (() => void) | null = null;

  onMounted(async () => {
    // Start connection
    await mockSignalRHub.start();
    isConnected.value = true;

    // Subscribe to state changes
    unsubscribe = mockSignalRHub.onStateChange((message) => {
      lastStateChange.value = message;
      // Handle state change in your app
    });
  });

  onUnmounted(() => {
    // Clean up
    if (unsubscribe) {
      unsubscribe();
    }
    mockSignalRHub.stop();
    isConnected.value = false;
  });

  const sendFocusChange = async (elementId: string, hasFocus: boolean) => {
    const event: ClientEvent = {
      type: 'focusChanged',
      elementId,
      hasFocus,
      timestamp: Date.now(),
    };
    await mockSignalRHub.sendEvent(event);
  };

  const sendValueChange = async (
    elementId: string, 
    oldValue: string | number, 
    newValue: string | number
  ) => {
    const event: ClientEvent = {
      type: 'valueChanged',
      elementId,
      oldValue,
      newValue,
      timestamp: Date.now(),
    };
    await mockSignalRHub.sendEvent(event);
  };

  return {
    isConnected,
    lastStateChange,
    sendFocusChange,
    sendValueChange,
  };
}
```

## Configuration

Create a custom instance with configuration:

```typescript
import { MockSignalRHub } from '@/api/mock/signalr';

const customHub = new MockSignalRHub({
  connectionDelay: 500,        // Time to establish connection (ms)
  eventDelay: 100,             // Network delay for sending events (ms)
  stateChangeDelay: 200,       // Delay before backend sends state change (ms)
  autoSimulateStateChanges: true, // Auto-send state changes after events
});

await customHub.start();
```

## Testing

### Basic Test Example

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockSignalRHub } from '@/api/mock/signalr';

describe('My Component', () => {
  let hub: MockSignalRHub;

  beforeEach(() => {
    vi.useFakeTimers();
    hub = new MockSignalRHub();
  });

  it('should handle state changes', async () => {
    const callback = vi.fn();
    
    const promise = hub.start();
    await vi.advanceTimersByTimeAsync(100);
    await promise;

    hub.onStateChange(callback);

    // Simulate backend state change
    hub.simulateStateChange({
      entityId: 'test-entity',
      property: 'status',
      value: 'active',
      timestamp: Date.now(),
    });

    expect(callback).toHaveBeenCalled();
  });
});
```

### Error Simulation

```typescript
// Simulate network failures
hub.setErrorRate(0.5); // 50% chance of errors

try {
  await hub.sendEvent(event);
} catch (error) {
  console.error('Network error:', error);
}
```

## API Reference

### MockSignalRHub

#### Methods

- `start(): Promise<void>` - Start the SignalR connection
- `stop(): void` - Stop the SignalR connection
- `getConnectionState(): ConnectionState` - Get current connection state
- `sendEvent(event: ClientEvent): Promise<void>` - Send an event to backend
- `onStateChange<T>(callback: StateChangeCallback<T>): () => void` - Subscribe to state changes (returns unsubscribe function)
- `onConnectionStateChanged(callback: ConnectionStateCallback): () => void` - Subscribe to connection state changes
- `simulateStateChange<T>(message: StateChangeMessage<T>): void` - Manually trigger a state change (for testing)
- `setErrorRate(rate: number): void` - Set error simulation rate (0-1)

#### Types

```typescript
type EventType = 'focusChanged' | 'valueChanged';

interface FocusChangedEvent {
  type: 'focusChanged';
  elementId: string;
  hasFocus: boolean;
  timestamp: number;
}

interface ValueChangedEvent {
  type: 'valueChanged';
  elementId: string;
  oldValue: string | number;
  newValue: string | number;
  timestamp: number;
}

type ClientEvent = FocusChangedEvent | ValueChangedEvent;

interface StateChangeMessage<T = unknown> {
  entityId: string;
  property: string;
  value: T;
  timestamp: number;
  source?: string;
}

type ConnectionState = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'reconnecting';
```

## Best Practices

1. **Always unsubscribe** from state changes when components unmount
2. **Handle connection errors** gracefully in production
3. **Use TypeScript generics** for type-safe state changes
4. **Test with fake timers** for predictable test behavior
5. **Separate side-effect components** from pure components
6. **Keep state synchronized** with backend at all times

## Migration to Real SignalR

When migrating to real SignalR:

1. Replace imports from `@/api/mock/signalr` to your real SignalR module
2. Update event types if backend uses different format
3. Add proper error handling and reconnection logic
4. Configure SignalR hub URL and authentication
5. Update tests to use integration tests with real backend

## Examples

See the test file `mockSignalR.test.ts` for comprehensive examples of all features.

