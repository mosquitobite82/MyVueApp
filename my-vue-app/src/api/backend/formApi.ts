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
    this.connection = new SignalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

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
