import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
// Detect if we're running in Storybook context
const isStorybook = 
  process.env.STORYBOOK === 'true' 
  || process.env.npm_lifecycle_event?.includes('storybook') 
  || process.argv.some(arg => arg.includes('storybook'));

export default defineConfig({
  plugins: [
    vue(),
    // Exclude vite-plugin-vue-devtools when running Storybook
    // (it pulls in vite-plugin-inspect which breaks with Vite 7's env API)
    ...(isStorybook ? [] : [vueDevTools()]),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
