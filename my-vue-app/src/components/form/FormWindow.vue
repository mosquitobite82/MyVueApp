<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <v-card class="mb-4" variant="outlined">
    <v-card-title class="text-subtitle-1 font-weight-bold">{{ name }}</v-card-title>

    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
