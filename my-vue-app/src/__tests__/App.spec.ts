import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { global } from './test-utils'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, { global })
    expect(wrapper.text()).toContain('Vuetify ContextMenu')
  })
})
