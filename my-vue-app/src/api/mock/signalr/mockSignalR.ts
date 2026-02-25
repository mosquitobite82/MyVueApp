import type {
  ClientEvent,
  StateChangeMessage,
  ConnectionState,
  StateChangeCallback,
  ConnectionStateCallback,
} from './types'
import type { Form } from '@/types/form'
import { applyFormFieldChange, applyFocusChange } from '@/api/backend/mockBackend'

export interface MockSignalRConfig {
  connectionDelay?: number
  eventDelay?: number
  stateChangeDelay?: number
  autoSimulateStateChanges?: boolean
  /** Minimum number of state change messages fired per event (inclusive). Default: 1 */
  minStateChangesPerAction?: number
  /** Maximum number of state change messages fired per event (inclusive). Default: 1 */
  maxStateChangesPerAction?: number
}

/**
 * Mock SignalR Hub that simulates real-time communication with a backend
 * Follows the architecture where:
 * - Frontend sends events to backend
 * - Backend responds with state changes
 * - All state changes are propagated to subscribers
 */
export class MockSignalRHub {
  private connectionState: ConnectionState = 'disconnected'
  private stateChangeCallbacks: Set<StateChangeCallback> = new Set()
  private connectionStateCallbacks: Set<ConnectionStateCallback> = new Set()
  private errorRate = 0 // Probability of network errors (0-1)

  private config: Required<MockSignalRConfig> = {
    connectionDelay: 100,
    eventDelay: 50,
    stateChangeDelay: 100,
    autoSimulateStateChanges: true,
    minStateChangesPerAction: 1,
    maxStateChangesPerAction: 1,
  }

  constructor(config?: MockSignalRConfig) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * Start the SignalR connection
   */
  async start(): Promise<void> {
    if (this.connectionState !== 'disconnected') {
      return
    }

    this.setConnectionState('connecting')

    return new Promise((resolve) => {
      setTimeout(() => {
        this.setConnectionState('connected')
        resolve()
      }, this.config.connectionDelay)
    })
  }

  /**
   * Stop the SignalR connection
   */
  stop(): void {
    this.setConnectionState('disconnected')
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  /**
   * Send an event to the backend
   */
  async sendEvent(event: ClientEvent): Promise<void> {
    if (this.connectionState !== 'connected') {
      throw new Error('Not connected')
    }

    // Simulate network delay
    await this.simulateDelay(this.config.eventDelay)

    // Simulate random network errors
    if (this.shouldSimulateError()) {
      throw new Error('Network error: Failed to send event')
    }

    // If auto-simulate is enabled, trigger a state change after event
    if (this.config.autoSimulateStateChanges) {
      this.scheduleAutoStateChange(event)
    }
  }

  /**
   * Subscribe to state changes from the backend
   * Returns an unsubscribe function
   */
  onStateChange<T = unknown>(callback: StateChangeCallback<T>): () => void {
    this.stateChangeCallbacks.add(callback as StateChangeCallback)

    return () => {
      this.stateChangeCallbacks.delete(callback as StateChangeCallback)
    }
  }

  /**
   * Subscribe to connection state changes
   * Returns an unsubscribe function
   */
  onConnectionStateChanged(callback: ConnectionStateCallback): () => void {
    this.connectionStateCallbacks.add(callback)

    return () => {
      this.connectionStateCallbacks.delete(callback)
    }
  }

  /**
   * Simulate a state change message from the backend
   * This method is exposed for testing purposes
   */
  simulateStateChange<T = unknown>(message: StateChangeMessage<T>): void {
    if (this.connectionState !== 'connected') {
      return
    }

    this.stateChangeCallbacks.forEach((callback) => {
      callback(message)
    })
  }

  /**
   * Push a complete Form state to all subscribers.
   * Simulates the backend sending the current form state over SignalR.
   */
  pushFormState(form: Form): void {
    this.simulateStateChange<Form>({
      entityId: 'form',
      property: 'state',
      value: form,
      timestamp: Date.now(),
      source: 'backend',
    })
  }

  /**
   * Update configuration values at runtime.
   * Only the provided keys are changed; others are left intact.
   */
  configure(overrides: MockSignalRConfig): void {
    this.config = { ...this.config, ...overrides }
  }

  /**
   * Set the error rate for simulating network failures
   * @param rate - Probability of errors (0-1)
   */
  setErrorRate(rate: number): void {
    this.errorRate = Math.max(0, Math.min(1, rate))
  }

  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state
    this.connectionStateCallbacks.forEach((callback) => {
      callback(state)
    })
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  private shouldSimulateError(): boolean {
    return Math.random() < this.errorRate
  }

  private scheduleAutoStateChange(event: ClientEvent): void {
    const { stateChangeDelay } = this.config

    // Form field changes are handled as a full state push, not generic property updates
    if (event.type === 'formFieldChanged') {
      setTimeout(() => {
        if (this.connectionState !== 'connected') return
        const updatedForm = applyFormFieldChange(event.sectionId, event.fieldIndex, event.newValue)
        this.pushFormState(updatedForm)
      }, stateChangeDelay)
      return
    }

    // Focus change: validate current value, update field, advance activeFieldId
    if (event.type === 'formFocusChanged') {
      setTimeout(() => {
        if (this.connectionState !== 'connected') return
        const updatedForm = applyFocusChange(event.sectionId, event.fieldIndex, event.currentValue)
        this.pushFormState(updatedForm)
      }, stateChangeDelay)
      return
    }

    const { minStateChangesPerAction, maxStateChangesPerAction } = this.config
    const count =
      Math.floor(Math.random() * (maxStateChangesPerAction - minStateChangesPerAction + 1)) +
      minStateChangesPerAction

    for (let i = 0; i < count; i++) {
      // Stagger each message so they arrive as separate UI updates
      setTimeout(
        () => {
          if (this.connectionState !== 'connected') {
            return
          }
          const stateChange = this.createStateChangeFromEvent(event, i)
          this.simulateStateChange(stateChange)
        },
        stateChangeDelay + i * stateChangeDelay,
      )
    }
  }

  private createStateChangeFromEvent(event: ClientEvent, index = 0): StateChangeMessage {
    const now = Date.now()

    // Each side-effect property paired with a value factory that produces distinct data
    const sideEffects: Array<{ property: string; value: () => unknown }> = [
      { property: 'lastModified', value: () => new Date(now).toISOString() },
      { property: 'version',      value: () => Math.floor(Math.random() * 1000) },
      { property: 'isDirty',      value: () => Math.random() > 0.5 },
      { property: 'syncedAt',     value: () => new Date(now).toLocaleTimeString() },
      { property: 'revision',     value: () => `rev-${Math.floor(Math.random() * 99) + 1}` },
    ]

    const sideEffect = (i: number): { property: string; value: () => unknown } =>
      sideEffects[((i - 1) % sideEffects.length + sideEffects.length) % sideEffects.length]!

    switch (event.type) {
      case 'focusChanged':
        if (index === 0) {
          return {
            entityId: event.elementId,
            property: 'hasFocus',
            value: event.hasFocus,
            timestamp: now,
            source: 'backend',
          }
        } {
          const { property, value } = sideEffect(index)
          return { entityId: event.elementId, property, value: value(), timestamp: now, source: 'backend' }
        }

      case 'valueChanged':
        if (index === 0) {
          return {
            entityId: event.elementId,
            property: 'value',
            value: event.newValue,
            timestamp: now,
            source: 'backend',
          }
        } {
          const { property, value } = sideEffect(index)
          return { entityId: event.elementId, property, value: value(), timestamp: now, source: 'backend' }
        }

      default: {
        const { property, value } = index === 0
          ? { property: 'unknown', value: () => event as unknown }
          : sideEffect(index)
        return { entityId: 'unknown', property, value: value(), timestamp: now, source: 'backend' }
      }
    }
  }
}

/**
 * Create a singleton instance for the application
 * You can create multiple instances for testing purposes
 */
export const mockSignalRHub = new MockSignalRHub()
