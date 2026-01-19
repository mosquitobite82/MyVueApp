<script setup lang="ts">
import { ref } from 'vue'
import ClickableWithMenu from './ClickableWithMenu.vue'
import type { MenuItem } from './ClickableWithMenu.vue'

const selectedAction = ref<string>('')
const lastClickedCard = ref<string>('')

const cardMenuItems: MenuItem[] = [
  { title: 'Edit', value: 'edit', icon: 'mdi-pencil' },
  { title: 'Share', value: 'share', icon: 'mdi-share' },
  { title: 'Delete', value: 'delete', icon: 'mdi-delete', color: 'error' },
]

const textMenuItems: MenuItem[] = [
  { title: 'Copy', value: 'copy', icon: 'mdi-content-copy' },
  { title: 'Cut', value: 'cut', icon: 'mdi-content-cut' },
  { title: 'Paste', value: 'paste', icon: 'mdi-content-paste', disabled: true },
]

const imageMenuItems: MenuItem[] = [
  { title: 'Download', value: 'download', icon: 'mdi-download' },
  { title: 'Set as Profile', value: 'set-profile', icon: 'mdi-account' },
  { title: 'Remove', value: 'remove', icon: 'mdi-close', color: 'error' },
]

const handleCardMenuClick = (item: MenuItem, cardId: string) => {
  selectedAction.value = `${item.value} - ${cardId}`
  lastClickedCard.value = cardId
}

const handleTextMenuClick = (item: MenuItem) => {
  selectedAction.value = `Text action: ${item.value}`
}

const handleImageMenuClick = (item: MenuItem) => {
  selectedAction.value = `Image action: ${item.value}`
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4">ClickableWithMenu Demo</h1>
        <p class="text-body-1 mb-6">
          Click on any item below to see the context menu
        </p>

        <v-alert v-if="selectedAction" type="info" class="mb-6" closable>
          Last action: <strong>{{ selectedAction }}</strong>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Card Examples -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Cards with Context Menu</h2>
      </v-col>

      <v-col v-for="i in 3" :key="i" cols="12" md="4">
        <ClickableWithMenu
          :menu-items="cardMenuItems"
          @menu-item-click="(item) => handleCardMenuClick(item, `Card ${i}`)"
        >
          <v-card elevation="2" :color="lastClickedCard === `Card ${i}` ? 'primary' : ''">
            <v-card-title>Card {{ i }}</v-card-title>
            <v-card-text>
              Click anywhere on this card to see the menu
            </v-card-text>
          </v-card>
        </ClickableWithMenu>
      </v-col>
    </v-row>

    <!-- Text Example -->
    <v-row class="mt-6">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Text with Context Menu</h2>
      </v-col>

      <v-col cols="12" md="6">
        <ClickableWithMenu
          :menu-items="textMenuItems"
          @menu-item-click="handleTextMenuClick"
        >
          <v-chip color="primary" size="large">
            <v-icon start>mdi-text</v-icon>
            Click me for text actions
          </v-chip>
        </ClickableWithMenu>
      </v-col>
    </v-row>

    <!-- Image/Avatar Example -->
    <v-row class="mt-6">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Images with Context Menu</h2>
      </v-col>

      <v-col cols="12" md="6">
        <div class="d-flex gap-4">
          <ClickableWithMenu
            :menu-items="imageMenuItems"
            @menu-item-click="handleImageMenuClick"
          >
            <v-avatar size="80" color="blue">
              <v-icon size="40">mdi-account</v-icon>
            </v-avatar>
          </ClickableWithMenu>

          <ClickableWithMenu
            :menu-items="imageMenuItems"
            @menu-item-click="handleImageMenuClick"
          >
            <v-avatar size="80" color="green">
              <v-icon size="40">mdi-image</v-icon>
            </v-avatar>
          </ClickableWithMenu>

          <ClickableWithMenu
            :menu-items="imageMenuItems"
            @menu-item-click="handleImageMenuClick"
          >
            <v-avatar size="80" color="orange">
              <v-icon size="40">mdi-camera</v-icon>
            </v-avatar>
          </ClickableWithMenu>
        </div>
      </v-col>
    </v-row>

    <!-- Button Example -->
    <v-row class="mt-6">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Buttons with Context Menu</h2>
      </v-col>

      <v-col cols="12" md="6">
        <ClickableWithMenu
          :menu-items="cardMenuItems"
          @menu-item-click="(item) => handleCardMenuClick(item, 'Button')"
        >
          <v-btn color="primary" size="large">
            <v-icon start>mdi-menu</v-icon>
            Click for Options
          </v-btn>
        </ClickableWithMenu>
      </v-col>
    </v-row>

    <!-- Code Example -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Usage Example</h2>
        <v-card>
          <v-card-text>
            <pre class="text-body-2"><code>&lt;script setup lang="ts"&gt;
import ClickableWithMenu from './ClickableWithMenu.vue'
import type { MenuItem } from './ClickableWithMenu.vue'

const menuItems: MenuItem[] = [
  { title: 'Edit', value: 'edit', icon: 'mdi-pencil' },
  { title: 'Delete', value: 'delete', icon: 'mdi-delete', color: 'error' },
]

const handleMenuClick = (item: MenuItem) => {
  console.log('Clicked:', item.value)
}
&lt;/script&gt;

&lt;template&gt;
  &lt;ClickableWithMenu
    :menu-items="menuItems"
    @menu-item-click="handleMenuClick"
  &gt;
    &lt;v-card&gt;
      &lt;v-card-title&gt;Your Content&lt;/v-card-title&gt;
    &lt;/v-card&gt;
  &lt;/ClickableWithMenu&gt;
&lt;/template&gt;</code></pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}

.gap-4 {
  gap: 16px;
}
</style>



