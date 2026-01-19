import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ClickableWithMenu from './ClickableWithMenu.vue'

const vuetify = createVuetify({
  components,
  directives,
})

describe('ClickableWithMenu', () => {
  const mountWithVuetify = (options = {}) => {
    return mount(ClickableWithMenu, {
      global: {
        plugins: [vuetify],
      },
      ...options,
    })
  }

  it('renders the slotted content', () => {
    const wrapper = mountWithVuetify({
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
      props: {
        menuItems: [],
      },
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Content')
  })

  it('makes the wrapped content clickable', async () => {
    const wrapper = mountWithVuetify({
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
      props: {
        menuItems: [{ title: 'Item 1', value: 'item1' }],
      },
    })

    const activator = wrapper.find('[data-test="clickable-activator"]')
    expect(activator.exists()).toBe(true)
  })

  it('opens menu when clicked', async () => {
    const wrapper = mountWithVuetify({
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
      props: {
        menuItems: [
          { title: 'Item 1', value: 'item1' },
          { title: 'Item 2', value: 'item2' },
        ],
      },
    })

    const activator = wrapper.find('[data-test="clickable-activator"]')
    await activator.trigger('click')

    // The menu should be rendered after clicking
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuOpen).toBe(true)
  })

  it('emits menu-item-click event when menu item is selected', async () => {
    const wrapper = mountWithVuetify({
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
      props: {
        menuItems: [
          { title: 'Item 1', value: 'item1' },
          { title: 'Item 2', value: 'item2' },
        ],
      },
    })

    // Simulate menu item click
    await wrapper.vm.handleMenuItemClick({ title: 'Item 1', value: 'item1' })

    expect(wrapper.emitted('menu-item-click')).toBeTruthy()
    expect(wrapper.emitted('menu-item-click')?.[0]).toEqual([{ title: 'Item 1', value: 'item1' }])
  })

  it('closes menu after item is selected', async () => {
    const wrapper = mountWithVuetify({
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
      props: {
        menuItems: [{ title: 'Item 1', value: 'item1' }],
      },
    })

    // Open menu
    wrapper.vm.isMenuOpen = true
    await wrapper.vm.$nextTick()

    // Click menu item
    await wrapper.vm.handleMenuItemClick({ title: 'Item 1', value: 'item1' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuOpen).toBe(false)
  })

  it('accepts custom menu items with different properties', async () => {
    const menuItems = [
      { title: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { title: 'Delete', value: 'delete', icon: 'mdi-delete', color: 'error' },
      { title: 'Share', value: 'share', icon: 'mdi-share', disabled: true },
    ]

    const wrapper = mountWithVuetify({
      slots: {
        default: '<div>Test</div>',
      },
      props: {
        menuItems,
      },
    })

    expect(wrapper.props('menuItems')).toEqual(menuItems)
  })

  it('allows disabling menu items', async () => {
    const wrapper = mountWithVuetify({
      slots: {
        default: '<div>Test</div>',
      },
      props: {
        menuItems: [
          { title: 'Enabled', value: 'enabled', disabled: false },
          { title: 'Disabled', value: 'disabled', disabled: true },
        ],
      },
    })

    expect(wrapper?.props('menuItems')?.[1]?.disabled).toBe(true)
  })

  it('supports custom activator cursor style', async () => {
    const wrapper = mountWithVuetify({
      slots: {
        default: '<div>Test</div>',
      },
      props: {
        menuItems: [{ title: 'Item', value: 'item' }],
      },
    })

    const activator = wrapper.find('[data-test="clickable-activator"]')
    expect(activator.attributes('style')).toContain('cursor: pointer')
  })
})
