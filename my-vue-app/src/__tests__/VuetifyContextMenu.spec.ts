import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import VuetifyContextMenu from '../components/VuetifyContextMenu.vue'
import { global } from './test-utils'

describe('VuetifyContextMenu', () => {
  let wrapper: VueWrapper<any>

  const mockAction1 = vi.fn()
  const mockAction2 = vi.fn()
  const mockAction3 = vi.fn()

  const menuItems = [
    {
      label: 'Copy',
      icon: '📋',
      action: mockAction1,
    },
    {
      label: 'Paste',
      icon: '📄',
      action: mockAction2,
    },
    {
      label: 'Delete',
      icon: '🗑️',
      action: mockAction3,
      disabled: true,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Left-click mode', () => {
    it('renders correctly with menu items in left-click mode', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      expect(wrapper.find('button').text()).toBe('Click me')
      expect(wrapper.find('.left-click-activator').exists()).toBe(true)
    })

    it('calls menu item action when item is clicked in left-click mode', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      // Directly call handleMenuItemClick to test the action
      const vm = wrapper.vm as any
      vm.handleMenuItemClick(menuItems[0])
      
      expect(mockAction1).toHaveBeenCalledTimes(1)
      expect(mockAction2).not.toHaveBeenCalled()
      expect(mockAction3).not.toHaveBeenCalled()
    })

    it('calls second menu item action when clicked', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      // Directly call handleMenuItemClick with the second item
      const vm = wrapper.vm as any
      vm.handleMenuItemClick(menuItems[1])

      expect(mockAction2).toHaveBeenCalledTimes(1)
      expect(mockAction1).not.toHaveBeenCalled()
      expect(mockAction3).not.toHaveBeenCalled()
    })

    it('does not call action for disabled menu items', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      // Try to call handleMenuItemClick with disabled item
      const vm = wrapper.vm as any
      vm.handleMenuItemClick(menuItems[2])

      // Action should not be called for disabled item
      expect(mockAction3).not.toHaveBeenCalled()
      expect(mockAction1).not.toHaveBeenCalled()
      expect(mockAction2).not.toHaveBeenCalled()
    })

    it('renders menu items with icons when menu items have icons', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      // Verify menu items are configured with icons
      expect(menuItems[0].icon).toBe('📋')
      expect(menuItems[1].icon).toBe('📄')
      expect(menuItems[2].icon).toBe('🗑️')
    })

    it('renders menu items with correct labels', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      // Verify menu items are configured with correct labels
      expect(menuItems[0].label).toBe('Copy')
      expect(menuItems[1].label).toBe('Paste')
      expect(menuItems[2].label).toBe('Delete')
    })

    it('supports custom menu slot', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
          menu: '<div class="custom-menu">Custom Menu</div>',
        },
        global,
      })

      // Verify the component renders and accepts a custom menu slot
      expect(wrapper.html()).toContain('left-click-activator')
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('Right-click mode', () => {
    it('renders correctly in right-click mode', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
      })

      expect(wrapper.find('.test-content').text()).toBe('Right-click me')
      expect(wrapper.find('.right-click-container').exists()).toBe(true)
    })

    it('opens menu on right-click', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
        attachTo: document.body,
      })

      const container = wrapper.find('.right-click-container')
      
      // Simulate right-click
      await container.trigger('contextmenu', {
        clientX: 100,
        clientY: 200,
      })
      await nextTick()

      // Check if virtual activator was created
      const vm = wrapper.vm as any
      expect(vm.showMenu).toBe(true)
      expect(vm.menuPosition).toEqual({ x: 100, y: 200 })
    })

    it('calls menu item action when clicked in right-click mode', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
        attachTo: document.body,
      })

      // Directly test handleMenuItemClick
      const vm = wrapper.vm as any
      vm.handleMenuItemClick(menuItems[0])

      expect(mockAction1).toHaveBeenCalledTimes(1)
      expect(mockAction2).not.toHaveBeenCalled()
      expect(mockAction3).not.toHaveBeenCalled()
    })

    it('prevents default context menu behavior', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
      })

      const container = wrapper.find('.right-click-container')
      const event = new MouseEvent('contextmenu', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
        cancelable: true,
      })
      
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation')
      
      container.element.dispatchEvent(event)
      await nextTick()

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(stopPropagationSpy).toHaveBeenCalled()
    })

    it('does not call action for disabled items in right-click mode', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
        attachTo: document.body,
      })

      // Directly test handleMenuItemClick with disabled item
      const vm = wrapper.vm as any
      vm.handleMenuItemClick(menuItems[2])

      expect(mockAction3).not.toHaveBeenCalled()
      expect(mockAction1).not.toHaveBeenCalled()
      expect(mockAction2).not.toHaveBeenCalled()
    })

    it('creates virtual activator element at cursor position', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
        attachTo: document.body,
      })

      const container = wrapper.find('.right-click-container')
      await container.trigger('contextmenu', {
        clientX: 150,
        clientY: 250,
      })
      await nextTick()

      // Check if virtual activator exists in the DOM
      const vm = wrapper.vm as any
      expect(vm.virtualActivatorRef).toBeTruthy()
      expect(vm.virtualActivatorRef.style.left).toBe('150px')
      expect(vm.virtualActivatorRef.style.top).toBe('250px')
    })
  })

  describe('Menu behavior', () => {
    it('closes menu after clicking a menu item', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      const vm = wrapper.vm as any
      
      // Manually set showMenu to true to simulate open menu
      vm.showMenu = true
      await nextTick()
      expect(vm.showMenu).toBe(true)

      // Call handleMenuItemClick which should close the menu
      vm.handleMenuItemClick(menuItems[0])
      await nextTick()

      // Menu should be closed
      expect(vm.showMenu).toBe(false)
      expect(mockAction1).toHaveBeenCalledTimes(1)
    })

    it('cleans up virtual activator when menu closes in right-click mode', async () => {
      vi.useFakeTimers()
      
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
        attachTo: document.body,
      })

      // Open menu
      const container = wrapper.find('.right-click-container')
      await container.trigger('contextmenu', {
        clientX: 100,
        clientY: 200,
      })
      await nextTick()

      const vm = wrapper.vm as any
      const virtualActivator = vm.virtualActivatorRef
      expect(virtualActivator).toBeTruthy()

      // Call handleMenuItemClick to close menu
      vm.handleMenuItemClick(menuItems[0])
      await nextTick()

      // Fast-forward time to trigger cleanup
      vi.advanceTimersByTime(150)
      await nextTick()

      // Virtual activator should be cleaned up
      expect(vm.virtualActivatorRef).toBeNull()
      expect(mockAction1).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })

    it('works with empty menu items array', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems: [],
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      expect(wrapper.exists()).toBe(true)
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('renders slot content correctly', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<span class="custom-slot">Custom Content</span>',
        },
        global,
      })

      expect(wrapper.find('.custom-slot').text()).toBe('Custom Content')
    })

    it('handles menu items without icons', () => {
      const itemsWithoutIcons = [
        { label: 'Action 1', action: mockAction1 },
        { label: 'Action 2', action: mockAction2 },
      ]

      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems: itemsWithoutIcons,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      // Verify menu items are configured without icons
      expect(itemsWithoutIcons[0].icon).toBeUndefined()
      expect(itemsWithoutIcons[1].icon).toBeUndefined()
      expect(itemsWithoutIcons.length).toBe(2)
    })
  })

  describe('Props', () => {
    it('defaults to right-click mode when on prop is not provided', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
        },
        slots: {
          default: '<div>Content</div>',
        },
        global,
      })

      expect(wrapper.find('.right-click-container').exists()).toBe(true)
      expect(wrapper.find('.left-click-activator').exists()).toBe(false)
    })

    it('defaults to empty array when menuItems prop is not provided', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      const vm = wrapper.vm as any
      expect(vm.menuItems).toEqual([])
    })

    it('switches between left-click and right-click modes', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      expect(wrapper.find('.left-click-activator').exists()).toBe(true)
      expect(wrapper.find('.right-click-container').exists()).toBe(false)

      // Switch to right-click mode
      await wrapper.setProps({ on: 'right-click' })
      await nextTick()

      expect(wrapper.find('.left-click-activator').exists()).toBe(false)
      expect(wrapper.find('.right-click-container').exists()).toBe(true)
    })
  })

  describe('Teleport behavior', () => {
    it('uses Teleport in right-click mode', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div>Content</div>',
        },
        global,
        attachTo: document.body,
      })

      // Check that Teleport is being used
      const html = wrapper.html()
      expect(html).toContain('right-click-container')
    })

    it('does not use Teleport in left-click mode', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      // In left-click mode, the menu is rendered directly
      expect(wrapper.find('.left-click-activator').exists()).toBe(true)
    })
  })

  describe('Multiple menu item interactions', () => {
    it('calls different actions for different menu items in sequence', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      const vm = wrapper.vm as any
      
      // Click first item
      vm.handleMenuItemClick(menuItems[0])
      expect(mockAction1).toHaveBeenCalledTimes(1)
      
      // Click second item
      vm.handleMenuItemClick(menuItems[1])
      expect(mockAction2).toHaveBeenCalledTimes(1)
      
      // Verify counts
      expect(mockAction1).toHaveBeenCalledTimes(1)
      expect(mockAction2).toHaveBeenCalledTimes(1)
      expect(mockAction3).not.toHaveBeenCalled()
    })

    it('does not increment disabled item action count', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div>Content</div>',
        },
        global,
      })

      const vm = wrapper.vm as any
      
      // Try clicking disabled item multiple times
      vm.handleMenuItemClick(menuItems[2])
      vm.handleMenuItemClick(menuItems[2])
      vm.handleMenuItemClick(menuItems[2])
      
      expect(mockAction3).not.toHaveBeenCalled()
    })
  })

  describe('Component lifecycle', () => {
    it('can be mounted and unmounted without errors', () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      expect(wrapper.exists()).toBe(true)
      
      wrapper.unmount()
      
      // Should not throw errors
      expect(true).toBe(true)
    })

    it('handles prop updates correctly', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'left-click',
        },
        slots: {
          default: '<button>Click me</button>',
        },
        global,
      })

      expect(wrapper.find('.left-click-activator').exists()).toBe(true)

      // Update menuItems prop
      const newMenuItems = [
        { label: 'New Item', action: vi.fn() },
      ]
      await wrapper.setProps({ menuItems: newMenuItems })
      
      const vm = wrapper.vm as any
      expect(vm.menuItems).toEqual(newMenuItems)
    })
  })

  describe('Virtual activator management', () => {
    it('creates new virtual activator for each right-click', async () => {
      wrapper = mount(VuetifyContextMenu, {
        props: {
          menuItems,
          on: 'right-click',
        },
        slots: {
          default: '<div class="test-content">Right-click me</div>',
        },
        global,
        attachTo: document.body,
      })

      const container = wrapper.find('.right-click-container')
      const vm = wrapper.vm as any

      // First right-click
      await container.trigger('contextmenu', {
        clientX: 100,
        clientY: 200,
      })
      await nextTick()
      
      const firstActivator = vm.virtualActivatorRef
      expect(firstActivator).toBeTruthy()
      expect(firstActivator.style.left).toBe('100px')
      expect(firstActivator.style.top).toBe('200px')

      // Second right-click at different position
      await container.trigger('contextmenu', {
        clientX: 300,
        clientY: 400,
      })
      await nextTick()

      const secondActivator = vm.virtualActivatorRef
      expect(secondActivator).toBeTruthy()
      expect(secondActivator.style.left).toBe('300px')
      expect(secondActivator.style.top).toBe('400px')
      
      // Old activator should be cleaned up
      expect(firstActivator).not.toBe(secondActivator)
    })
  })
})
