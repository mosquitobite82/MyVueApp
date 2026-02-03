import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TextInput from './TextInput.vue'
import { action } from 'storybook/actions';
import { userEvent, within } from 'storybook/test';

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'Hello', { delay: 100 });
    await userEvent.click(canvas.getByRole('textbox'));
    await userEvent.click(canvas.getByRole('textbox'));
  },
  args: {
    inputId: 'inputId',
    inputValue: 'Tjo',
    label: 'label',
    placeholder: 'placeholder',
    disabled: false,
    errorMessages: [],
    rules: [],
    onFocus: action('focus'),
    onBlur: action('blur'),
    style: 'width: 300px;',
  },
}
