import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DateTime from './DateTime.vue'
import { expect, userEvent, within } from 'storybook/test'

const meta = {
  component: DateTime,
  title: 'Form/DateTime',
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DateTime>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default date picker with no initial date selected. Click the field to open the picker.
 */
export const Default: Story = {
  render: (args) => ({
    components: { DateTime },
    setup() {
      return { args }
    },
    template: '<DateTime v-bind="args" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox') ?? canvasElement.querySelector('input')
    await userEvent.click(input as HTMLElement)
    const grid = canvas.queryByRole('grid') ?? canvasElement.querySelector('[role="grid"]')
    expect(grid).toBeInTheDocument()
    const cells = grid
      ? Array.from(grid.querySelectorAll('[role="gridcell"]'))
      : canvas.getAllByRole('gridcell')
    const firstSelectable = cells.find((el) => el.getAttribute('aria-disabled') !== 'true')
    if (firstSelectable) {
      await userEvent.click(firstSelectable as HTMLElement)
    }
  },
  args: {
    initialValue: { year: 2025, month: 2, day: 3, hour: 10, minute: 30, second: 0 },
  },
}

/**
 * Date picker interaction: navigate month and select a date.
 */
export const SelectDate: Story = {
  render: (args) => ({
    components: { DateTime },
    setup() {
      return { args }
    },
    template: '<DateTime v-bind="args" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox') ?? canvasElement.querySelector('input')
    await userEvent.click(input as HTMLElement)
    const grid = canvas.queryByRole('grid') ?? canvasElement.querySelector('[role="grid"]')
    expect(grid).toBeInTheDocument()
    // Optional: click next month button if present
    const buttons = canvas.getAllByRole('button')
    const nextButton = buttons.find((b) =>
      /next|forward|right/i.test(b.getAttribute('aria-label') ?? ''),
    )
    if (nextButton) {
      await userEvent.click(nextButton as HTMLElement)
    }
    const cells = grid
      ? Array.from(grid.querySelectorAll('[role="gridcell"]'))
      : canvas.getAllByRole('gridcell')
    const selectable = cells.find((el) => el.getAttribute('aria-disabled') !== 'true')
    if (selectable) {
      await userEvent.click(selectable as HTMLElement)
    }
  },
  args: {
    placeholder: '',
    initialValue: { year: 2025, month: 2, day: 3, hour: 10, minute: 30, second: 0 },
  },
}
