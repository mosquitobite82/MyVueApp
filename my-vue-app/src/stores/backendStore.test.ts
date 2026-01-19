import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBackendStore } from './backendStore';
import { MockSignalRHub } from '@/api/mock/signalr';
import type { StateChangeMessage } from '@/api/mock/signalr';

// Mock the SignalR module
vi.mock('@/api/mock/signalr', () => {
  const mockHub = {
    start: vi.fn(),
    stop: vi.fn(),
    getConnectionState: vi.fn(() => 'disconnected'),
    sendEvent: vi.fn(),
    onStateChange: vi.fn(() => vi.fn()),
    onConnectionStateChanged: vi.fn(() => vi.fn()),
  };

  return {
    MockSignalRHub: vi.fn(() => mockHub),
    mockSignalRHub: mockHub,
  };
});

describe('useBackendStore', () => {
  let store: ReturnType<typeof useBackendStore>;
  let mockHub: any;

  beforeEach(async () => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    store = useBackendStore();
    
    // Get the mock hub instance from the mocked module
    const { mockSignalRHub } = await import('@/api/mock/signalr');
    mockHub = mockSignalRHub;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      expect(store.entities).toEqual({});
      expect(store.isConnected).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should have a list of all entity IDs', () => {
      expect(store.entityIds).toEqual([]);
    });

    it('should count entities correctly', () => {
      expect(store.entityCount).toBe(0);
    });
  });

  describe('connection management', () => {
    it('should connect to SignalR hub', async () => {
      mockHub.start.mockResolvedValue(undefined);
      mockHub.getConnectionState.mockReturnValue('connected');

      await store.connect();

      expect(mockHub.start).toHaveBeenCalled();
      expect(store.isConnected).toBe(true);
    });

    it('should set loading state while connecting', async () => {
      let resolveStart: () => void;
      const startPromise = new Promise<void>((resolve) => {
        resolveStart = resolve;
      });
      mockHub.start.mockReturnValue(startPromise);

      const connectPromise = store.connect();
      
      expect(store.isLoading).toBe(true);

      resolveStart!();
      await connectPromise;

      expect(store.isLoading).toBe(false);
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockHub.start.mockRejectedValue(error);

      await expect(store.connect()).rejects.toThrow('Connection failed');
      expect(store.error).toBe('Connection failed');
      expect(store.isLoading).toBe(false);
    });

    it('should disconnect from SignalR hub', () => {
      mockHub.getConnectionState.mockReturnValue('disconnected');
      
      store.disconnect();

      expect(mockHub.stop).toHaveBeenCalled();
      expect(store.isConnected).toBe(false);
    });

    it('should subscribe to state changes on connect', async () => {
      mockHub.start.mockResolvedValue(undefined);
      mockHub.getConnectionState.mockReturnValue('connected');

      await store.connect();

      expect(mockHub.onStateChange).toHaveBeenCalled();
    });

    it('should update connection state when it changes', async () => {
      let connectionCallback: any;
      mockHub.onConnectionStateChanged.mockImplementation((cb: any) => {
        connectionCallback = cb;
        return vi.fn();
      });

      await store.connect();

      // Simulate connection state change
      connectionCallback('connected');
      expect(store.isConnected).toBe(true);

      connectionCallback('disconnected');
      expect(store.isConnected).toBe(false);
    });
  });

  describe('receiving state changes', () => {
    beforeEach(async () => {
      mockHub.start.mockResolvedValue(undefined);
      mockHub.getConnectionState.mockReturnValue('connected');
    });

    it('should handle state change messages', async () => {
      let stateChangeCallback: any;
      mockHub.onStateChange.mockImplementation((cb: any) => {
        stateChangeCallback = cb;
        return vi.fn();
      });

      await store.connect();

      const stateChange: StateChangeMessage = {
        entityId: 'entity1',
        property: 'status',
        value: 'active',
        timestamp: Date.now(),
      };

      stateChangeCallback(stateChange);

      expect(store.entities['entity1']).toBeDefined();
      expect(store.entities['entity1'].status).toBe('active');
    });

    it('should create new entity if it does not exist', async () => {
      let stateChangeCallback: any;
      mockHub.onStateChange.mockImplementation((cb: any) => {
        stateChangeCallback = cb;
        return vi.fn();
      });

      await store.connect();

      const stateChange: StateChangeMessage = {
        entityId: 'new-entity',
        property: 'name',
        value: 'Test Entity',
        timestamp: Date.now(),
      };

      stateChangeCallback(stateChange);

      expect(store.entities['new-entity']).toEqual({
        id: 'new-entity',
        name: 'Test Entity',
      });
    });

    it('should update existing entity properties', async () => {
      let stateChangeCallback: any;
      mockHub.onStateChange.mockImplementation((cb: any) => {
        stateChangeCallback = cb;
        return vi.fn();
      });

      await store.connect();

      // Create entity
      const stateChange1: StateChangeMessage = {
        entityId: 'entity1',
        property: 'name',
        value: 'Initial Name',
        timestamp: Date.now(),
      };
      stateChangeCallback(stateChange1);

      // Update entity
      const stateChange2: StateChangeMessage = {
        entityId: 'entity1',
        property: 'name',
        value: 'Updated Name',
        timestamp: Date.now(),
      };
      stateChangeCallback(stateChange2);

      expect(store.entities['entity1'].name).toBe('Updated Name');
    });

    it('should update lastUpdate timestamp', async () => {
      let stateChangeCallback: any;
      mockHub.onStateChange.mockImplementation((cb: any) => {
        stateChangeCallback = cb;
        return vi.fn();
      });

      await store.connect();

      const timestamp = Date.now();
      const stateChange: StateChangeMessage = {
        entityId: 'entity1',
        property: 'status',
        value: 'active',
        timestamp,
      };

      stateChangeCallback(stateChange);

      expect(store.lastUpdate).toBe(timestamp);
    });

    it('should handle multiple entities', async () => {
      let stateChangeCallback: any;
      mockHub.onStateChange.mockImplementation((cb: any) => {
        stateChangeCallback = cb;
        return vi.fn();
      });

      await store.connect();

      stateChangeCallback({
        entityId: 'entity1',
        property: 'name',
        value: 'Entity 1',
        timestamp: Date.now(),
      });

      stateChangeCallback({
        entityId: 'entity2',
        property: 'name',
        value: 'Entity 2',
        timestamp: Date.now(),
      });

      expect(store.entityCount).toBe(2);
      expect(store.entityIds).toEqual(['entity1', 'entity2']);
    });
  });

  describe('sending events', () => {
    beforeEach(async () => {
      mockHub.start.mockResolvedValue(undefined);
      mockHub.getConnectionState.mockReturnValue('connected');
      mockHub.sendEvent.mockResolvedValue(undefined);
      await store.connect();
    });

    it('should send focus change events', async () => {
      await store.sendFocusChange('input1', true);

      expect(mockHub.sendEvent).toHaveBeenCalledWith({
        type: 'focusChanged',
        elementId: 'input1',
        hasFocus: true,
        timestamp: expect.any(Number),
      });
    });

    it('should send value change events', async () => {
      await store.sendValueChange('input1', 'old', 'new');

      expect(mockHub.sendEvent).toHaveBeenCalledWith({
        type: 'valueChanged',
        elementId: 'input1',
        oldValue: 'old',
        newValue: 'new',
        timestamp: expect.any(Number),
      });
    });

    it('should throw error when not connected', async () => {
      mockHub.getConnectionState.mockReturnValue('disconnected');
      store.$patch({ isConnected: false });

      await expect(store.sendFocusChange('input1', true)).rejects.toThrow(
        'Not connected to backend'
      );
    });

    it('should handle send errors', async () => {
      mockHub.sendEvent.mockRejectedValue(new Error('Network error'));

      await expect(store.sendValueChange('input1', 'old', 'new')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getters', () => {
    beforeEach(async () => {
      mockHub.start.mockResolvedValue(undefined);
      mockHub.getConnectionState.mockReturnValue('connected');
      
      let stateChangeCallback: any;
      mockHub.onStateChange.mockImplementation((cb: any) => {
        stateChangeCallback = cb;
        return vi.fn();
      });

      await store.connect();

      // Add some test entities
      stateChangeCallback({
        entityId: 'entity1',
        property: 'name',
        value: 'Entity 1',
        timestamp: Date.now(),
      });

      stateChangeCallback({
        entityId: 'entity2',
        property: 'name',
        value: 'Entity 2',
        timestamp: Date.now(),
      });
    });

    it('should get entity by id', () => {
      const entity = store.getEntityById('entity1');
      expect(entity).toBeDefined();
      expect(entity?.name).toBe('Entity 1');
    });

    it('should return undefined for non-existent entity', () => {
      const entity = store.getEntityById('non-existent');
      expect(entity).toBeUndefined();
    });

    it('should get all entities as array', () => {
      const entities = store.allEntities;
      expect(entities).toHaveLength(2);
      expect(entities.map(e => e.id)).toEqual(['entity1', 'entity2']);
    });
  });

  describe('actions', () => {
    it('should clear all entities', () => {
      store.$patch({
        entities: {
          entity1: { id: 'entity1', name: 'Test' },
        },
      });

      store.clearEntities();

      expect(store.entities).toEqual({});
      expect(store.entityCount).toBe(0);
    });

    it('should clear error', () => {
      store.$patch({ error: 'Some error' });

      store.clearError();

      expect(store.error).toBeNull();
    });
  });
});

