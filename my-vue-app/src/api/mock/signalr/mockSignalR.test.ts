import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MockSignalRHub } from './mockSignalR';
import type { ClientEvent, StateChangeMessage } from './types';

describe('MockSignalRHub', () => {
  let hub: MockSignalRHub;

  beforeEach(() => {
    vi.useFakeTimers();
    hub = new MockSignalRHub();
  });

  afterEach(() => {
    hub.stop();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('connection management', () => {
    it('should start in disconnected state', () => {
      expect(hub.getConnectionState()).toBe('disconnected');
    });

    it('should transition to connected state when started', async () => {
      const promise = hub.start();
      
      // Advance timers to simulate connection delay
      await vi.advanceTimersByTimeAsync(100);
      
      await promise;
      expect(hub.getConnectionState()).toBe('connected');
    });

    it('should notify connection state changes', async () => {
      const callback = vi.fn();
      hub.onConnectionStateChanged(callback);

      const promise = hub.start();
      await vi.advanceTimersByTimeAsync(100);
      await promise;

      expect(callback).toHaveBeenCalledWith('connecting');
      expect(callback).toHaveBeenCalledWith('connected');
    });

    it('should transition to disconnected when stopped', async () => {
      const promise = hub.start();
      await vi.advanceTimersByTimeAsync(100);
      await promise;
      
      hub.stop();
      
      expect(hub.getConnectionState()).toBe('disconnected');
    });

    it('should not allow sending events when disconnected', async () => {
      const event: ClientEvent = {
        type: 'focusChanged',
        elementId: 'input1',
        hasFocus: true,
        timestamp: Date.now(),
      };

      await expect(hub.sendEvent(event)).rejects.toThrow('Not connected');
    });
  });

  describe('sending events', () => {
    beforeEach(async () => {
      const promise = hub.start();
      await vi.advanceTimersByTimeAsync(100);
      await promise;
    });

    it('should send focusChanged event', async () => {
      const event: ClientEvent = {
        type: 'focusChanged',
        elementId: 'input1',
        hasFocus: true,
        timestamp: Date.now(),
      };

      const promise = hub.sendEvent(event);
      await vi.advanceTimersByTimeAsync(200); // eventDelay + stateChangeDelay
      await expect(promise).resolves.toBeUndefined();
    });

    it('should send valueChanged event', async () => {
      const event: ClientEvent = {
        type: 'valueChanged',
        elementId: 'input1',
        oldValue: 'old',
        newValue: 'new',
        timestamp: Date.now(),
      };

      const promise = hub.sendEvent(event);
      await vi.advanceTimersByTimeAsync(200); // eventDelay + stateChangeDelay
      await expect(promise).resolves.toBeUndefined();
    });

    it('should simulate network delay when sending events', async () => {
      const event: ClientEvent = {
        type: 'focusChanged',
        elementId: 'input1',
        hasFocus: true,
        timestamp: Date.now(),
      };

      const promise = hub.sendEvent(event);
      
      // Should not resolve immediately
      let resolved = false;
      promise.then(() => { resolved = true; });
      
      await vi.advanceTimersByTimeAsync(10);
      expect(resolved).toBe(false);
      
      // Should resolve after delay
      await vi.advanceTimersByTimeAsync(90);
      await promise;
      expect(resolved).toBe(true);
    });
  });

  describe('receiving state changes', () => {
    beforeEach(async () => {
      const promise = hub.start();
      await vi.advanceTimersByTimeAsync(100);
      await promise;
    });

    it('should receive state change messages', async () => {
      const callback = vi.fn();
      hub.onStateChange(callback);

      // Simulate backend sending a state change
      const stateChange: StateChangeMessage = {
        entityId: 'entity1',
        property: 'status',
        value: 'active',
        timestamp: Date.now(),
      };

      hub.simulateStateChange(stateChange);

      expect(callback).toHaveBeenCalledWith(stateChange);
    });

    it('should handle multiple subscribers', async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      hub.onStateChange(callback1);
      hub.onStateChange(callback2);

      const stateChange: StateChangeMessage = {
        entityId: 'entity1',
        property: 'status',
        value: 'active',
        timestamp: Date.now(),
      };

      hub.simulateStateChange(stateChange);

      expect(callback1).toHaveBeenCalledWith(stateChange);
      expect(callback2).toHaveBeenCalledWith(stateChange);
    });

    it('should allow unsubscribing from state changes', async () => {
      const callback = vi.fn();
      const unsubscribe = hub.onStateChange(callback);

      const stateChange: StateChangeMessage = {
        entityId: 'entity1',
        property: 'status',
        value: 'active',
        timestamp: Date.now(),
      };

      hub.simulateStateChange(stateChange);
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      hub.simulateStateChange(stateChange);
      expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should not receive state changes when disconnected', async () => {
      const callback = vi.fn();
      hub.onStateChange(callback);

      hub.stop();

      const stateChange: StateChangeMessage = {
        entityId: 'entity1',
        property: 'status',
        value: 'active',
        timestamp: Date.now(),
      };

      hub.simulateStateChange(stateChange);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('automatic state changes simulation', () => {
    beforeEach(async () => {
      const promise = hub.start();
      await vi.advanceTimersByTimeAsync(100);
      await promise;
    });

    it('should automatically emit state changes after events', async () => {
      const callback = vi.fn();
      hub.onStateChange(callback);

      const event: ClientEvent = {
        type: 'valueChanged',
        elementId: 'input1',
        oldValue: 'old',
        newValue: 'new',
        timestamp: Date.now(),
      };

      const promise = hub.sendEvent(event);
      await vi.advanceTimersByTimeAsync(100);
      await promise;

      // Should simulate backend sending state change
      await vi.advanceTimersByTimeAsync(200);

      expect(callback).toHaveBeenCalled();
      const stateChange = callback.mock.calls[0][0] as StateChangeMessage;
      expect(stateChange.entityId).toBe('input1');
      expect(stateChange.value).toBe('new');
    });
  });

  describe('error simulation', () => {
    beforeEach(async () => {
      const promise = hub.start();
      await vi.advanceTimersByTimeAsync(100);
      await promise;
    });

    it('should simulate random network errors', async () => {
      // Enable error simulation
      hub.setErrorRate(1.0); // 100% error rate

      const event: ClientEvent = {
        type: 'focusChanged',
        elementId: 'input1',
        hasFocus: true,
        timestamp: Date.now(),
      };

      const promise = hub.sendEvent(event).catch((e) => e);
      await vi.advanceTimersByTimeAsync(200);
      const result = await promise;
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toContain('Network error');
    });

    it('should not throw errors when error rate is 0', async () => {
      hub.setErrorRate(0); // 0% error rate

      const event: ClientEvent = {
        type: 'focusChanged',
        elementId: 'input1',
        hasFocus: true,
        timestamp: Date.now(),
      };

      const promise = hub.sendEvent(event);
      await vi.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('configuration', () => {
    it('should allow configuring connection delay', async () => {
      const customHub = new MockSignalRHub({ connectionDelay: 500 });
      
      const promise = customHub.start();
      
      // Should not connect before delay
      await vi.advanceTimersByTimeAsync(400);
      expect(customHub.getConnectionState()).toBe('connecting');
      
      // Should connect after delay
      await vi.advanceTimersByTimeAsync(100);
      await promise;
      expect(customHub.getConnectionState()).toBe('connected');

      customHub.stop();
    });

    it('should allow configuring event delay', async () => {
      const customHub = new MockSignalRHub({ eventDelay: 500 });
      const startPromise = customHub.start();
      await vi.advanceTimersByTimeAsync(100);
      await startPromise;

      const event: ClientEvent = {
        type: 'focusChanged',
        elementId: 'input1',
        hasFocus: true,
        timestamp: Date.now(),
      };

      const promise = customHub.sendEvent(event);
      
      let resolved = false;
      promise.then(() => { resolved = true; }).catch(() => {});
      
      await vi.advanceTimersByTimeAsync(400);
      expect(resolved).toBe(false);
      
      await vi.advanceTimersByTimeAsync(200); // Need more time for stateChangeDelay too
      await promise;
      expect(resolved).toBe(true);

      customHub.stop();
    });
  });
});

