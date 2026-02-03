<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom">
    <template #activator="{ props }">
      <v-text-field
        ref="activatorRef"
        v-bind="props"
        :readonly="menuOpen"
        v-model="inputValue"
        :placeholder="placeholder"
        hide-details
        density="comfortable"
        @blur="parseInput"
        @keydown.enter.prevent="onActivatorEnter"
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
const inputValue = ref('');

const pad = (n: number) => String(n).padStart(2, '0');
const DATE_TIME_RE = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}))?$/;

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

watch(menuOpen, (open) => !open && nextTick(() => activatorRef.value?.focus?.()));

const displayValue = computed(() => {
  const d = value.value;
  return !d ? '' : `${d.year}-${pad(d.month)}-${pad(d.day)} ${pad(d.hour)}:${pad(d.minute)}`;
});

watch(value, () => (inputValue.value = displayValue.value), { immediate: true });

function parseInput() {
  const s = inputValue.value.trim();
  if (!s) {
    model.value = null;
    return;
  }
  const m = DATE_TIME_RE.exec(s);
  if (!m) {
    inputValue.value = displayValue.value;
    return;
  }
  const [, y, mo, d, h, mi] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h ?? 0), Number(mi ?? 0), 0, 0);
  if (isNaN(date.getTime())) {
    inputValue.value = displayValue.value;
    return;
  }
  model.value = dateToDateTime(date);
}

function onActivatorEnter() {
  parseInput();
  menuOpen.value = true;
}
</script>
  