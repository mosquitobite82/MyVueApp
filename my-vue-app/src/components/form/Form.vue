<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useFormStore } from '@/stores/formStore'
import FormSection from '@/components/form/FormSection.vue'
import FormWindow from '@/components/form/FormWindow.vue'

const store = useFormStore()

onMounted(() => store.connect())
onUnmounted(() => store.disconnect())
</script>

<template>
  <div v-if="store.isLoading" class="text-body-2 pa-4">Connecting…</div>

  <v-alert v-else-if="store.error" type="error" density="compact" class="ma-4">
    {{ store.error }}
  </v-alert>

  <div v-else-if="!store.form" class="text-body-2 text-medium-emphasis pa-4">
    No form data received yet.
  </div>

  <div v-else class="form-root">
    <FormWindow v-for="win in store.form.windows" :key="win.name" :name="win.name">
        <FormSection
          v-for="section in win.sections"
          :key="section.formId"
          :section="section"
        />
    </FormWindow>
  </div>
</template>

<style scoped>
.form-root {
  display: flex;
  flex-direction: column;
}
</style>
