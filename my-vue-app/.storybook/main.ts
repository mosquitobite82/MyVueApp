import type { StorybookConfig } from '@storybook/vue3-vite';
import { fileURLToPath, URL } from 'node:url';
import vuetify from 'vite-plugin-vuetify';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/vue3-vite",
  async viteFinal(config) {
    // vite-plugin-vue-devtools pulls in vite-plugin-inspect, which breaks
    // under Vite 7's env API ("Can not found environment context for client").
    // Disable both when running Storybook.
    const drop = ['vite-plugin-vue-devtools', 'vite-plugin-inspect', 'vite-inspect', 'inspect'];
    
    // Helper to get plugin name
    const getPluginName = (plugin: any): string => {
      if (!plugin) return '';
      if (Array.isArray(plugin)) {
        return getPluginName(plugin[0]);
      }
      if (typeof plugin === 'function') {
        return plugin.name || '';
      }
      return plugin.name || '';
    };
    
    // Filter plugins more aggressively - handle all plugin formats
    const filteredPlugins = (config.plugins ?? []).map((p) => {
      // Handle array format [plugin, options]
      if (Array.isArray(p)) {
        const pluginName = getPluginName(p[0]);
        if (drop.some((d) => pluginName.includes(d))) {
          return null; // Mark for removal
        }
        return p;
      }
      return p;
    }).filter((p) => {
      if (!p) return false;
      const pluginName = getPluginName(p);
      return !drop.some((d) => pluginName.includes(d));
    });
    
    // Ensure Vuetify is included (it might have been filtered if it was in an array)
    const hasVuetify = filteredPlugins.some((p) => {
      const name = getPluginName(p);
      return name.includes('vuetify');
    });
    
    if (!hasVuetify) {
      filteredPlugins.push(vuetify({ autoImport: true }));
    }
    
    config.plugins = filteredPlugins;
    
    // Add resolve alias
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    };
    
    // Exclude problematic plugins from optimization
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      'vite-plugin-inspect',
      'vite-plugin-vue-devtools',
    ];
    
    return config;
  },
};
export default config;