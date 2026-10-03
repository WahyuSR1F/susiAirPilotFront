import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PilotProfile } from '~/types/api';
import { useApi, normalizeErrorMessage } from '~/composables/useApi';

export const usePilotStore = defineStore('pilot', () => {
  const profile = ref<PilotProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const greeting = computed(() => 'Welcome back,');

  const formattedHours = computed(() => {
    if (!profile.value) return '0.0';
    return Number(profile.value.totalFlightHours).toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  });

  const pilotInitials = computed(() => {
    if (!profile.value?.name) return 'CP';
    const parts = profile.value.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  });

  async function fetchMe() {
    loading.value = true;
    error.value = null;
    const { apiFetch } = useApi();

    try {
      const data = await apiFetch<PilotProfile>('/pilot/me');
      profile.value = data;
    } catch (err: any) {
      error.value = normalizeErrorMessage(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    profile,
    loading,
    error,
    greeting,
    formattedHours,
    pilotInitials,
    fetchMe,
  };
});
