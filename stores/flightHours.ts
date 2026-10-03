import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RangeOption, FlightHoursSummaryResponse } from '~/types/api';
import { useApi, normalizeErrorMessage } from '~/composables/useApi';

export const useFlightHoursStore = defineStore('flightHours', () => {
  const range = ref<RangeOption>('1w');
  const summary = ref<FlightHoursSummaryResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  let activeRequestId = 0;

  const cards = computed(() => summary.value?.cards || []);
  const series = computed(() => summary.value?.series || []);
  const limit = computed(() => summary.value?.limit || 40);
  const yMax = computed(() => summary.value?.yMax || 45);
  const today = computed(() => summary.value?.today || '2026-05-15');

  async function fetchSummary(targetRange?: RangeOption) {
    if (targetRange) {
      range.value = targetRange;
    }

    const currentReq = ++activeRequestId;
    loading.value = true;
    error.value = null;

    const { apiFetch } = useApi();

    try {
      const data = await apiFetch<FlightHoursSummaryResponse>('/flight-hours/summary', {
        query: { range: range.value },
      });

      // Avoid race conditions if user switched ranges quickly
      if (currentReq === activeRequestId) {
        summary.value = data;
      }
    } catch (err: any) {
      if (currentReq === activeRequestId) {
        error.value = normalizeErrorMessage(err);
      }
    } finally {
      if (currentReq === activeRequestId) {
        loading.value = false;
      }
    }
  }

  function setRange(newRange: RangeOption) {
    if (range.value === newRange && summary.value) return;
    fetchSummary(newRange);
  }

  return {
    range,
    summary,
    loading,
    error,
    cards,
    series,
    limit,
    yMax,
    today,
    fetchSummary,
    setRange,
  };
});
