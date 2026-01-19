// Store types for backend state management

/**
 * Generic entity structure from backend
 */
export interface Entity {
  id: string;
  [key: string]: unknown;
}

/**
 * Store state for backend entities
 */
export interface BackendState {
  entities: Record<string, Entity>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number | null;
}

/**
 * Options for sending events to backend
 */
export interface SendEventOptions {
  elementId: string;
  throwOnError?: boolean;
}

