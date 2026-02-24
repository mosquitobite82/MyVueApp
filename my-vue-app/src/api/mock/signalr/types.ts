// Event types that can be sent to the backend
export type EventType = 'focusChanged' | 'valueChanged'

// Event payload interfaces
export interface FocusChangedEvent {
  type: 'focusChanged'
  elementId: string
  hasFocus: boolean
  timestamp: number
}

export interface ValueChangedEvent {
  type: 'valueChanged'
  elementId: string
  oldValue: string | number
  newValue: string | number
  timestamp: number
}

export type ClientEvent = FocusChangedEvent | ValueChangedEvent

// State change message from backend
export interface StateChangeMessage<T = unknown> {
  entityId: string
  property: string
  value: T
  timestamp: number
  source?: string
}

// Connection state
export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'

// Callback types
export type StateChangeCallback<T = unknown> = (message: StateChangeMessage<T>) => void
export type ConnectionStateCallback = (state: ConnectionState) => void
