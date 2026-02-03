<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom">
    <template #activator="{ props }">
      <v-text-field
        ref="activatorRef"
        v-bind="props"
        readonly
        :model-value="displayValue"
        :placeholder="placeholder"
        hide-details
        density="comfortable"
        @keydown.enter.prevent="menuOpen = true"
      />
    </template>
    <div
      class="d-flex flex-column flex-sm-row"
      @keydown.enter.prevent="closeMenu"
    >
      <v-date-picker
        :model-value="valueAsDate"
        @update:model-value="onDate"
        hide-header
      />
      <v-time-picker
        :model-value="valueAsDate"
        @update:model-value="onTime"
        format="24hr"
      />
    </div>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type DateTime = {
  year: number;
  month: Month;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const model = defineModel<DateTime | null>({ default: null });
const props = defineProps<{
  placeholder?: string;
  initialValue?: DateTime | Date | null;
}>();

const menuOpen = ref(false);
const activatorRef = ref<{ focus?: () => void } | null>(null);

const pad = (n: number) => String(n).padStart(2, '0');

function dateTimeToDate(d: DateTime): Date {
  return new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second, 0);
}

function dateToDateTime(d: Date): DateTime {
  const m = d.getMonth() + 1;
  return {
    year: d.getFullYear(),
    month: m as DateTime['month'],
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
  };
}

function toDateTime(v: DateTime | Date | null | undefined): DateTime | null {
  if (v == null) return null;
  return v instanceof Date ? dateToDateTime(v) : v;
}

const value = computed<DateTime | null>(
  () => model.value ?? toDateTime(props.initialValue) ?? null,
);
const valueAsDate = computed<Date | null>(() =>
  value.value ? dateTimeToDate(value.value) : null,
);

function merge(date: Date | null, time: Date | null): Date | null {
  if (!date) return time;
  if (!time) return date;
  const d = new Date(date);
  d.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
  return d;
}

function toTimeDate(v: Date | string): Date {
  if (v instanceof Date) return v;
  const [h = 0, m = 0, s = 0] = v.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, s, 0);
  return d;
}

function commit(merged: Date | null) {
  model.value = merged ? dateToDateTime(merged) : null;
}

function onDate(v: Date | null) {
  commit(merge(v, valueAsDate.value));
}

function onTime(v: Date | string | null) {
  if (v != null) commit(merge(valueAsDate.value ?? new Date(), toTimeDate(v)));
}

function closeMenu() {
  nextTick(() => (menuOpen.value = false));
}

watch(menuOpen, (open) => {
  if (!open) nextTick(() => activatorRef.value?.focus?.());
});

const displayValue = computed(() => {
  const d = value.value;
  return d ? `${d.year}-${pad(d.month)}-${pad(d.day)} ${pad(d.hour)}:${pad(d.minute)}` : '';
});
</script>
  