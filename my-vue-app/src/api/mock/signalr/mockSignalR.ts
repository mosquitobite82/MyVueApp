import type {
  ClientEvent,
  StateChangeMessage,
  ConnectionState,
  StateChangeCallback,
  ConnectionStateCallback,
} from './types';

export interface MockSignalRConfig {
  connectionDelay?: number;
  eventDelay?: number;
  stateChangeDelay?: number;
  autoSimulateStateChanges?: boolean;
}

/**
 * Mock SignalR Hub that simulates real-time communication with a backend
 * Follows the architecture where:
 * - Frontend sends events to backend
 * - Backend responds with state changes
 * - All state changes are propagated to subscribers
 */
export class MockSignalRHub {
  private connectionState: ConnectionState = 'disconnected';
  private stateChangeCallbacks: Set<StateChangeCallback> = new Set();
  private connectionStateCallbacks: Set<ConnectionStateCallback> = new Set();
  private errorRate = 0; // Probability of network errors (0-1)
  
  private config: Required<MockSignalRConfig> = {
    connectionDelay: 100,
    eventDelay: 50,
    stateChangeDelay: 100,
    autoSimulateStateChanges: true,
  };

  constructor(config?: MockSignalRConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Start the SignalR connection
   */
  async start(): Promise<void> {
    if (this.connectionState !== 'disconnected') {
      return;
    }

    this.setConnectionState('connecting');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.setConnectionState('connected');
        resolve();
      }, this.config.connectionDelay);
    });
  }

  /**
   * Stop the SignalR connection
   */
  stop(): void {
    this.setConnectionState('disconnected');
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Send an event to the backend
   */
  async sendEvent(event: ClientEvent): Promise<void> {
    if (this.connectionState !== 'connected') {
      throw new Error('Not connected');
    }

    // Simulate network delay
    await this.simulateDelay(this.config.eventDelay);

    // Simulate random network errors
    if (this.shouldSimulateError()) {
      throw new Error('Network error: Failed to send event');
    }

    // If auto-simulate is enabled, trigger a state change after event
    if (this.config.autoSimulateStateChanges) {
      this.scheduleAutoStateChange(event);
    }
  }

  /**
   * Subscribe to state changes from the backend
   * Returns an unsubscribe function
   */
  onStateChange<T = unknown>(callback: StateChangeCallback<T>): () => void {
    this.stateChangeCallbacks.add(callback as StateChangeCallback);

    return () => {
      this.stateChangeCallbacks.delete(callback as StateChangeCallback);
    };
  }

  /**
   * Subscribe to connection state changes
   * Returns an unsubscribe function
   */
  onConnectionStateChanged(callback: ConnectionStateCallback): () => void {
    this.connectionStateCallbacks.add(callback);

    return () => {
      this.connectionStateCallbacks.delete(callback);
    };
  }

  /**
   * Simulate a state change message from the backend
   * This method is exposed for testing purposes
   */
  simulateStateChange<T = unknown>(message: StateChangeMessage<T>): void {
    if (this.connectionState !== 'connected') {
      return;
    }

    this.stateChangeCallbacks.forEach((callback) => {
      callback(message);
    });
  }

  /**
   * Set the error rate for simulating network failures
   * @param rate - Probability of errors (0-1)
   */
  setErrorRate(rate: number): void {
    this.errorRate = Math.max(0, Math.min(1, rate));
  }

  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.connectionStateCallbacks.forEach((callback) => {
      callback(state);
    });
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private shouldSimulateError(): boolean {
    return Math.random() < this.errorRate;
  }

  private scheduleAutoStateChange(event: ClientEvent): void {
    setTimeout(() => {
      if (this.connectionState !== 'connected') {
        return;
      }

      // Simulate backend processing the event and sending state change
      const stateChange = this.createStateChangeFromEvent(event);
      this.simulateStateChange(stateChange);
    }, this.config.stateChangeDelay);
  }

  private createStateChangeFromEvent(event: ClientEvent): StateChangeMessage {
    switch (event.type) {
      case 'focusChanged':
        return {
          entityId: event.elementId,
          property: 'hasFocus',
          value: event.hasFocus,
          timestamp: Date.now(),
          source: 'backend',
        };

      case 'valueChanged':
        return {
          entityId: event.elementId,
          property: 'value',
          value: event.newValue,
          timestamp: Date.now(),
          source: 'backend',
        };

      default:
        // Handle unknown event types
        return {
          entityId: 'unknown',
          property: 'unknown',
          value: event,
          timestamp: Date.now(),
          source: 'backend',
        };
    }
  }
}

/**
 * Create a singleton instance for the application
 * You can create multiple instances for testing purposes
 */
export const mockSignalRHub = new MockSignalRHub();

