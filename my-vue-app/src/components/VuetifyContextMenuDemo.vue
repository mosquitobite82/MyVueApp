<script setup lang="ts">
import { ref } from 'vue'
import VuetifyContextMenu from './VuetifyContextMenu.vue'

const message = ref('Right-click or left-click to test!')
const selectedAction = ref<string | null>(null)

// Example menu items
const menuItems = [
  {
    label: 'Copy',
    icon: '📋',
    action: () => {
      selectedAction.value = 'Copy'
      message.value = 'Copied!'
      setTimeout(() => message.value = 'Right-click or left-click to test!', 2000)
    }
  },
  {
    label: 'Paste',
    icon: '📄',
    action: () => {
      selectedAction.value = 'Paste'
      message.value = 'Pasted!'
      setTimeout(() => message.value = 'Right-click or left-click to test!', 2000)
    }
  },
  {
    label: 'Delete',
    icon: '🗑️',
    action: () => {
      selectedAction.value = 'Delete'
      message.value = 'Deleted!'
      setTimeout(() => message.value = 'Right-click or left-click to test!', 2000)
    }
  },
  {
    label: 'Disabled Option',
    icon: '🚫',
    action: () => {},
    disabled: true
  }
]

// Dropdown menu items
const dropdownItems = [
  {
    label: 'Profile Settings',
    icon: '👤',
    action: () => {
      message.value = 'Opening Profile Settings...'
    }
  },
  {
    label: 'Notifications',
    icon: '🔔',
    action: () => {
      message.value = 'Opening Notifications...'
    }
  },
  {
    label: 'Privacy',
    icon: '🔒',
    action: () => {
      message.value = 'Opening Privacy Settings...'
    }
  },
  {
    label: 'Sign Out',
    icon: '🚪',
    action: () => {
      message.value = 'Signing out...'
    }
  }
]

const handleCustomAction = (action: string, close: () => void) => {
  message.value = `Custom Action: ${action}`
  close()
  setTimeout(() => message.value = 'Right-click or left-click to test!', 2000)
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Vuetify Context Menu Demo</h1>
        <p class="text-subtitle-1 text-grey-darken-1 mb-8">
          Context menus built with Vuetify 3's v-menu component
        </p>
      </v-col>
    </v-row>

    <!-- Right-click Examples -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Right-Click Mode</h2>
      </v-col>

      <!-- Example 1: Basic right-click -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Example 1: Basic Right-Click Menu</v-card-title>
          <v-card-text>
            <VuetifyContextMenu :menu-items="menuItems" on="right-click">
              <v-sheet
                color="purple-lighten-4"
                rounded
                class="pa-8 text-center"
                elevation="1"
              >
                <v-icon size="48" class="mb-2">mdi-mouse-right-click</v-icon>
                <p class="text-h6">{{ message }}</p>
                <p class="text-caption">Right-click anywhere in this box!</p>
              </v-sheet>
            </VuetifyContextMenu>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Example 2: Right-click with custom slot -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Example 2: Custom Menu Content</v-card-title>
          <v-card-text>
            <VuetifyContextMenu on="right-click">
              <v-sheet
                color="pink-lighten-4"
                rounded
                class="pa-8 text-center"
                elevation="1"
              >
                <v-icon size="48" class="mb-2">mdi-palette</v-icon>
                <p class="text-h6">Custom Menu</p>
                <p class="text-caption">Right-click for styled menu!</p>
              </v-sheet>

              <template #menu="{ close }">
                <v-list density="compact">
                  <v-list-subheader>CUSTOM ACTIONS</v-list-subheader>
                  <v-list-item @click="handleCustomAction('Action 1', close)">
                    <template v-slot:prepend>
                      <v-icon>mdi-star</v-icon>
                    </template>
                    <v-list-item-title>Action 1</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="handleCustomAction('Action 2', close)">
                    <template v-slot:prepend>
                      <v-icon>mdi-heart</v-icon>
                    </template>
                    <v-list-item-title>Action 2</v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="handleCustomAction('Delete', close)" class="text-red">
                    <template v-slot:prepend>
                      <v-icon color="red">mdi-delete</v-icon>
                    </template>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </template>
            </VuetifyContextMenu>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Left-click Examples -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Left-Click Mode (Dropdown)</h2>
      </v-col>

      <!-- Example 3: Dropdown button -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>Example 3: Settings Dropdown</v-card-title>
          <v-card-text>
            <VuetifyContextMenu :menu-items="dropdownItems" on="left-click">
              <v-btn color="primary" prepend-icon="mdi-cog" append-icon="mdi-chevron-down">
                Settings
              </v-btn>
            </VuetifyContextMenu>
            
            <v-alert
              v-if="message !== 'Right-click or left-click to test!'"
              type="info"
              class="mt-4"
              dense
            >
              {{ message }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Example 4: User profile dropdown -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>Example 4: User Profile</v-card-title>
          <v-card-text>
            <VuetifyContextMenu on="left-click">
              <v-chip
                size="large"
                prepend-icon="mdi-account-circle"
                append-icon="mdi-chevron-down"
                color="primary"
                variant="outlined"
                class="px-4"
              >
                John Doe
              </v-chip>

              <template #menu="{ close }">
                <v-list density="compact" min-width="250">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-avatar color="primary">
                        <v-icon>mdi-account</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>John Doe</v-list-item-title>
                    <v-list-item-subtitle>john@example.com</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="close()">
                    <template v-slot:prepend>
                      <v-icon>mdi-account</v-icon>
                    </template>
                    <v-list-item-title>View Profile</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="close()">
                    <template v-slot:prepend>
                      <v-icon>mdi-cog</v-icon>
                    </template>
                    <v-list-item-title>Settings</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="close()">
                    <template v-slot:prepend>
                      <v-icon>mdi-credit-card</v-icon>
                    </template>
                    <v-list-item-title>Billing</v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="close()">
                    <template v-slot:prepend>
                      <v-icon color="red">mdi-logout</v-icon>
                    </template>
                    <v-list-item-title class="text-red">Sign Out</v-list-item-title>
                  </v-list-item>
                </v-list>
              </template>
            </VuetifyContextMenu>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Example 5: Menu bar -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>Example 5: Menu Bar</v-card-title>
          <v-card-text>
            <v-btn-toggle divided class="d-flex">
              <VuetifyContextMenu on="left-click">
                <v-btn variant="text">
                  File
                  <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
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
                    <v-list-item @click="close()">
                      <template v-slot:prepend>
                        <v-icon>mdi-content-save</v-icon>
                      </template>
                      <v-list-item-title>Save</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </template>
              </VuetifyContextMenu>

              <VuetifyContextMenu on="left-click">
                <v-btn variant="text">
                  Edit
                  <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
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
                    <v-list-item @click="close()">
                      <template v-slot:prepend>
                        <v-icon>mdi-content-paste</v-icon>
                      </template>
                      <v-list-item-title>Paste</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </template>
              </VuetifyContextMenu>
            </v-btn-toggle>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edge Positioning Test -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Smart Positioning Demo</h2>
      </v-col>

      <VuetifyContextMenu :menu-items="menuItems" on="right-click">
                    
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Edge Positioning Tests</v-card-title>
          <v-card-text>
            <v-sheet
              color="grey-lighten-4"
              rounded
              class="position-relative"
              style="min-height: 400px;"
            >
              <!-- Corner buttons with proper positioning -->
              <div class="position-absolute" style="top: 10px; left: 10px;">
                <VuetifyContextMenu :menu-items="menuItems" on="left-click">
                  <v-btn color="primary" size="small">Top Left</v-btn>
                </VuetifyContextMenu>
              </div>

              <div class="position-absolute" style="top: 10px; right: 10px;">
                <VuetifyContextMenu :menu-items="menuItems" on="left-click">
                  <v-btn color="primary" size="small">Top Right</v-btn>
                </VuetifyContextMenu>
              </div>

              <div class="position-absolute" style="bottom: 10px; left: 10px;">
                <VuetifyContextMenu :menu-items="menuItems" on="left-click">
                  <v-btn color="primary" size="small">Bottom Left</v-btn>
                </VuetifyContextMenu>
              </div>

              <div class="position-absolute" style="bottom: 10px; right: 10px;">
                <VuetifyContextMenu :menu-items="menuItems" on="left-click">
                  <v-btn color="primary" size="small">Bottom Right</v-btn>
                </VuetifyContextMenu>
              </div>

              <!-- Center instruction -->
              <div class="position-absolute" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <v-alert
                  type="info"
                  variant="tonal"
                  icon="mdi-information"
                >
                  Click buttons in corners to see Vuetify's smart positioning!
                </v-alert>
              </div>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
      </VuetifyContextMenu>
    </v-row>
  </v-container>
</template>

<style scoped>
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>

