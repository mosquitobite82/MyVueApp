# VuetifyContextMenu Component

A context menu component for Vue 3 built with **Vuetify 3**, providing both left-click dropdown and right-click context menu functionality.

## Features

✅ **Built with Vuetify 3** - Uses `v-menu` and `v-list` components  
✅ **Left-click or right-click modes** - Choose between dropdown or context menu behavior  
✅ **Material Design** - Follows Material Design principles via Vuetify  
✅ **Smart positioning** - Vuetify's built-in positioning handles viewport edges automatically  
✅ **Flexible API** - Use props or custom slots for menu items  
✅ **TypeScript support** - Fully typed with TypeScript  
✅ **Wraps child components** - Works with any content using Vue slots  
✅ **Icons support** - Use Material Design Icons or emoji  

## Prerequisites

This component requires **Vuetify 3** to be installed and configured in your project:

```bash
npm install vuetify @mdi/font
```

See [Vuetify 3 Installation Guide](https://vuetifyjs.com/en/getting-started/installation/) for setup instructions.

## Installation

The component is located in `src/components/VuetifyContextMenu.vue`. Import it in your components:

```vue
import VuetifyContextMenu from './components/VuetifyContextMenu.vue'
```

## Basic Usage

### Right-Click Context Menu (Default)

```vue
<script setup lang="ts">
import VuetifyContextMenu from './components/VuetifyContextMenu.vue'

const menuItems = [
  {
    label: 'Copy',
    icon: 'mdi-content-copy',
    action: () => console.log('Copy clicked')
  },
  {
    label: 'Paste',
    icon: 'mdi-content-paste',
    action: () => console.log('Paste clicked')
  },
  {
    label: 'Delete',
    icon: 'mdi-delete',
    action: () => console.log('Delete clicked'),
    disabled: true
  }
]
</script>

<template>
  <!-- Default: right-click mode -->
  <VuetifyContextMenu :menu-items="menuItems">
    <v-card>
      <v-card-text>Right-click me!</v-card-text>
    </v-card>
  </VuetifyContextMenu>
  
  <!-- Or explicitly specify -->
  <VuetifyContextMenu :menu-items="menuItems" on="right-click">
    <div>Right-click for context menu</div>
  </VuetifyContextMenu>
</template>
```

### Left-Click Dropdown Menu

```vue
<script setup lang="ts">
import VuetifyContextMenu from './components/VuetifyContextMenu.vue'

const menuItems = [
  {
    label: 'Profile',
    icon: 'mdi-account',
    action: () => console.log('Profile clicked')
  },
  {
    label: 'Settings',
    icon: 'mdi-cog',
    action: () => console.log('Settings clicked')
  },
  {
    label: 'Sign Out',
    icon: 'mdi-logout',
    action: () => console.log('Sign out clicked')
  }
]
</script>

<template>
  <!-- Left-click mode: shows as dropdown -->
  <VuetifyContextMenu :menu-items="menuItems" on="left-click">
    <v-btn color="primary" append-icon="mdi-chevron-down">
      Settings
    </v-btn>
  </VuetifyContextMenu>
</template>
```

## Custom Menu Content

### Using the Menu Slot

For full control over menu appearance, use the `menu` slot:

```vue
<template>
  <VuetifyContextMenu on="left-click">
    <v-btn color="primary">Options</v-btn>

    <template #menu="{ close }">
      <v-list density="compact">
        <v-list-subheader>ACTIONS</v-list-subheader>
        
        <v-list-item @click="handleAction('edit'); close()">
          <template v-slot:prepend>
            <v-icon>mdi-pencil</v-icon>
          </template>
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAction('share'); close()">
          <template v-slot:prepend>
            <v-icon>mdi-share</v-icon>
          </template>
          <v-list-item-title>Share</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="handleAction('delete'); close()">
          <template v-slot:prepend>
            <v-icon color="error">mdi-delete</v-icon>
          </template>
          <v-list-item-title class="text-error">Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </VuetifyContextMenu>
</template>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuItems` | `MenuItem[]` | `[]` | Array of menu items (optional if using custom slot) |
| `on` | `'left-click' \| 'right-click'` | `'right-click'` | Trigger mode: 'right-click' shows menu at cursor, 'left-click' shows as dropdown |

### MenuItem Interface

```typescript
interface MenuItem {
  label: string           // Text to display
  icon?: string          // MDI icon name (e.g., 'mdi-account') or emoji
  action: () => void     // Function to call when clicked
  disabled?: boolean     // Optional: disable the item
}
```

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| default | - | Wrapped content that will trigger the menu |
| menu | `{ close: () => void }` | Custom menu content (overrides `menuItems` prop) |

## Icons

The component supports two types of icons:

### Material Design Icons (Recommended)

Use MDI icon names with the `mdi-` prefix:

```typescript
const menuItems = [
  { label: 'Edit', icon: 'mdi-pencil', action: () => {} },
  { label: 'Delete', icon: 'mdi-delete', action: () => {} }
]
```

See all icons at: [Material Design Icons](https://pictogrammers.com/library/mdi/)

### Emoji Icons

You can also use emoji as icons:

```typescript
const menuItems = [
  { label: 'Copy', icon: '📋', action: () => {} },
  { label: 'Delete', icon: '🗑️', action: () => {} }
]
```

## Examples

### Example 1: User Profile Dropdown

```vue
<template>
  <VuetifyContextMenu on="left-click">
    <v-chip prepend-icon="mdi-account" append-icon="mdi-chevron-down">
      John Doe
    </v-chip>

    <template #menu="{ close }">
      <v-list min-width="250">
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar color="primary">JD</v-avatar>
          </template>
          <v-list-item-title>John Doe</v-list-item-title>
          <v-list-item-subtitle>john@example.com</v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="close()">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="close()">
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="close()">
          <template v-slot:prepend>
            <v-icon color="error">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-error">Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </VuetifyContextMenu>
</template>
```

### Example 2: Image Context Menu

```vue
<template>
  <VuetifyContextMenu :menu-items="imageMenuItems" on="right-click">
    <v-img
      src="photo.jpg"
      alt="Photo"
      width="300"
    ></v-img>
  </VuetifyContextMenu>
</template>

<script setup lang="ts">
const imageMenuItems = [
  { label: 'Download', icon: 'mdi-download', action: () => {} },
  { label: 'Share', icon: 'mdi-share', action: () => {} },
  { label: 'Set as Wallpaper', icon: 'mdi-image', action: () => {} },
  { label: 'Delete', icon: 'mdi-delete', action: () => {}, disabled: false }
]
</script>
```

### Example 3: Menu Bar with Dropdowns

```vue
<template>
  <v-toolbar>
    <VuetifyContextMenu on="left-click">
      <v-btn variant="text">File</v-btn>
      <template #menu="{ close }">
        <v-list density="compact">
          <v-list-item @click="close()">
            <template v-slot:prepend>
              <v-icon>mdi-file-plus</v-icon>
            </template>
            <v-list-item-title>New</v-list-item-title>
          </v-list-item>
          <v-list-item @click="close()">
            <template v-slot:prepend>
              <v-icon>mdi-folder-open</v-icon>
            </template>
            <v-list-item-title>Open</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </VuetifyContextMenu>

    <VuetifyContextMenu on="left-click">
      <v-btn variant="text">Edit</v-btn>
      <template #menu="{ close }">
        <v-list density="compact">
          <v-list-item @click="close()">
            <template v-slot:prepend>
              <v-icon>mdi-content-cut</v-icon>
            </template>
            <v-list-item-title>Cut</v-list-item-title>
          </v-list-item>
          <v-list-item @click="close()">
            <template v-slot:prepend>
              <v-icon>mdi-content-copy</v-icon>
            </template>
            <v-list-item-title>Copy</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </VuetifyContextMenu>
  </v-toolbar>
</template>
```

### Example 4: Card with Context Menu

```vue
<template>
  <VuetifyContextMenu :menu-items="cardMenuItems" on="right-click">
    <v-card>
      <v-img src="product.jpg" height="200"></v-img>
      <v-card-title>Product Name</v-card-title>
      <v-card-text>$29.99</v-card-text>
      <v-card-actions>
        <v-btn color="primary">Add to Cart</v-btn>
      </v-card-actions>
    </v-card>
  </VuetifyContextMenu>
</template>
```

## How It Works

### Right-Click Mode
- Creates a virtual DOM element at the cursor position
- Uses this as the activator for Vuetify's `v-menu`
- Vuetify handles smart positioning and viewport boundaries automatically
- Menu appears at cursor position and adjusts if near screen edges

### Left-Click Mode
- Uses standard Vuetify `v-menu` with activator slot
- The wrapped element acts as the menu trigger
- Click to open, click again to close (toggle behavior)
- Click outside to close
- Menu appears below the element by default

## Styling

The component uses Vuetify's theming system. You can customize appearance using Vuetify props:

```vue
<template>
  <VuetifyContextMenu on="left-click">
    <v-btn color="secondary">Options</v-btn>

    <template #menu="{ close }">
      <v-list density="comfortable" bg-color="surface-variant">
        <v-list-item @click="close()">
          <v-list-item-title>Option 1</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </VuetifyContextMenu>
</template>
```

## Comparison with Custom ContextMenu

| Feature | VuetifyContextMenu | Custom ContextMenu |
|---------|-------------------|-------------------|
| Framework | Vuetify 3 | Vanilla Vue 3 |
| Styling | Material Design | Custom CSS |
| Dependencies | Requires Vuetify | No dependencies |
| File Size | Smaller (uses Vuetify) | Larger (standalone) |
| Theming | Vuetify theme system | Custom CSS variables |
| Icons | MDI + Emoji | Emoji only |
| Positioning | Vuetify's smart positioning | Custom positioning logic |

## Best Practices

1. **Use MDI icons** for consistency with Material Design
2. **Keep menus focused** - Don't overload with too many options (5-8 items max)
3. **Group related items** - Use `v-divider` to separate groups
4. **Disable unavailable actions** - Use `disabled: true` for unavailable options
5. **Use appropriate colors** - Use `color="error"` for destructive actions
6. **Provide visual feedback** - Icons help users quickly identify actions

## Browser Compatibility

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ All modern browsers supporting Vue 3 and Vuetify 3  

## Related Links

- [Vuetify 3 Menu Component](https://vuetifyjs.com/en/components/menus/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)
- [Vuetify 3 Documentation](https://vuetifyjs.com/)

## License

Feel free to use and modify this component in your projects!

