import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ScheduleItem, ScheduleLegendItem, SchedulesResponse } from '~/types/api';
import { useApi, normalizeErrorMessage } from '~/composables/useApi';

export const useScheduleStore = defineStore('schedule', () => {
  const year = ref<number>(2026);
  const month = ref<number>(5);
  const today = ref<string>('2026-05-15');
  const items = ref<ScheduleItem[]>([]);
  const legend = ref<ScheduleLegendItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const itemsByDate = computed(() => {
    const map = new Map<string, ScheduleItem>();
    for (const item of items.value) {
      map.set(item.duty_date, item);
    }
    return map;
  });

  const monthName = computed(() => {
    const date = new Date(year.value, month.value - 1, 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });

  async function fetchMonth(y?: number, m?: number) {
    if (y !== undefined) year.value = y;
    if (m !== undefined) month.value = m;

    loading.value = true;
    error.value = null;
    const { apiFetch } = useApi();

    try {
      const data = await apiFetch<SchedulesResponse>('/schedules', {
        query: {
          year: year.value,
          month: month.value,
        },
      });

      items.value = data.items;
      legend.value = data.legend;
      today.value = data.today;
      year.value = data.year;
      month.value = data.month;
    } catch (err: any) {
      error.value = normalizeErrorMessage(err);
    } finally {
      loading.value = false;
    }
  }

  function nextMonth() {
    if (loading.value) return;
    if (month.value === 12) {
      year.value++;
      month.value = 1;
    } else {
      month.value++;
    }
    fetchMonth(year.value, month.value);
  }

  function prevMonth() {
    if (loading.value) return;
    if (month.value === 1) {
      year.value--;
      month.value = 12;
    } else {
      month.value--;
    }
    fetchMonth(year.value, month.value);
  }

  return {
    year,
    month,
    today,
    items,
    legend,
    loading,
    error,
    monthName,
    itemsByDate,
    fetchMonth,
    nextMonth,
    prevMonth,
  };
});
