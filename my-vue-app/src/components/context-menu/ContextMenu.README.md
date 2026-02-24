# ContextMenu Component

A flexible and customizable context menu component for Vue 3 that appears on right-click.

## Features

✅ **Wraps child components** - Works with any content using Vue slots  
✅ **Left-click or right-click modes** - Choose between dropdown or context menu behavior  
✅ **Prevents default browser context menu** - Right-click shows your custom menu  
✅ **Flexible API** - Use props or custom slots for menu items  
✅ **TypeScript support** - Fully typed with TypeScript  
✅ **Smart positioning** - Menu appears at cursor position (right-click) or below element (left-click)  
✅ **Auto-close** - Closes on outside click or scroll  
✅ **Beautiful animations** - Smooth fade-in effect  

## Installation

The component is already created in `src/components/ContextMenu.vue`. No additional installation needed!

## Basic Usage

### Method 1: Right-Click Context Menu (Default)

```vue
<script setup lang="ts">
import ContextMenu from './components/ContextMenu.vue'

const menuItems = [
  {
    label: 'Copy',
    icon: '📋',
    action: () => console.log('Copy clicked')
  },
  {
    label: 'Paste',
    icon: '📄',
    action: () => console.log('Paste clicked')
  },
  {
    label: 'Delete',
    icon: '🗑️',
    action: () => console.log('Delete clicked'),
    disabled: true  // Optional: disable menu item
  }
]
</script>

<template>
  <!-- Default behavior: right-click to show menu -->
  <ContextMenu :menu-items="menuItems">
    <div class="my-content">
      Right-click me!
    </div>
  </ContextMenu>
  
  <!-- Or explicitly specify right-click -->
  <ContextMenu :menu-items="menuItems" on="right-click">
    <div class="my-content">
      Right-click me!
    </div>
  </ContextMenu>
</template>
```

### Method 1b: Left-Click Dropdown Menu

```vue
<script setup lang="ts">
import ContextMenu from './components/ContextMenu.vue'

const menuItems = [
  {
    label: 'Profile Settings',
    icon: '👤',
    action: () => console.log('Profile clicked')
  },
  {
    label: 'Notifications',
    icon: '🔔',
    action: () => console.log('Notifications clicked')
  },
  {
    label: 'Sign Out',
    icon: '🚪',
    action: () => console.log('Sign out clicked')
  }
]
</script>

<template>
  <!-- Left-click mode: shows as dropdown below the element -->
  <ContextMenu :menu-items="menuItems" on="left-click">
    <button>
      ⚙️ Settings ▼
    </button>
  </ContextMenu>
</template>
```

### Method 2: Using Custom Menu Slot (Full Control)

```vue
<script setup lang="ts">
import ContextMenu from './components/ContextMenu.vue'

const handleAction = (action: string, close: () => void) => {
  console.log(`Action: ${action}`)
  close() // Close the menu
}
</script>

<template>
  <ContextMenu>
    <div class="my-content">
      Right-click for custom menu!
    </div>
    
    <template #menu="{ close }">
      <div class="custom-menu">
        <button @click="handleAction('Custom Action 1', close)">
          Action 1
        </button>
        <button @click="handleAction('Custom Action 2', close)">
          Action 2
        </button>
      </div>
    </template>
  </ContextMenu>
</template>

<style>
.custom-menu button {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.custom-menu button:hover {
  background-color: #f0f0f0;
}
</style>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuItems` | `MenuItem[]` | `[]` | Array of menu items (optional if using custom slot) |
| `on` | `'left-click' \| 'right-click'` | `'right-click'` | Trigger mode: 'right-click' shows menu at cursor, 'left-click' shows as dropdown below element |

### MenuItem Interface

```typescript
interface MenuItem {
  label: string        // Text to display
  icon?: string       // Optional icon (emoji or text)
  action: () => void  // Function to call when clicked
  disabled?: boolean  // Optional: disable the item
}
```

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| default | - | Wrapped content that will have context menu |
| menu | `{ close: () => void }` | Custom menu content (overrides `menuItems` prop) |

## Examples

### Right-Click Mode Examples

#### Example 1: Simple Text Area

```vue
<ContextMenu :menu-items="textMenuItems">
  <textarea placeholder="Right-click for options..."></textarea>
</ContextMenu>
```

#### Example 2: Image with Context Menu

```vue
<ContextMenu :menu-items="imageMenuItems">
  <img src="photo.jpg" alt="Photo" />
</ContextMenu>
```

#### Example 3: Complex Card Component

```vue
<ContextMenu :menu-items="cardMenuItems">
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <button>Click me</button>
  </div>
</ContextMenu>
```

### Left-Click Mode Examples

#### Example 4: Settings Dropdown Button

```vue
<ContextMenu :menu-items="settingsItems" on="left-click">
  <button class="settings-btn">
    ⚙️ Settings ▼
  </button>
</ContextMenu>
```

#### Example 5: User Profile Dropdown

```vue
<script setup lang="ts">
const profileItems = [
  { label: 'View Profile', icon: '👤', action: () => {} },
  { label: 'Settings', icon: '⚙️', action: () => {} },
  { label: 'Sign Out', icon: '🚪', action: () => {} }
]
</script>

<template>
  <ContextMenu :menu-items="profileItems" on="left-click">
    <div class="user-avatar">
      <img src="avatar.jpg" alt="User" />
      <span>John Doe ▼</span>
    </div>
  </ContextMenu>
</template>
```

#### Example 6: Dropdown Menu Bar

```vue
<template>
  <nav class="menu-bar">
    <ContextMenu on="left-click">
      <button>File ▼</button>
      <template #menu="{ close }">
        <button @click="close()">New</button>
        <button @click="close()">Open</button>
        <button @click="close()">Save</button>
      </template>
    </ContextMenu>
    
    <ContextMenu on="left-click">
      <button>Edit ▼</button>
      <template #menu="{ close }">
        <button @click="close()">Cut</button>
        <button @click="close()">Copy</button>
        <button @click="close()">Paste</button>
      </template>
    </ContextMenu>
  </nav>
</template>
```

### Example 4: Custom Styled Menu

```vue
<ContextMenu>
  <div class="content">Right-click me!</div>
  
  <template #menu="{ close }">
    <div class="fancy-menu">
      <div class="menu-header">Options</div>
      <button class="menu-btn primary" @click="close()">
        ✨ Primary Action
      </button>
      <button class="menu-btn" @click="close()">
        📝 Edit
      </button>
      <div class="divider"></div>
      <button class="menu-btn danger" @click="close()">
        🗑️ Delete
      </button>
    </div>
  </template>
</ContextMenu>
```

## Styling

The component comes with default styles, but you can customize them:

### Override Default Styles

```vue
<style>
/* Target the menu */
.context-menu {
  background: #333 !important;
  border-radius: 12px !important;
}

/* Target menu items */
.menu-item {
  color: white !important;
}

.menu-item:hover {
  background-color: #555 !important;
}
</style>
```

### Dark Mode Example

```vue
<style>
.context-menu {
  background: #2d2d2d !important;
  border-color: #444 !important;
}

.menu-label {
  color: #e0e0e0 !important;
}

.menu-item:hover:not(.disabled) {
  background-color: #3d3d3d !important;
}
</style>
```

## How It Works

### Right-Click Mode (Default)
1. **Wrapping**: The component wraps your content in a container that listens for `contextmenu` events
2. **Event Prevention**: When right-click occurs, it prevents the default browser menu (`event.preventDefault()`)
3. **Positioning**: The menu is positioned at the exact cursor coordinates using fixed positioning
4. **Teleport**: Uses Vue's `<Teleport>` to render the menu at the document body level (prevents z-index issues)
5. **Auto-close**: Listens for clicks outside the menu and scroll events to auto-close

### Left-Click Mode
1. **Wrapping**: The component wraps your content in a container that listens for `click` events
2. **Event Handling**: When left-click occurs on the wrapped element, it triggers the menu
3. **Dropdown Positioning**: The menu is positioned directly below the clicked element (dropdown style)
4. **Teleport**: Uses Vue's `<Teleport>` to render the menu at the document body level
5. **Auto-close**: Closes when clicking outside the element or menu, or on scroll

## When to Use Which Mode

### Use `on="right-click"` (Context Menu) when:
- Working with content areas (text, images, cards)
- Providing contextual actions for specific elements
- User expects traditional right-click behavior
- Space-saving is important (hidden until needed)

### Use `on="left-click"` (Dropdown) when:
- Creating navigation menus or menu bars
- Building dropdown buttons or select-like controls
- User profile or account menus
- Actions need to be more discoverable
- Creating toolbar dropdowns

## Best Practices

1. **Keep menu items focused**: Don't overload with too many options
2. **Use icons**: Visual indicators help users quickly identify actions
3. **Disable appropriately**: Use the `disabled` property for unavailable actions
4. **Group related items**: Use dividers in custom slots for better organization
5. **Test on different screen positions**: Ensure menu doesn't go off-screen at edges
6. **Choose the right mode**: Use right-click for contextual actions, left-click for primary navigation/actions
7. **Visual indicators**: Add arrow icons (▼) to left-click elements to indicate they're interactive

## Browser Compatibility

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ All modern browsers supporting Vue 3  

## Notes

- The menu automatically closes when clicking outside or scrolling
- Uses `z-index: 9999` to ensure menu appears above other content
- The `display: contents` CSS ensures the wrapper doesn't affect your layout
- Right-click events are captured from all descendants of the wrapped content

## Troubleshooting

**Q: Menu appears but browser menu also shows**  
A: Make sure you're clicking within the wrapped content area. The `@contextmenu` handler should prevent default.

**Q: Menu position is wrong**  
A: This might happen if there are CSS transforms on parent elements. The menu uses `clientX/clientY` which work with viewport coordinates.

**Q: Menu is hidden behind other elements**  
A: Check the z-index of conflicting elements. The menu uses `z-index: 9999` by default.

**Q: Can I nest ContextMenu components?**  
A: Yes! The innermost ContextMenu will handle the event due to `event.stopPropagation()`.

## License

Feel free to use and modify this component in your projects!

