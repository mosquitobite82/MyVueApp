import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useBackendConnection } from './useBackendConnection';
import { useBackendStore } from '@/stores';

// Mock the SignalR module
vi.mock('@/api/mock/signalr', () => {
  const mockHub = {
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn(),
    getConnectionState: vi.fn(() => 'connected'),
    sendEvent: vi.fn().mockResolvedValue(undefined),
    onStateChange: vi.fn(() => vi.fn()),
    onConnectionStateChanged: vi.fn(() => vi.fn()),
  };

  return {
    MockSignalRHub: vi.fn(() => mockHub),
    mockSignalRHub: mockHub,
  };
});

describe('useBackendConnection', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should connect on mount', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { backendStore } = useBackendConnection();
        return { backendStore };
      },
      template: '<div>{{ backendStore.isConnected }}</div>',
    });

    const wrapper = mount(TestComponent);
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    const store = useBackendStore();
    expect(store.isConnected).toBe(true);

    wrapper.unmount();
  });

  it('should disconnect on unmount', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { backendStore } = useBackendConnection();
        return { backendStore };
      },
      template: '<div>Test</div>',
    });

    const wrapper = mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 0));

    const store = useBackendStore();
    const disconnectSpy = vi.spyOn(store, 'disconnect');

    wrapper.unmount();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should handle connection errors', async () => {
    const error = new Error('Connection failed');
    
    // Mock connection failure
    const { mockSignalRHub } = await import('@/api/mock/signalr');
    vi.mocked(mockSignalRHub.start).mockRejectedValueOnce(error);

    const TestComponent = defineComponent({
      setup() {
        const { connectionError } = useBackendConnection();
        return { connectionError };
      },
      template: '<div>{{ connectionError }}</div>',
    });

    const wrapper = mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(wrapper.text()).toBe('Connection failed');

    wrapper.unmount();
  });

  it('should provide retry function', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { retry, backendStore } = useBackendConnection();
        return { retry, backendStore };
      },
      template: '<div>Test</div>',
    });

    const wrapper = mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 0));

    const { retry } = (wrapper.vm as any);
    await retry();

    expect((wrapper.vm as any).backendStore.isConnected).toBe(true);

    wrapper.unmount();
  });
});

