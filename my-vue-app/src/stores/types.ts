// Store types for backend state management

import type { Form } from '@/types/form'

/**
 * Generic entity structure from backend
 */
export interface Entity {
  id: string
  [key: string]: unknown
}

/**
 * Store state for backend entities
 */
export interface BackendState {
  entities: Record<string, Entity>
  isConnected: boolean
  isLoading: boolean
  error: string | null
  lastUpdate: number | null
}

export type FormState = Form

/**
 * Options for sending events to backend
 */
export interface SendEventOptions {
  elementId: string
  throwOnError?: boolean
}
