<template>
  <div class="tab-panel">
    <slot
      :is-active="isActive"
      :is-transitioning="isTransitioning"
      :was-previous="wasPrevious"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, watch, type Ref } from 'vue';

const props = defineProps<{
  value: string;
}>();

const emit = defineEmits<{
  (e: 'activated'): void;
  (e: 'deactivated'): void;
  (e: 'transition-start'): void;
  (e: 'transition-complete'): void;
}>();

const tabsContext = inject<{
  activeTab: Ref<string>;
  isTransitioning: Ref<boolean>;
  previousTab: Ref<string | null>;
}>('tabsContext');

const isActive = computed(() => tabsContext?.activeTab.value === props.value);
const isTransitioning = computed(() => tabsContext?.isTransitioning.value ?? false);
const wasPrevious = computed(() => tabsContext?.previousTab.value === props.value);

watch(isActive, (active, wasActive) => {
  if (active && !wasActive) {
    emit('activated');
  } else if (!active && wasActive) {
    emit('deactivated');
  }
});

watch(isTransitioning, (transitioning, wasTransitioning) => {
  if (transitioning && !wasTransitioning && (isActive.value || wasPrevious.value)) {
    emit('transition-start');
  } else if (!transitioning && wasTransitioning && isActive.value) {
    emit('transition-complete');
  }
});
</script>

<style scoped>
.tab-panel {
  padding: 1rem;
}
</style>
