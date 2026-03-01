import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
// Detect if we're running in Storybook context
const isStorybook =
  process.env.STORYBOOK === 'true' ||
  process.env.npm_lifecycle_event?.includes('storybook') ||
  process.argv.some((arg) => arg.includes('storybook'))

export default defineConfig({
  // Load .env from workspace root so frontend and backend share the same config
  envDir: path.resolve(__dirname, '..'),
  server: {
    // Proxy API and SignalR to backend so the browser never does cross-origin requests (avoids CORS / "Failed to fetch")
    proxy: {
      '/api': { target: 'http://localhost:5215', changeOrigin: true },
      '/hubs': { target: 'http://localhost:5215', changeOrigin: true, ws: true },
    },
  },
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
