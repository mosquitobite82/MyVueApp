import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockSignalRHub } from '@/api/mock/signalr';
import { formApiHub } from '@/api/backend/formApi';
import type { Form } from '@/types/form';

/** Same API contract for mock and real form backend. */
export interface FormHubLike {
  start(): Promise<void>;
  stop(): void;
  getConnectionState(): string;
  sendEvent(event: import('@/api/mock/signalr').ClientEvent): Promise<void>;
  onStateChange(callback: (message: import('@/api/mock/signalr').StateChangeMessage) => void): () => void;
  onConnectionStateChanged(callback: (state: string) => void): () => void;
  /** Only mock has this; real backend sends state on connect. */
  pushFormState?(form: Form): void;
}

export type FormBackendId = 'mock' | 'real';

const BACKEND_LABELS: Record<FormBackendId, string> = {
  mock: 'Mock backend',
  real: 'Real .NET backend',
};

export const useBackendSelectionStore = defineStore('backendSelection', () => {
  const backend = ref<FormBackendId>('mock');

  const currentHub = computed<FormHubLike>(() =>
    backend.value === 'real' ? formApiHub : mockSignalRHub,
  );

  const backendOptions = computed(() =>
    (['mock', 'real'] as const).map((id) => ({
      value: id,
      title: BACKEND_LABELS[id],
    })),
  );

  function setBackend(id: FormBackendId): void {
    backend.value = id;
  }

  return {
    backend,
    currentHub,
    backendOptions,
    setBackend,
    labels: BACKEND_LABELS,
  };
});
