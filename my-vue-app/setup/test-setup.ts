import { beforeAll } from 'vitest'

beforeAll(() => {
  // Mock visualViewport for Vuetify overlay components
  Object.defineProperty(window, 'visualViewport', {
    writable: true,
    value: {
      width: 1024,
      height: 768,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      addEventListener: () => {},
      removeEventListener: () => {},
    },
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    root: Element | null = null
    rootMargin: string = '0px'
    thresholds: ReadonlyArray<number> = [0]

    constructor(
      public callback: IntersectionObserverCallback,
      public options?: IntersectionObserverInit,
    ) {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return []
    }
    unobserve() {}
  } as typeof IntersectionObserver

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }
})
