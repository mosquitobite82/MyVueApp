import type { Form, Section } from '@/types/form'

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
          sections: [
            {
              name: 'Address',
              formId: 'personal-basic-address',
              sections: [],
              buttons: [],
              fields: [
                {
                  type: 'text',
                  label: { name: 'Street', position: 'side' },
                  value: 'Ågatan 24 C',
                },
                {
                  type: 'text',
                  label: { name: 'City', position: 'side' },
                  value: 'Söderköping',
                },
                {
                  type: 'text',
                  label: { name: 'Postcode', position: 'side' },
                  value: '61434',
                },
              ],
            },
          ],
          buttons: [],
          fields: [
            {
              type: 'text',
              label: { name: 'First Name', position: 'side' },
              value: 'Johannes',
            },
            {
              type: 'text',
              label: { name: 'Last Name', position: 'side' },
              value: 'Lindgren',
            },
            {
              type: 'number',
              label: { name: 'Age', position: 'side' },
              value: 43,
            },
            {
              type: 'checkbox',
              label: { name: 'Subscribe to newsletter', position: 'side' },
              value: false,
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
              value: 'johannes.lindgren@im.se',
            },
            {
              type: 'select',
              label: { name: 'Country', position: 'side' },
              items: [
                { label: 'Sweden', value: 'se' },
                { label: 'United Kingdom', value: 'uk' },
                { label: 'Denmark', value: 'dk' },
                { label: 'Norway', value: 'no' },
              ],
              value: { label: 'Sweden', value: 'se' },
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
          sections: [
            {
              name: 'Recurrence',
              formId: 'schedule-recurrence',
              sections: [],
              buttons: [],
              fields: [
                {
                  type: 'checkbox',
                  label: { name: 'Repeat', position: 'side' },
                  value: false,
                },
                {
                  type: 'select',
                  label: { name: 'Frequency', position: 'side' },
                  items: [
                    { label: 'Daily', value: 'daily' },
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Monthly', value: 'monthly' },
                  ],
                  value: { label: 'Weekly', value: 'weekly' },
                },
              ],
            },
          ],
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
function findSection(sections: Section[], sectionId: string): Section | undefined {
  for (const section of sections) {
    if (section.formId === sectionId) return section
    const nested = findSection(section.sections, sectionId)
    if (nested) return nested
  }
  return undefined
}

export function applyFormFieldChange(
  sectionId: string,
  fieldIndex: number,
  newValue: unknown,
): Form {
  const updated: Form = JSON.parse(JSON.stringify(currentFormState))

  for (const win of updated.windows) {
    const section = findSection(win.sections, sectionId)
    if (!section) continue

    const field = section.fields[fieldIndex]
    if (!field) continue

    if ((field.type === 'text' || field.type === 'textarea') && typeof newValue === 'string') {
      field.value = newValue
    } else if (field.type === 'number' && typeof newValue === 'number') {
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
