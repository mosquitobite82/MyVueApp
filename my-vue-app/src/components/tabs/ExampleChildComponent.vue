<template>
  <v-sheet class="pa-5" :color="color">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-chip :color="isActive ? 'success' : 'default'" class="mb-2">
          {{ isActive ? 'Active' : 'Inactive' }}
        </v-chip>
        <v-chip :color="isTransitioning ? 'warning' : 'default'" class="mb-2 ml-2">
          {{ isTransitioning ? 'Transitioning' : 'Static' }}
        </v-chip>
        <v-chip v-if="wasPrevious" color="info" class="mb-2 ml-2">
          Was Previous
        </v-chip>

        <v-list>
          <v-list-item>
            <v-list-item-title>Activation Count</v-list-item-title>
            <v-list-item-subtitle>{{ activationCount }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Transition Count</v-list-item-title>
            <v-list-item-subtitle>{{ transitionCount }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Last Event</v-list-item-title>
            <v-list-item-subtitle>{{ lastEvent || 'None' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <slot />
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTabPanel } from './useTabPanel';

const props = withDefaults(
  defineProps<{
    value: string;
    title: string;
    color?: string;
  }>(),
  {
    color: 'grey-lighten-4',
  }
);

const activationCount = ref(0);
const transitionCount = ref(0);
const lastEvent = ref('');

const { isActive, isTransitioning, wasPrevious } = useTabPanel({
  value: props.value,
  onActivated: () => {
    activationCount.value++;
    lastEvent.value = 'Activated';
    console.log(`[${props.title}] Activated`);
  },
  onDeactivated: () => {
    lastEvent.value = 'Deactivated';
    console.log(`[${props.title}] Deactivated`);
  },
  onTransitionStart: () => {
    lastEvent.value = 'Transition Started';
    console.log(`[${props.title}] Transition Started`);
  },
  onTransitionComplete: () => {
    transitionCount.value++;
    lastEvent.value = 'Transition Complete';
    console.log(`[${props.title}] Transition Complete`);
  },
});
</script>
