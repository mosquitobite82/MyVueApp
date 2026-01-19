<template>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      closable
      class="mb-4"
      @click:close="handleClearError"
    >
      {{ error }}
    </v-alert>
</template>
<script setup lang="ts">
    const props = defineProps<{
        error: string | null
        handleClearError: () => void
    }>();
</script>