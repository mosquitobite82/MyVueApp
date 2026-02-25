<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <div class="form-section mb-4">
    <div class="text-caption text-medium-emphasis text-uppercase mb-2">
      {{ name }}
    </div>

    <v-divider class="mb-3" />

    <div class="form-fields">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
