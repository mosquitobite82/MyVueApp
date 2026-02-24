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

// Example 4: Left-click dropdown menu items
const dropdownMessage = ref('Select an option')
const selectedOption = ref<string | null>(null)

const dropdownMenuItems = [
  {
    label: 'Profile Settings',
    icon: '👤',
    action: () => {
      selectedOption.value = 'Profile'
      dropdownMessage.value = 'Profile Settings selected'
    }
  },
  {
    label: 'Notifications',
    icon: '🔔',
    action: () => {
      selectedOption.value = 'Notifications'
      dropdownMessage.value = 'Notifications selected'
    }
  },
  {
    label: 'Privacy',
    icon: '🔒',
    action: () => {
      selectedOption.value = 'Privacy'
      dropdownMessage.value = 'Privacy selected'
    }
  },
  {
    label: 'Sign Out',
    icon: '🚪',
    action: () => {
      selectedOption.value = 'Sign Out'
      dropdownMessage.value = 'Signed out!'
    }
  }
]

// Example 5: Action buttons with left-click dropdowns
const actionMessage = ref('No action taken yet')

const handleActionDropdown = (action: string, close: () => void) => {
  actionMessage.value = `Action: ${action} - Executed at ${new Date().toLocaleTimeString()}`
  close()
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

    <hr class="section-divider" />
    
    <h2 style="margin-top: 40px;">Left-Click Mode (Dropdown)</h2>

    <!-- Example 4: Left-click dropdown button -->
    <div class="example">
      <h3>Example 4: Dropdown Button (Left-Click)</h3>
      <div class="dropdown-demo">
        <ContextMenu :menu-items="dropdownMenuItems" on="left-click">
          <button class="dropdown-button">
            ⚙️ Settings
            <span class="dropdown-arrow">▼</span>
          </button>
        </ContextMenu>
        
        <div class="status-display">
          <p>{{ dropdownMessage }}</p>
          <p v-if="selectedOption" class="selected-option">
            Selected: <strong>{{ selectedOption }}</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Example 5: Multiple dropdown buttons -->
    <div class="example">
      <h3>Example 5: Multiple Dropdown Buttons</h3>
      <div class="button-group">
        <ContextMenu on="left-click">
          <button class="dropdown-button dropdown-button-primary">
            📁 File
            <span class="dropdown-arrow">▼</span>
          </button>
          <template #menu="{ close }">
            <div class="custom-menu">
              <button class="custom-menu-item" @click="handleActionDropdown('New File', close)">
                📄 New File
              </button>
              <button class="custom-menu-item" @click="handleActionDropdown('Open', close)">
                📂 Open
              </button>
              <button class="custom-menu-item" @click="handleActionDropdown('Save', close)">
                💾 Save
              </button>
              <div class="custom-menu-divider"></div>
              <button class="custom-menu-item" @click="handleActionDropdown('Exit', close)">
                🚪 Exit
              </button>
            </div>
          </template>
        </ContextMenu>

        <ContextMenu on="left-click">
          <button class="dropdown-button dropdown-button-primary">
            ✂️ Edit
            <span class="dropdown-arrow">▼</span>
          </button>
          <template #menu="{ close }">
            <div class="custom-menu">
              <button class="custom-menu-item" @click="handleActionDropdown('Cut', close)">
                ✂️ Cut
              </button>
              <button class="custom-menu-item" @click="handleActionDropdown('Copy', close)">
                📋 Copy
              </button>
              <button class="custom-menu-item" @click="handleActionDropdown('Paste', close)">
                📄 Paste
              </button>
            </div>
          </template>
        </ContextMenu>

        <ContextMenu on="left-click">
          <button class="dropdown-button dropdown-button-primary">
            👁️ View
            <span class="dropdown-arrow">▼</span>
          </button>
          <template #menu="{ close }">
            <div class="custom-menu">
              <button class="custom-menu-item" @click="handleActionDropdown('Zoom In', close)">
                🔍 Zoom In
              </button>
              <button class="custom-menu-item" @click="handleActionDropdown('Zoom Out', close)">
                🔎 Zoom Out
              </button>
              <button class="custom-menu-item" @click="handleActionDropdown('Full Screen', close)">
                ⛶ Full Screen
              </button>
            </div>
          </template>
        </ContextMenu>
      </div>
      
      <div class="status-display">
        <p>{{ actionMessage }}</p>
      </div>
    </div>

    <!-- Example 6: User profile dropdown -->
    <div class="example">
      <h3>Example 6: User Profile Dropdown</h3>
      <div class="profile-demo">
        <ContextMenu on="left-click">
          <div class="user-profile-button">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User Avatar"
              class="avatar"
            />
            <div class="user-info">
              <div class="user-name">John Doe</div>
              <div class="user-email">john@example.com</div>
            </div>
            <span class="dropdown-arrow">▼</span>
          </div>
          
          <template #menu="{ close }">
            <div class="profile-menu">
              <div class="profile-menu-header">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="User Avatar"
                  class="avatar-large"
                />
                <div>
                  <div class="profile-name">John Doe</div>
                  <div class="profile-email">john@example.com</div>
                </div>
              </div>
              <div class="custom-menu-divider"></div>
              <button class="custom-menu-item" @click="close()">
                👤 View Profile
              </button>
              <button class="custom-menu-item" @click="close()">
                ⚙️ Settings
              </button>
              <button class="custom-menu-item" @click="close()">
                💳 Billing
              </button>
              <div class="custom-menu-divider"></div>
              <button class="custom-menu-item" @click="close()">
                ❓ Help & Support
              </button>
              <button class="custom-menu-item danger" @click="close()">
                🚪 Sign Out
              </button>
            </div>
          </template>
        </ContextMenu>
      </div>
    </div>

    <hr class="section-divider" />
    
    <h2 style="margin-top: 40px;">Smart Positioning Demo</h2>
    <p style="color: #666; margin-bottom: 20px;">
      These examples demonstrate automatic menu repositioning when there's not enough space.
      Try clicking/right-clicking buttons near the screen edges!
    </p>

    <!-- Example 7: Edge positioning tests -->
    <div class="example">
      <h3>Example 7: Edge Positioning Tests</h3>
      <div class="edge-test-container">
        <!-- Top-left corner -->
        <div class="corner top-left">
          <ContextMenu on="left-click" :menu-items="menuItems">
            <button class="edge-button">Top Left ▼</button>
          </ContextMenu>
        </div>

        <!-- Top-right corner -->
        <div class="corner top-right">
          <ContextMenu on="left-click" :menu-items="menuItems">
            <button class="edge-button">Top Right ▼</button>
          </ContextMenu>
        </div>

        <!-- Bottom-left corner -->
        <div class="corner bottom-left">
          <ContextMenu on="left-click" :menu-items="menuItems">
            <button class="edge-button">Bottom Left ▼</button>
          </ContextMenu>
        </div>

        <!-- Bottom-right corner -->
        <div class="corner bottom-right">
          <ContextMenu on="left-click" :menu-items="menuItems">
            <button class="edge-button">Bottom Right ▼</button>
          </ContextMenu>
        </div>

        <!-- Center instruction -->
        <div class="center-instruction">
          <p>📍 Click buttons in corners to see smart positioning</p>
          <p style="font-size: 12px; color: #999; margin-top: 8px;">
            Menus automatically flip to stay within viewport
          </p>
        </div>
      </div>
    </div>

    <!-- Example 8: Right-click edge test -->
    <div class="example">
      <h3>Example 8: Right-Click Edge Test</h3>
      <div class="right-click-edge-demo">
        <ContextMenu :menu-items="menuItems">
          <div class="large-context-area">
            <h4>Right-click anywhere in this area!</h4>
            <p>Try right-clicking near the edges of your screen</p>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              💡 The context menu will automatically position itself to stay within the viewport bounds.
              Try right-clicking in different corners and edges to see the smart positioning in action!
            </p>
          </div>
        </ContextMenu>
      </div>
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

/* Section divider */
.section-divider {
  margin: 50px 0;
  border: none;
  border-top: 2px solid #e0e0e0;
}

/* Dropdown button styles */
.dropdown-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.dropdown-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 2px solid #3498db;
  border-radius: 8px;
  color: #3498db;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown-button:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.dropdown-button-primary {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.dropdown-button-primary:hover {
  background: #2980b9;
  border-color: #2980b9;
}

.dropdown-arrow {
  font-size: 10px;
  margin-left: 4px;
  transition: transform 0.2s;
}

.dropdown-button:hover .dropdown-arrow {
  transform: translateY(2px);
}

.status-display {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.status-display p {
  margin: 5px 0;
  color: #2c3e50;
}

.selected-option {
  color: #3498db !important;
  font-size: 14px;
}

/* Button group */
.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Profile dropdown styles */
.profile-demo {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.user-profile-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.user-profile-button:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
}

.avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
}

.user-info {
  flex: 1;
  text-align: left;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.user-email {
  font-size: 12px;
  color: #7f8c8d;
}

.profile-menu {
  padding: 8px;
  min-width: 250px;
}

.profile-menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 4px;
}

.profile-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
}

.profile-email {
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 2px;
}

/* Edge positioning test styles */
.edge-test-container {
  position: relative;
  height: 400px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.corner {
  position: absolute;
}

.corner.top-left {
  top: 10px;
  left: 10px;
}

.corner.top-right {
  top: 10px;
  right: 10px;
}

.corner.bottom-left {
  bottom: 10px;
  left: 10px;
}

.corner.bottom-right {
  bottom: 10px;
  right: 10px;
}

.edge-button {
  padding: 10px 20px;
  background: white;
  border: 2px solid #3498db;
  border-radius: 8px;
  color: #3498db;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.edge-button:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.center-instruction {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.center-instruction p {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

/* Right-click edge test */
.right-click-edge-demo {
  margin-top: 20px;
}

.large-context-area {
  min-height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  cursor: default;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.large-context-area:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.large-context-area h4 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.large-context-area p {
  margin: 5px 0;
  font-size: 16px;
}
</style>

