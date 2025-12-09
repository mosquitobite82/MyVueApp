<script setup lang="ts">
import { ref } from 'vue'
import ContextMenu from './ContextMenu.vue'

const message = ref('Right-click anywhere in this box!')
const clickCount = ref(0)

// Example 1: Using menu items via props
const menuItems = [
  {
    label: 'Copy',
    icon: '📋',
    action: () => {
      message.value = 'Copied!'
      setTimeout(() => message.value = 'Right-click anywhere in this box!', 2000)
    }
  },
  {
    label: 'Paste',
    icon: '📄',
    action: () => {
      message.value = 'Pasted!'
      setTimeout(() => message.value = 'Right-click anywhere in this box!', 2000)
    }
  },
  {
    label: 'Delete',
    icon: '🗑️',
    action: () => {
      message.value = 'Deleted!'
      setTimeout(() => message.value = 'Right-click anywhere in this box!', 2000)
    }
  },
  {
    label: 'Disabled Option',
    icon: '🚫',
    action: () => {},
    disabled: true
  }
]

// Example 2: Custom slot handlers
const handleCustomAction = (action: string, close: () => void) => {
  clickCount.value++
  message.value = `You clicked: ${action} (${clickCount.value} times)`
  close()
  setTimeout(() => message.value = 'Right-click anywhere in this box!', 2000)
}
</script>

<template>
  <div class="demo-container">
    <h2>Context Menu Demo</h2>
    
    <!-- Example 1: Using menuItems prop -->
    <div class="example">
      <h3>Example 1: Using Props</h3>
      <ContextMenu :menu-items="menuItems">
        <div class="demo-box">
          <p>{{ message }}</p>
          <p class="hint">👆 Right-click me!</p>
        </div>
      </ContextMenu>
    </div>

    <!-- Example 2: Using custom menu slot -->
    <div class="example">
      <h3>Example 2: Using Custom Slot</h3>
      <ContextMenu>
        <div class="demo-box demo-box-secondary">
          <p>Right-click for custom menu!</p>
          <p class="hint">✨ Custom styled menu</p>
        </div>
        
        <template #menu="{ close }">
          <div class="custom-menu">
            <div class="custom-menu-header">Custom Menu</div>
            <button 
              class="custom-menu-item"
              @click="handleCustomAction('Action 1', close)"
            >
              ⭐ Action 1
            </button>
            <button 
              class="custom-menu-item"
              @click="handleCustomAction('Action 2', close)"
            >
              🎯 Action 2
            </button>
            <div class="custom-menu-divider"></div>
            <button 
              class="custom-menu-item danger"
              @click="handleCustomAction('Delete', close)"
            >
              ❌ Delete
            </button>
          </div>
        </template>
      </ContextMenu>
    </div>

    <!-- Example 3: Nested content -->
    <div class="example">
      <h3>Example 3: Complex Content</h3>
      <ContextMenu :menu-items="menuItems">
        <div class="demo-box demo-box-complex">
          <h4>Product Card</h4>
          <img 
            src="https://via.placeholder.com/150" 
            alt="Product" 
            style="width: 100%; border-radius: 8px; margin: 10px 0;"
          >
          <p><strong>Price:</strong> $29.99</p>
          <button class="action-button">Add to Cart</button>
          <p class="hint">Right-click anywhere here!</p>
        </div>
      </ContextMenu>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.example {
  margin-bottom: 40px;
}

h3 {
  color: #34495e;
  margin-bottom: 15px;
  font-size: 18px;
}

.demo-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  color: white;
  cursor: default;
  transition: transform 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.demo-box p {
  font-size: 18px;
  margin: 10px 0;
  font-weight: 500;
}

.hint {
  font-size: 14px !important;
  opacity: 0.9;
  margin-top: 10px !important;
}

.demo-box-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.demo-box-complex {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #2c3e50;
}

.demo-box-complex h4 {
  margin-top: 0;
  color: white;
}

.action-button {
  background: white;
  color: #4facfe;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin: 10px 0;
}

.action-button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Custom menu styles */
.custom-menu {
  padding: 8px;
}

.custom-menu-header {
  padding: 8px 12px;
  font-weight: 600;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-menu-item {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s;
}

.custom-menu-item:hover {
  background-color: #f0f0f0;
}

.custom-menu-item.danger {
  color: #e74c3c;
}

.custom-menu-item.danger:hover {
  background-color: #fee;
}

.custom-menu-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 6px 0;
}
</style>

