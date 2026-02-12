# Tabs Component

A wrapper around Vuetify's `v-tabs` that provides transition notifications to child components.

## Features

- ✅ Built on Vuetify 3 tabs
- ✅ **Directional slide transitions** - automatically slides left/right based on forward/backward navigation
- ✅ Notifies children when tabs become active/inactive
- ✅ Tracks transition completion with direction awareness
- ✅ Provides both component and composable APIs
- ✅ Full v-model support
- ✅ TypeScript support

## Usage

### Basic Usage

```vue
<template>
  <Tabs :tabs="tabs">
    <template #tab-one>
      <TabPanel 
        value="one"
        @activated="onActivated"
        @transition-complete="onTransitionComplete"
      >
        <div>Tab One Content</div>
      </TabPanel>
    </template>
    
    <template #tab-two>
      <TabPanel value="two">
        <div>Tab Two Content</div>
      </TabPanel>
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import Tabs from '@/components/Tabs/Tabs.vue';
import TabPanel from '@/components/Tabs/TabPanel.vue';

const tabs = [
  { title: 'Tab One', value: 'one' },
  { title: 'Tab Two', value: 'two' },
];

function onActivated() {
  console.log('Tab activated!');
}

function onTransitionComplete() {
  console.log('Transition finished!');
}
</script>
```

### Using the Composable

For more control, use the `useTabPanel` composable directly in your child components:

```vue
<template>
  <div>
    <p v-if="isActive">I'm the active tab!</p>
    <p v-if="isTransitioning">Transitioning...</p>
  </div>
</template>

<script setup lang="ts">
import { useTabPanel } from '@/components/Tabs/useTabPanel';

const { isActive, isTransitioning } = useTabPanel({
  value: 'my-tab',
  onActivated: () => {
    console.log('Tab became active');
  },
  onDeactivated: () => {
    console.log('Tab became inactive');
  },
  onTransitionStart: () => {
    console.log('Transition started');
  },
  onTransitionComplete: () => {
    console.log('Transition completed');
  },
});
</script>
```

### Controlled Tabs (v-model)

```vue
<template>
  <Tabs :tabs="tabs" v-model="currentTab">
    <template #tab-one>
      <div>Content One</div>
    </template>
    <template #tab-two>
      <div>Content Two</div>
    </template>
  </Tabs>
  
  <button @click="currentTab = 'two'">Go to Tab Two</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tabs from '@/components/Tabs/Tabs.vue';

const tabs = [
  { title: 'Tab One', value: 'one' },
  { title: 'Tab Two', value: 'two' },
];
const currentTab = ref('one');
</script>
```

## API

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | **required** | Array of tab definitions |
| `modelValue` | `string` | first tab | Currently active tab value |

### Tabs Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when active tab changes |
| `tab-change` | `string, 'forward' \| 'backward'` | Emitted when tab change starts with direction |
| `transition-complete` | `string` | Emitted when transition finishes |

### Tabs Slots

| Slot | Props | Description |
|------|-------|-------------|
| `tab-{value}` | `{ isActive: boolean }` | Content for each tab |

### TabPanel Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | The tab value this panel represents |

### TabPanel Events

| Event | Description |
|-------|-------------|
| `activated` | Fired when this tab becomes active |
| `deactivated` | Fired when this tab becomes inactive |
| `transition-start` | Fired when transition starts (for active or previous tab) |
| `transition-complete` | Fired when transition completes (for active tab) |

### TabPanel Slots

| Slot | Props | Description |
|------|-------|-------------|
| default | `{ isActive: boolean, isTransitioning: boolean, wasPrevious: boolean }` | Panel content |

### useTabPanel Options

```typescript
interface UseTabPanelOptions {
  value: string;                     // Required: tab value
  onActivated?: () => void;          // Called when tab becomes active
  onDeactivated?: () => void;        // Called when tab becomes inactive
  onTransitionStart?: () => void;    // Called when transition starts
  onTransitionComplete?: () => void; // Called when transition completes
}
```

### useTabPanel Return

```typescript
{
  isActive: ComputedRef<boolean>;        // Whether this tab is active
  isTransitioning: ComputedRef<boolean>; // Whether transition is in progress
  wasPrevious: ComputedRef<boolean>;     // Whether this was the previous tab
}
```

## Type Definitions

```typescript
interface Tab {
  title: string;  // Display title
  value: string;  // Unique identifier
}
```

## Examples

### Lazy Loading Tab Content

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useTabPanel } from '@/components/Tabs/useTabPanel';

const loaded = ref(false);

useTabPanel({
  value: 'heavy-content',
  onActivated: () => {
    if (!loaded.value) {
      // Load data only when tab is first activated
      loadData();
      loaded.value = true;
    }
  },
});
</script>
```

### Directional Slide Transitions

The component uses Vuetify's built-in `v-tabs-window` which automatically provides smooth horizontal slide transitions:
- Moving forward (tab 1 → 2): slides from right to left
- Moving backward (tab 2 → 1): slides from left to right

This is Vuetify's native behavior and provides the best performance and smoothest animations.

### Custom Vuetify Tab Props

The `Tabs` component passes through all attributes to the underlying `v-tabs`:

```vue
<template>
  <Tabs 
    :tabs="tabs" 
    color="primary"
    bg-color="grey-lighten-4"
    grow
    stacked
  >
    <!-- tabs content -->
  </Tabs>
</template>
```

## How Directional Transitions Work

Vuetify's `v-tabs-window` component automatically handles directional sliding:

1. **Moving Forward** (e.g., Tab 1 → Tab 2 → Tab 3)
   - Content slides from right to left
   - Natural flow matching reading direction

2. **Moving Backward** (e.g., Tab 3 → Tab 2 → Tab 1)
   - Content slides from left to right
   - Reverses the animation smoothly

The component tracks the direction by comparing tab indices and emits this information in the `tab-change` event, which child components can use to perform direction-aware actions.

## Notes

- Transition duration is assumed to be 300ms (Vuetify default)
- The `tabsContext` is provided via Vue's provide/inject API
- All child components must be descendants of the `Tabs` component to receive notifications
- Tab values must be unique within a single `Tabs` instance
- Direction is calculated based on tab order in the `tabs` array, not visual position
