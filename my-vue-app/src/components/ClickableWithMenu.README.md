# ClickableWithMenu Component

A reusable Vue 3 component that wraps any content to make it clickable and display a Vuetify menu when clicked.

## Features

- ✨ Wraps any component or HTML content using slots
- 🎯 Provides a clean, accessible click interaction
- 🎨 Uses Vuetify's `v-menu` for consistent UI
- 📱 Fully responsive and mobile-friendly
- ♿ Keyboard accessible
- 🎭 Supports custom menu items with icons, colors, and disabled states
- 🧪 Fully tested with Vitest

## Installation

The component is already part of your project. Simply import it:

```typescript
import ClickableWithMenu from './components/ClickableWithMenu.vue'
import type { MenuItem } from './components/ClickableWithMenu.vue'
```

## Basic Usage

```vue
<script setup lang="ts">
import ClickableWithMenu from './components/ClickableWithMenu.vue'
import type { MenuItem } from './components/ClickableWithMenu.vue'

const menuItems: MenuItem[] = [
  { title: 'Edit', value: 'edit', icon: 'mdi-pencil' },
  { title: 'Delete', value: 'delete', icon: 'mdi-delete', color: 'error' },
]

const handleMenuClick = (item: MenuItem) => {
  console.log('Menu item clicked:', item.value)
}
</script>

<template>
  <ClickableWithMenu
    :menu-items="menuItems"
    @menu-item-click="handleMenuClick"
  >
    <v-card>
      <v-card-title>Click Me!</v-card-title>
      <v-card-text>Click anywhere on this card to see the menu</v-card-text>
    </v-card>
  </ClickableWithMenu>
</template>
```

## Props

### `menuItems` (required)

An array of menu item objects. Each menu item has the following structure:

```typescript
interface MenuItem {
  title: string      // Display text for the menu item
  value: string      // Unique identifier for the menu item
  icon?: string      // Optional Material Design Icon (e.g., 'mdi-pencil')
  color?: string     // Optional Vuetify color (e.g., 'error', 'primary')
  disabled?: boolean // Whether the menu item is disabled
}
```

## Events

### `menu-item-click`

Emitted when a menu item is clicked. Receives the clicked `MenuItem` object as payload.

```vue
<ClickableWithMenu
  :menu-items="menuItems"
  @menu-item-click="(item) => console.log(item)"
>
  <!-- Your content -->
</ClickableWithMenu>
```

## Examples

### Card with Context Menu

```vue
<ClickableWithMenu
  :menu-items="[
    { title: 'Edit', value: 'edit', icon: 'mdi-pencil' },
    { title: 'Share', value: 'share', icon: 'mdi-share' },
    { title: 'Delete', value: 'delete', icon: 'mdi-delete', color: 'error' },
  ]"
  @menu-item-click="handleAction"
>
  <v-card>
    <v-card-title>Product Card</v-card-title>
    <v-card-text>Click for options</v-card-text>
  </v-card>
</ClickableWithMenu>
```

### Avatar with Context Menu

```vue
<ClickableWithMenu
  :menu-items="[
    { title: 'View Profile', value: 'view', icon: 'mdi-account' },
    { title: 'Change Picture', value: 'change', icon: 'mdi-camera' },
    { title: 'Remove', value: 'remove', icon: 'mdi-delete', color: 'error' },
  ]"
  @menu-item-click="handleAvatarAction"
>
  <v-avatar size="80" color="primary">
    <v-icon>mdi-account</v-icon>
  </v-avatar>
</ClickableWithMenu>
```

### Button with Context Menu

```vue
<ClickableWithMenu
  :menu-items="[
    { title: 'Save', value: 'save', icon: 'mdi-content-save' },
    { title: 'Export', value: 'export', icon: 'mdi-export' },
    { title: 'Print', value: 'print', icon: 'mdi-printer', disabled: true },
  ]"
  @menu-item-click="handleButtonAction"
>
  <v-btn color="primary">
    <v-icon start>mdi-menu</v-icon>
    Options
  </v-btn>
</ClickableWithMenu>
```

### Text with Disabled Items

```vue
<ClickableWithMenu
  :menu-items="[
    { title: 'Copy', value: 'copy', icon: 'mdi-content-copy' },
    { title: 'Cut', value: 'cut', icon: 'mdi-content-cut' },
    { title: 'Paste', value: 'paste', icon: 'mdi-content-paste', disabled: true },
  ]"
  @menu-item-click="handleTextAction"
>
  <v-chip>
    Click for text actions
  </v-chip>
</ClickableWithMenu>
```

## Best Practices

### 1. Keep Components Composable

The `ClickableWithMenu` component follows Vue best practices by being:
- **Small and focused**: Does one thing well - adds a menu to clickable content
- **Composable**: Can wrap any content via slots
- **Reusable**: Works with any Vuetify components or HTML

### 2. Separate Side Effects

The component itself is pure - it doesn't perform actions, it just emits events:

```vue
<script setup lang="ts">
// Good: Handler function manages side effects
const handleMenuClick = async (item: MenuItem) => {
  if (item.value === 'delete') {
    await deleteItem()
    showNotification('Item deleted')
  }
}
</script>

<template>
  <ClickableWithMenu
    :menu-items="items"
    @menu-item-click="handleMenuClick"
  >
    <!-- Content -->
  </ClickableWithMenu>
</template>
```

### 3. Type Safety

Always use TypeScript types for better developer experience:

```typescript
import type { MenuItem } from './components/ClickableWithMenu.vue'

const menuItems: MenuItem[] = [
  // TypeScript will ensure correct structure
  { title: 'Edit', value: 'edit' },
]
```

## Testing

The component comes with comprehensive tests. Run them with:

```bash
npm run test:unit -- src/components/__tests__/ClickableWithMenu.spec.ts
```

Tests cover:
- ✅ Rendering slotted content
- ✅ Clickable activator
- ✅ Menu opening/closing
- ✅ Event emission
- ✅ Disabled items
- ✅ Custom properties (icons, colors)

## Accessibility

The component is built on Vuetify's `v-menu`, which provides:
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support
- Focus management
- ARIA attributes

## Browser Support

Works in all modern browsers that support:
- Vue 3
- Vuetify 3
- ES2020+

## License

Part of your Vue.js project.



