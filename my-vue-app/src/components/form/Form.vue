<template>
  <form>
    <slot />
  </form>
</template>

<script setup lang="ts">
import type { Form } from './types'
defineProps<Form>()
</script>
<style scoped>
form {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}
</style>
