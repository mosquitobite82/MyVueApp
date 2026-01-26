import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TextInput from './TextInput.vue'
import { fn } from 'storybook/test'

const meta = {
  component: TextInput,
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { TextInput },
    setup() {
      return { args }
    },
    template: '<TextInput v-bind="args" />',
  }),
  args: {
    inputId: 'inputId',
    inputValue: 'Tjo',
    label: 'label',
    placeholder: 'placeholder',
    disabled: false,
    errorMessages: [],
    rules: [],
    onFocus: fn(),
    onBlur: fn(),
  },
}
