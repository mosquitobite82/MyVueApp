<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom">
    <template #activator="{ props }">
      <v-text-field
        v-bind="props"
        readonly
        :model-value="displayValue"
        :placeholder="placeholder"
        hide-details
        density="comfortable"
      />
    </template>
    <div class="d-flex flex-column flex-sm-row">  
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
import { ref, computed } from 'vue';

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

function normalizeToDateTime(v: DateTime | Date | null | undefined): DateTime | null {
  if (v == null) return null;
  return v instanceof Date ? dateToDateTime(v) : v;
}

/** Current value: model if set, otherwise initialValue (normalized to DateTime). */
const value = computed<DateTime | null>(
  () => model.value ?? normalizeToDateTime(props.initialValue) ?? null,
);

/** Value as Date for Vuetify pickers (they expect Date). */
const valueAsDate = computed<Date | null>(() => (value.value ? dateTimeToDate(value.value) : null));

const pad = (n: number) => String(n).padStart(2, '0');

function dateTimeToDate(d: DateTime): Date {
  return new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second, 0);
}

function dateToDateTime(d: Date): DateTime {
  const month = d.getMonth() + 1;
  return {
    year: d.getFullYear(),
    month: month as DateTime['month'],
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
  };
}

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

function onDate(v: Date | null) {
  const current = valueAsDate.value;
  const merged = merge(v, current);
  model.value = merged ? dateToDateTime(merged) : null;
}

function onTime(v: Date | string | null) {
  if (v == null) return;
  const current = valueAsDate.value ?? new Date();
  const merged = merge(current, toTimeDate(v));
  model.value = merged ? dateToDateTime(merged) : null;
}

const displayValue = computed(() => {
  const d = value.value;
  if (!d) return '';
  return `${d.year}-${pad(d.month)}-${pad(d.day)} ${pad(d.hour)}:${pad(d.minute)}`;
});
</script>
  