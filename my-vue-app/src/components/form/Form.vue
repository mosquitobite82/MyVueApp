<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFormStore } from '@/stores/formStore'

const store = useFormStore()

onMounted(() => store.connect())
onUnmounted(() => store.disconnect())

// --- Draft tracking for editable fields ---
// Key format: `${section.formId}:${fieldIndex}`
const drafts = ref<Record<string, string>>({})

const fieldKey = (sectionId: string, index: number) => `${sectionId}:${index}`

/** Display value: show the draft while the user is typing, otherwise show the store value. */
const displayValue = (sectionId: string, index: number, storeValue: string) => {
  const key = fieldKey(sectionId, index)
  return key in drafts.value ? drafts.value[key]! : storeValue
}

const setDraft = (sectionId: string, index: number, value: string) => {
  drafts.value[fieldKey(sectionId, index)] = value
}

/** Called on blur: send event if value changed, then clear the draft. */
const commitField = async (sectionId: string, index: number, storeValue: string) => {
  const key = fieldKey(sectionId, index)
  const draft = drafts.value[key]

  // Always clear the draft so the field reverts to store value if nothing changed
  delete drafts.value[key]

  if (draft === undefined || draft === storeValue) return

  try {
    await store.sendFieldChange(sectionId, index, storeValue, draft)
  } catch (err) {
    console.error('Failed to commit field change:', err)
  }
}
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
    <v-card v-for="win in store.form.windows" :key="win.name" class="mb-4" variant="outlined">
      <v-card-title class="text-subtitle-1 font-weight-bold">{{ win.name }}</v-card-title>

      <v-card-text>
        <div v-for="section in win.sections" :key="section.formId" class="form-section mb-4">
          <div class="text-caption text-medium-emphasis text-uppercase mb-2">
            {{ section.name }}
          </div>

          <v-divider class="mb-3" />

          <div class="form-fields">
            <template v-for="(field, i) in section.fields" :key="i">
              <v-text-field
                v-if="field.type === 'text'"
                :label="field.label.name"
                :model-value="displayValue(section.formId, i, field.value ?? '')"
                density="compact"
                variant="outlined"
                hide-details="auto"
                @update:model-value="(val) => setDraft(section.formId, i, String(val))"
                @blur="() => commitField(section.formId, i, field.value ?? '')"
              />

              <v-textarea
                v-else-if="field.type === 'textarea'"
                :label="field.label.name"
                :model-value="field.value ?? ''"
                density="compact"
                variant="outlined"
                rows="2"
                auto-grow
                readonly
                hide-details="auto"
              />

              <v-text-field
                v-else-if="field.type === 'number'"
                :label="field.label.name"
                :model-value="field.value ?? ''"
                type="number"
                density="compact"
                variant="outlined"
                readonly
                hide-details="auto"
              />

              <v-checkbox
                v-else-if="field.type === 'checkbox'"
                :label="field.label.name"
                :model-value="field.value ?? false"
                density="compact"
                readonly
                hide-details="auto"
              />

              <v-select
                v-else-if="field.type === 'select'"
                :label="field.label.name"
                :items="field.items"
                :model-value="field.value?.value"
                item-title="label"
                item-value="value"
                density="compact"
                variant="outlined"
                readonly
                hide-details="auto"
              />

              <div v-else-if="field.type === 'radio'">
                <div class="text-body-2 mb-1">{{ field.label.name }}</div>
                <v-radio-group
                  :model-value="field.value?.value"
                  inline
                  density="compact"
                  readonly
                  hide-details="auto"
                >
                  <v-radio
                    v-for="item in field.items"
                    :key="String(item.value)"
                    :label="item.label"
                    :value="item.value"
                  />
                </v-radio-group>
              </div>

              <v-text-field
                v-else-if="field.type === 'datetime'"
                :label="field.label.name"
                :model-value="field.value ?? ''"
                density="compact"
                variant="outlined"
                readonly
                hide-details="auto"
                prepend-inner-icon="mdi-calendar-clock"
              />
            </template>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.form-root {
  display: flex;
  flex-direction: column;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
