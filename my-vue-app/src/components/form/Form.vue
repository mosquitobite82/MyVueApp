<script setup lang="ts">
import { provide, computed, onMounted, onUnmounted } from 'vue'
import { useFormStore } from '@/stores/formStore'
import FormSection from '@/components/form/FormSection.vue'
import FormWindow from '@/components/form/FormWindow.vue'
import { COMMIT_FIELD_KEY, ACTIVE_FIELD_KEY, REQUEST_FOCUS_KEY } from '@/composables/useFormCommit'

const store = useFormStore()

onMounted(() => store.connect())
onUnmounted(() => store.disconnect())

provide(COMMIT_FIELD_KEY, (sectionId, fieldIndex, oldValue, newValue) =>
  store.sendFieldChange(sectionId, fieldIndex, oldValue, newValue),
)

provide(ACTIVE_FIELD_KEY, computed(() => store.form?.activeFieldId ?? null))

provide(REQUEST_FOCUS_KEY, (sectionId, fieldIndex, currentValue) =>
  store.requestFocusChange(sectionId, fieldIndex, currentValue),
)
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
