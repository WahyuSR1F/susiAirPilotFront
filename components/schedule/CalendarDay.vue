<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleItem } from '~/types/api';
import { Check } from 'lucide-vue-next';

const props = defineProps<{
  dayNumber: number;
  dateStr: string;
  scheduleItem?: ScheduleItem;
  isToday?: boolean;
  isCurrentMonth?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', dateStr: string): void;
}>();

function isDarkColor(hex: string): boolean {
  if (!hex || !hex.startsWith('#')) return false;
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp < 155;
}

const hasDuty = computed(() => !!props.scheduleItem);
const dutyColor = computed(() => props.scheduleItem?.base_color || 'transparent');
const isDarkDuty = computed(() => (hasDuty.value ? isDarkColor(props.scheduleItem!.base_color) : false));

const cellTextColor = computed(() => {
  if (!props.isCurrentMonth) return '#D1D5DB';
  if (hasDuty.value) {
    return isDarkDuty.value ? '#FFFFFF' : '#0E2138';
  }
  return '#0E2138';
});

function handleClick() {
  if (props.isCurrentMonth && props.dateStr) {
    emit('select', props.dateStr);
  }
}
</script>

<template>
  <button
    type="button"
    class="calendar-day-cell"
    :class="{
      'has-duty': hasDuty,
      'is-today': isToday,
      'not-current-month': !isCurrentMonth,
    }"
    :style="{
      backgroundColor: hasDuty ? dutyColor : 'transparent',
      color: cellTextColor,
    }"
    :disabled="!isCurrentMonth"
    @click="handleClick"
  >
    <!-- Day Number & Today indicator -->
    <div class="day-top">
      <span class="day-number" :class="{ 'today-ring': isToday }">{{ dayNumber }}</span>
    </div>

    <!-- Duty Information (Base code & Duty status) -->
    <div v-if="scheduleItem && isCurrentMonth" class="duty-badge-area">
      <span class="base-code">{{ scheduleItem.base_name }}</span>

      <!-- Duty Status: Checkmark if completed, otherwise remaining duty count -->
      <div
        class="duty-status-indicator"
        :class="{ completed: scheduleItem.completed, remaining: !scheduleItem.completed }"
      >
        <Check v-if="scheduleItem.completed" :size="12" :stroke-width="3" />
        <span v-else class="remaining-count">{{ scheduleItem.remaining }}</span>
      </div>
    </div>
  </button>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.calendar-day-cell {
  aspect-ratio: 1 / 1.15;
  border-radius: 10px;
  border: 1px solid rgba(14, 33, 56, 0.06);
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  background-color: #ffffff;
  cursor: pointer;
  min-height: 48px;

  &:hover:not(:disabled) {
    transform: scale(1.04);
    z-index: 2;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  &.not-current-month {
    background-color: transparent !important;
    border-color: transparent !important;
    cursor: default;
    opacity: 0.25;
  }

  &.is-today {
    outline: 2px solid $navy;
    outline-offset: 1px;
    font-weight: 800;

    .day-number {
      position: relative;
    }
  }

  &.has-duty {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
}

.day-top {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 1px 2px 0;

  .day-number {
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }
}

.duty-badge-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: auto;

  .base-code {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    line-height: 1;
    opacity: 0.95;
  }

  .duty-status-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    @include flex-center;
    background-color: rgba(255, 255, 255, 0.88);
    color: $navy;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);

    &.completed {
      background-color: rgba(255, 255, 255, 0.95);
      color: #0E8560;
    }

    .remaining-count {
      font-size: 9px;
      font-weight: 800;
      color: $navy;
      line-height: 1;
    }
  }
}
</style>
