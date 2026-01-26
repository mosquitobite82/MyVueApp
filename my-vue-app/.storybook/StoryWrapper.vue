<template>
  <v-app :theme="themeName">
    <v-main>
      <slot name="story"></slot>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
/**
 * This is needed to ensure that the Vuetify theme is applied to the storybook.
 */



defineProps<{
  themeName?: string
}>()
</script>
