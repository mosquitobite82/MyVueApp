<script setup lang="ts">
import type { Section } from '@/types/form'
import FormField from '@/components/form/FormField.vue'

defineProps<{ section: Section }>()
</script>

<template>
  <div class="form-section mb-4">
    <div class="text-caption text-medium-emphasis text-uppercase mb-2">
      {{ section.name }}
    </div>

    <v-divider class="mb-3" />

    <div class="form-fields">
      <FormField
        v-for="(field, i) in section.fields"
        :key="i"
        :field="field"
        :section-id="section.formId"
        :field-index="i"
      />

      <!-- Recursive child sections -->
      <FormSection
        v-for="child in section.sections"
        :key="child.formId"
        :section="child"
        class="mt-2"
      />
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
