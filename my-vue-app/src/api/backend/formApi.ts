import * as SignalR from '@microsoft/signalr';
import type {
  ClientEvent,
  StateChangeMessage,
  ConnectionState,
  StateChangeCallback,
  ConnectionStateCallback,
} from '@/api/mock/signalr';

// In dev we use relative URL so Vite proxies /hubs to the backend (no cross-origin). In prod use VITE_API_URL.
const API_BASE = import.meta.env.DEV
  ? ''
  : ((import.meta.env.VITE_API_URL as string | undefined) || '');

const FORM_HUB_PATH = '/hubs/form';

/** In sync with MyBackendApp Program.cs SignalR options (dev = longer for debugging, prod = defaults). */
const SIGNALR_OPTIONS = {
  dev: {
    keepAliveIntervalMs: 2 * 60 * 1000,   // 2 min — match server KeepAliveInterval
    serverTimeoutMs: 5 * 60 * 1000,      // 5 min — ≥ 2× KeepAlive, match server ClientTimeoutInterval
  },
  prod: {
    keepAliveIntervalMs: 15 * 1000,      // 15s — match server default KeepAliveInterval
    serverTimeoutMs: 30 * 1000,          // 30s — match server default ClientTimeoutInterval
  },
} as const;

function getFormHubUrl(): string {
  const base = (API_BASE || '').replace(/\/$/, '');
  return base ? `${base}${FORM_HUB_PATH}` : FORM_HUB_PATH;
}

function mapConnectionState(s: SignalR.HubConnectionState): ConnectionState {
  switch (s) {
    case SignalR.HubConnectionState.Connected:
      return 'connected';
    case SignalR.HubConnectionState.Connecting:
      return 'connecting';
    case SignalR.HubConnectionState.Reconnecting:
      return 'reconnecting';
    default:
      return 'disconnected';
  }
}

/**
 * Real SignalR hub client for the form backend. Same interface as MockSignalRHub
 * so formStore/backendStore can use either mock or real backend.
 */
class FormApiHub {
  private connection: SignalR.HubConnection | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private stateChangeCallbacks = new Set<StateChangeCallback>();
  private connectionStateCallbacks = new Set<ConnectionStateCallback>();

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  async start(): Promise<void> {
    if (this.connectionState !== 'disconnected') return;

    this.setConnectionState('connecting');
    const url = getFormHubUrl();
    const opts = import.meta.env.DEV ? SIGNALR_OPTIONS.dev : SIGNALR_OPTIONS.prod;
    this.connection = new SignalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();
    this.connection.keepAliveIntervalInMilliseconds = opts.keepAliveIntervalMs;
    this.connection.serverTimeoutInMilliseconds = opts.serverTimeoutMs;

    this.connection.on('StateChange', (message: StateChangeMessage) => {
      this.stateChangeCallbacks.forEach((cb) => cb(message));
    });

    this.connection.onclose(() => this.setConnectionState('disconnected'));
    this.connection.onreconnecting(() => this.setConnectionState('reconnecting'));
    this.connection.onreconnected(() => this.setConnectionState('connected'));

    try {
      await this.connection.start();
      this.setConnectionState(mapConnectionState(this.connection.state));
    } catch (err) {
      this.setConnectionState('disconnected');
      const hubUrl = getFormHubUrl();
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `${message} (hub URL: ${hubUrl}). Ensure the .NET backend is running at that address.`
      );
    }
  }

  stop(): void {
    if (this.connection) {
      this.connection.stop().catch(() => {});
      this.connection = null;
    }
    this.setConnectionState('disconnected');
  }

  async sendEvent(event: ClientEvent): Promise<void> {
    if (this.connectionState !== 'connected' || !this.connection) {
      throw new Error('Not connected');
    }
    await this.connection.invoke('SendEvent', event);
  }

  onStateChange<T = unknown>(callback: StateChangeCallback<T>): () => void {
    this.stateChangeCallbacks.add(callback as StateChangeCallback);
    return () => this.stateChangeCallbacks.delete(callback as StateChangeCallback);
  }

  onConnectionStateChanged(callback: ConnectionStateCallback): () => void {
    this.connectionStateCallbacks.add(callback);
    return () => this.connectionStateCallbacks.delete(callback);
  }

  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.connectionStateCallbacks.forEach((cb) => cb(state));
  }
}

export const formApiHub = new FormApiHub();
export { getFormHubUrl };
