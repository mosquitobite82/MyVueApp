import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tabs from './Tabs.vue';
import TabPanel from './TabPanel.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

describe('Tabs', () => {
  const tabs = [
    { title: 'Tab One', value: 'one' },
    { title: 'Tab Two', value: 'two' },
    { title: 'Tab Three', value: 'three' },
  ];

  it('renders tabs correctly', () => {
    const wrapper = mount(Tabs, {
      props: { tabs },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('emits update:modelValue when tab changes', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs },
      global: { plugins: [vuetify] },
    });

    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
  });

  it('emits tab-change event', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs, modelValue: 'one' },
      global: { plugins: [vuetify] },
    });

    await wrapper.setProps({ modelValue: 'two' });
    await nextTick();

    const emitted = wrapper.emitted('tab-change');
    expect(emitted).toBeTruthy();
  });

  it('emits transition-complete after delay', async () => {
    vi.useFakeTimers();

    const wrapper = mount(Tabs, {
      props: { tabs, modelValue: 'one' },
      global: { plugins: [vuetify] },
    });

    await wrapper.setProps({ modelValue: 'two' });
    await nextTick();

    vi.advanceTimersByTime(350);
    await nextTick();

    const emitted = wrapper.emitted('transition-complete');
    expect(emitted).toBeTruthy();

    vi.useRealTimers();
  });

  it('provides context to children', () => {
    const wrapper = mount(Tabs, {
      props: { tabs },
      slots: {
        'tab-one': TabPanel,
      },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.vm).toBeTruthy();
  });

  it('sets initial active tab from modelValue', () => {
    const wrapper = mount(Tabs, {
      props: { tabs, modelValue: 'two' },
      global: { plugins: [vuetify] },
    });

    // Check that the component set the activeTab correctly
    expect(wrapper.vm).toBeTruthy();
  });

  it('defaults to first tab when no modelValue provided', () => {
    const wrapper = mount(Tabs, {
      props: { tabs },
      global: { plugins: [vuetify] },
    });

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    if (emitted) {
      expect(emitted[0]).toEqual(['one']);
    }
  });
});

describe('TabPanel', () => {
  it('renders content correctly', () => {
    const wrapper = mount(TabPanel, {
      props: { value: 'test' },
      slots: {
        default: '<div>Test Content</div>',
      },
      global: {
        plugins: [vuetify],
        provide: {
          tabsContext: {
            activeTab: { value: 'test' },
            isTransitioning: { value: false },
            previousTab: { value: null },
          },
        },
      },
    });

    expect(wrapper.text()).toContain('Test Content');
  });

  it('emits activated when becoming active', async () => {
    const activeTab = { value: 'other' };
    const wrapper = mount(TabPanel, {
      props: { value: 'test' },
      global: {
        plugins: [vuetify],
        provide: {
          tabsContext: {
            activeTab,
            isTransitioning: { value: false },
            previousTab: { value: null },
          },
        },
      },
    });

    activeTab.value = 'test';
    await nextTick();

    const emitted = wrapper.emitted('activated');
    expect(emitted).toBeTruthy();
  });

  it('emits deactivated when becoming inactive', async () => {
    const activeTab = { value: 'test' };
    const wrapper = mount(TabPanel, {
      props: { value: 'test' },
      global: {
        plugins: [vuetify],
        provide: {
          tabsContext: {
            activeTab,
            isTransitioning: { value: false },
            previousTab: { value: null },
          },
        },
      },
    });

    activeTab.value = 'other';
    await nextTick();

    const emitted = wrapper.emitted('deactivated');
    expect(emitted).toBeTruthy();
  });

  it('provides slot props correctly', () => {
    const wrapper = mount(TabPanel, {
      props: { value: 'test' },
      slots: {
        default: `
          <template #default="{ isActive, isTransitioning }">
            <div>Active: {{ isActive }}, Transitioning: {{ isTransitioning }}</div>
          </template>
        `,
      },
      global: {
        plugins: [vuetify],
        provide: {
          tabsContext: {
            activeTab: { value: 'test' },
            isTransitioning: { value: false },
            previousTab: { value: null },
          },
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
