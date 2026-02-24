import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Form from './Form.vue'
import TextInput from './TextInput/TextInput.vue'
import { userEvent, within } from 'storybook/test'

const meta = {
  component: Form,
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { Form, TextInput },
    setup() {
      return { args }
    },
    // To pass children to slots, include them between the component tags
    template: `
      <Form v-bind="args">
        <TextInput
          input-id="name"
          input-value=""
          label="Name"
          placeholder="Enter your name"
          :disabled="false"
          :error-messages="[]"
          :rules="[]"
        />
        <TextInput
          input-id="password"
          input-value=""
          label="Password"
          placeholder="Enter your password"
          :disabled="false"
          :rules="[]"
        />
        <TextInput
          input-id="email"
          input-value=""
          label="Email"
          placeholder="Enter your email"
          :disabled="false"
          :rules="[(v) => !!v || 'This field is required']"
        />
      </Form>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textboxes = canvas.getAllByRole('textbox')

    const getActiveInput = () => {
      // Get the currently focused element
      const activeElement = document.activeElement

      if (!activeElement) {
        return null
      }

      // Find which textbox element contains or is the focused element
      const focusedTextbox = textboxes.find((textbox) => {
        // Check if the active element is the textbox itself
        if (textbox === activeElement || textbox.contains(activeElement)) {
          return true
        }
        // Check if the active element contains the textbox (for nested structures)
        if (activeElement.contains(textbox)) {
          return true
        }
        return false
      })

      if (!focusedTextbox) {
        return null
      }

      // For Vuetify components, the actual input might be nested
      // Try to find the actual input element within the textbox container
      const actualInput =
        focusedTextbox.querySelector('input') ||
        focusedTextbox.querySelector('textarea') ||
        (focusedTextbox.tagName === 'INPUT' || focusedTextbox.tagName === 'TEXTAREA'
          ? (focusedTextbox as HTMLInputElement | HTMLTextAreaElement)
          : null)

      return actualInput as HTMLInputElement | HTMLTextAreaElement | null
    }
    // Focus the first input
    await userEvent.click(textboxes[0] as HTMLElement)

    // Get the currently active/focused input element

    // Type in the currently focused input
    const activeInput = getActiveInput()
    if (activeInput) {
      await userEvent.type(activeInput, 'Hello', { delay: 100 })
    }

    // Tab to next input
    await userEvent.keyboard('{Tab}')

    // Get the newly focused input
    const activeInput2 = getActiveInput()
    if (activeInput2) {
      await userEvent.type(activeInput2, 'password', { delay: 100 })
    }

    // Tab to next input
    await userEvent.keyboard('{Tab}')

    // Get the newly focused input
    const activeInput3 = getActiveInput()
    if (activeInput3) {
      await userEvent.type(activeInput3, 'test@example.com', { delay: 100 })
    }

    // Example: Log the currently focused element's ID or value
    const currentFocused = getActiveInput()
    if (currentFocused) {
      console.log('Currently focused input:', {
        id: currentFocused.id,
        value: currentFocused.value,
        name: currentFocused.name,
      })
    }
  },
  args: {
    menu: {
      buttons: [],
    },
    sections: [
      {
        fields: [],
      },
    ],
    tabs: [
      {
        fields: [],
      },
    ],
  },
}
