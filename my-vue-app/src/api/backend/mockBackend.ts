import type { Form } from '@/types/form'

/** Initial seed — treated as immutable. The live backend state lives in `currentFormState`. */
const initialFormState: Form = {
  isConnected: true,
  isLoading: false,
  error: null,
  lastUpdate: null,
  windows: [
    {
      name: 'Personal Information',
      sections: [
        {
          name: 'Basic Details',
          formId: 'personal-basic',
          sections: [],
          buttons: [],
          fields: [
            {
              type: 'text',
              label: { name: 'First Name', position: 'side' },
              value: 'Jane',
            },
            {
              type: 'text',
              label: { name: 'Last Name', position: 'side' },
              value: 'Smith',
            },
            {
              type: 'number',
              label: { name: 'Age', position: 'side' },
              value: 34,
            },
            {
              type: 'checkbox',
              label: { name: 'Subscribe to newsletter', position: 'side' },
              value: true,
            },
          ],
        },
        {
          name: 'Contact',
          formId: 'personal-contact',
          sections: [],
          buttons: [],
          fields: [
            {
              type: 'text',
              label: { name: 'Email', position: 'side' },
              value: 'jane.smith@example.com',
            },
            {
              type: 'select',
              label: { name: 'Country', position: 'side' },
              items: [
                { label: 'United States', value: 'us' },
                { label: 'United Kingdom', value: 'uk' },
                { label: 'Canada', value: 'ca' },
                { label: 'Australia', value: 'au' },
              ],
              value: { label: 'United Kingdom', value: 'uk' },
            },
            {
              type: 'textarea',
              label: { name: 'Notes', position: 'top' },
              value: 'Prefers morning appointments.',
            },
          ],
        },
      ],
    },
    {
      name: 'Schedule',
      sections: [
        {
          name: 'Appointment',
          formId: 'schedule-appointment',
          sections: [],
          buttons: [],
          fields: [
            {
              type: 'datetime',
              label: { name: 'Start Date & Time', position: 'side' },
              value: '2026-03-10 09:00',
            },
            {
              type: 'radio',
              label: { name: 'Priority', position: 'top' },
              items: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ],
              value: { label: 'Medium', value: 'medium' },
            },
          ],
        },
      ],
    },
  ],
}

/** Mutable backend state — updated by applyFormFieldChange. */
let currentFormState: Form = JSON.parse(JSON.stringify(initialFormState))

/** Returns the current form state (what the backend would send on connect). */
export const mockFormState = (): Form => currentFormState

/**
 * Simulates the backend applying a field change.
 * Mutates the internal state and returns the new snapshot.
 */
export function applyFormFieldChange(
  sectionId: string,
  fieldIndex: number,
  newValue: unknown,
): Form {
  const updated: Form = JSON.parse(JSON.stringify(currentFormState))

  for (const win of updated.windows) {
    const section = win.sections.find((s) => s.formId === sectionId)
    if (!section) continue

    const field = section.fields[fieldIndex]
    if (!field) continue

    if ((field.type === 'text' || field.type === 'textarea') && typeof newValue === 'string') {
      field.value = newValue
    } else if (field.type === 'checkbox' && typeof newValue === 'boolean') {
      field.value = newValue
    } else if (field.type === 'datetime' && typeof newValue === 'string') {
      field.value = newValue
    } else if (
      (field.type === 'select' || field.type === 'radio') &&
      typeof newValue === 'object' &&
      newValue !== null &&
      'label' in newValue &&
      'value' in newValue
    ) {
      field.value = newValue as { label: string; value: string | number | boolean }
    }
    break
  }

  updated.lastUpdate = Date.now()
  currentFormState = updated
  return currentFormState
}
