<template>
  <v-sheet>
    <v-tabs v-model="activeTab" v-bind="$attrs">
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
        {{ tab.title }}
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-tabs-window v-model="activeTab" @update:model-value="(v: unknown) => onTabChange(v as string)">
      <v-tabs-window-item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
      >
        <slot :name="`tab-${tab.value}`" :is-active="activeTab === tab.value" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch, provide, nextTick, onMounted } from 'vue';

export interface Tab {
  title: string;
  value: string;
}

const props = defineProps<{
  tabs: Tab[];
  modelValue?: string;
}>();
withDefaults(props, {
  tabs: () => [],
  modelValue: () => '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'tab-change', value: string, direction: 'forward' | 'backward'): void;
  (e: 'transition-complete', value: string): void;
}>();

const activeTab = ref(props.modelValue ?? props.tabs[0]?.value ?? '');
const previousTab = ref<string | null>(null);
const isTransitioning = ref(false);
const isMovingForward = ref(true);

// Provide tab state to children
provide('tabsContext', {
  activeTab,
  isTransitioning,
  previousTab,
});

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== activeTab.value) {
      activeTab.value = val;
    }
  }
);

watch(activeTab, (newTab, oldTab) => {
  emit('update:modelValue', newTab);
  if (oldTab !== undefined) {
    previousTab.value = oldTab;
    
    // Determine direction based on tab indices
    const oldIndex = props.tabs.findIndex((t) => t.value === oldTab);
    const newIndex = props.tabs.findIndex((t) => t.value === newTab);
    isMovingForward.value = newIndex > oldIndex;
  }
});

function onTabChange(newValue: string) {
  isTransitioning.value = true;
  const direction = isMovingForward.value ? 'forward' : 'backward';
  emit('tab-change', newValue, direction);
  
  // Wait for transition to complete
  nextTick(() => {
    // Vuetify transitions typically take 300ms
    setTimeout(() => {
      isTransitioning.value = false;
      emit('transition-complete', newValue);
    }, 300);
  });
}

onMounted(() => {
  if (props.modelValue) {
    activeTab.value = props.modelValue;
  }
});
</script>
