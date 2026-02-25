// Event types that can be sent to the backend
export type EventType = 'focusChanged' | 'valueChanged' | 'formFieldChanged' | 'formFocusChanged' | 'formFocusGained'

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

export interface FormFieldChangedEvent {
  type: 'formFieldChanged'
  /** formId of the Section containing the field */
  sectionId: string
  /** Index of the field within Section.fields */
  fieldIndex: number
  oldValue: unknown
  newValue: unknown
  timestamp: number
}

export interface FormFocusChangedEvent {
  type: 'formFocusChanged'
  /** formId of the Section the user is leaving */
  sectionId: string
  /** Index within Section.fields of the field the user is leaving */
  fieldIndex: number
  /** Current value of the field at the moment of blur (for backend validation) */
  currentValue: unknown
  timestamp: number
}

export interface FormFocusGainedEvent {
  type: 'formFocusGained'
  /** formId of the Section containing the field that gained focus */
  sectionId: string
  /** Index within Section.fields of the field that gained focus */
  fieldIndex: number
  timestamp: number
}

export type ClientEvent =
  | FocusChangedEvent
  | ValueChangedEvent
  | FormFieldChangedEvent
  | FormFocusChangedEvent
  | FormFocusGainedEvent

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
