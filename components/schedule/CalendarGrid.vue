<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { ScheduleItem } from '~/types/api';
import CalendarDay from './CalendarDay.vue';
import Skeleton from '~/components/ui/Skeleton.vue';

const props = defineProps<{
  year: number;
  month: number;
  todayDateStr: string;
  itemsByDate: Map<string, ScheduleItem>;
  loading?: boolean;
}>();

const router = useRouter();

const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DayCell {
  dayNumber: number;
  dateStr: string;
  isCurrentMonth: boolean;
  scheduleItem?: ScheduleItem;
  isToday: boolean;
}

const calendarDays = computed<DayCell[]>(() => {
  const y = props.year;
  const m = props.month - 1; // 0-indexed for JS Date

  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  // Day of week: 0 (Sun), 1 (Mon), ... 6 (Sat)
  // We want Monday as start: 0 = Mon, 6 = Sun
  let startOffset = (firstDay.getDay() + 6) % 7;

  const totalDays = lastDay.getDate();
  const cells: DayCell[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(y, m, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    cells.push({
      dayNumber: d,
      dateStr: '',
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const monthPadded = String(props.month).padStart(2, '0');
    const dayPadded = String(d).padStart(2, '0');
    const dateStr = `${y}-${monthPadded}-${dayPadded}`;
    const scheduleItem = props.itemsByDate.get(dateStr);
    const isToday = dateStr === props.todayDateStr;

    cells.push({
      dayNumber: d,
      dateStr,
      isCurrentMonth: true,
      scheduleItem,
      isToday,
    });
  }

  // Trailing next month days to complete 7-col grid row
  const remainingInWeek = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remainingInWeek; d++) {
    cells.push({
      dayNumber: d,
      dateStr: '',
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return cells;
});

function handleDateSelect(dateStr: string) {
  router.push(`/schedule/${dateStr}`);
}
</script>

<template>
  <div class="calendar-card">
    <!-- Day Header (Mon - Sun) -->
    <div class="weekday-header">
      <span v-for="w in weekDayNames" :key="w" class="weekday-label">{{ w }}</span>
    </div>

    <!-- Skeleton Grid -->
    <div v-if="loading" class="calendar-grid skeleton-grid">
      <div v-for="i in 35" :key="i" class="day-skeleton">
        <Skeleton width="100%" height="100%" radius="10px" />
      </div>
    </div>

    <!-- Active Days Grid -->
    <div v-else class="calendar-grid">
      <CalendarDay
        v-for="(cell, idx) in calendarDays"
        :key="idx"
        :day-number="cell.dayNumber"
        :date-str="cell.dateStr"
        :schedule-item="cell.scheduleItem"
        :is-today="cell.isToday"
        :is-current-month="cell.isCurrentMonth"
        @select="handleDateSelect"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.calendar-card {
  @include card-surface;
  padding: 16px 12px;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;

  .weekday-label {
    font-size: 11px;
    font-weight: 700;
    color: $text-secondary;
    text-transform: uppercase;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;

  &.skeleton-grid {
    .day-skeleton {
      aspect-ratio: 1 / 1.15;
    }
  }
}
</style>
