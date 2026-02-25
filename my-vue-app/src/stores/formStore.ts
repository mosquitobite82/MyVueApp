import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockSignalRHub } from '@/api/mock/signalr'
import type { StateChangeMessage } from '@/api/mock/signalr'
import type { Form } from '@/types/form'
import { mockFormState } from '@/api/backend/mockBackend'
import type { FormFieldChangedEvent, FormFocusChangedEvent } from '@/api/mock/signalr'

export const useFormStore = defineStore('form', () => {
  const form = ref<Form | null>(null)
  const isConnected = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribeStateChange: (() => void) | null = null
  let unsubscribeConnectionState: (() => void) | null = null

  const handleStateChange = (message: StateChangeMessage): void => {
    if (message.entityId === 'form' && message.property === 'state') {
      form.value = message.value as Form
    }
  }

  const handleConnectionStateChange = (state: string): void => {
    isConnected.value = state === 'connected'
  }

  const connect = async (): Promise<void> => {
    if (isConnected.value) return

    isLoading.value = true
    error.value = null

    try {
      await mockSignalRHub.start()

      unsubscribeStateChange = mockSignalRHub.onStateChange(handleStateChange)
      unsubscribeConnectionState = mockSignalRHub.onConnectionStateChanged(
        handleConnectionStateChange,
      )

      isConnected.value = mockSignalRHub.getConnectionState() === 'connected'

      // Simulate backend pushing the initial form state on connect
      mockSignalRHub.pushFormState(mockFormState())
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const disconnect = (): void => {
    unsubscribeStateChange?.()
    unsubscribeStateChange = null
    unsubscribeConnectionState?.()
    unsubscribeConnectionState = null
    mockSignalRHub.stop()
    isConnected.value = false
  }

  /**
   * Sends a text field change to the mock backend.
   * The backend will apply the change and push back the updated form state.
   */
  const sendFieldChange = async (
    sectionId: string,
    fieldIndex: number,
    oldValue: unknown,
    newValue: unknown,
  ): Promise<void> => {
    if (!isConnected.value) throw new Error('Not connected')

    const event: FormFieldChangedEvent = {
      type: 'formFieldChanged',
      sectionId,
      fieldIndex,
      oldValue,
      newValue,
      timestamp: Date.now(),
    }

    await mockSignalRHub.sendEvent(event)
  }

  /**
   * Sends a "user blurred field X with value Y" event to the mock backend.
   * The backend validates the value, updates the field if valid, advances
   * `activeFieldId` to the next field, and pushes back the updated form state.
   */
  const requestFocusChange = async (
    sectionId: string,
    fieldIndex: number,
    currentValue: unknown,
  ): Promise<void> => {
    if (!isConnected.value) throw new Error('Not connected')

    const event: FormFocusChangedEvent = {
      type: 'formFocusChanged',
      sectionId,
      fieldIndex,
      currentValue,
      timestamp: Date.now(),
    }

    await mockSignalRHub.sendEvent(event)
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    form,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    sendFieldChange,
    requestFocusChange,
    clearError,
  }
})
