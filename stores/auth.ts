import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PilotProfile, LoginResponse } from '~/types/api';
import { useApi, normalizeErrorMessage } from '~/composables/useApi';

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>('susi_air_token', {
    maxAge: 86400 * 7,
    sameSite: 'lax',
  });
  const token = ref<string | null>(tokenCookie.value);
  const pilot = ref<PilotProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  if (process.client && !token.value) {
    const local = localStorage.getItem('susi_air_token');
    if (local) {
      token.value = local;
      tokenCookie.value = local;
    }
  }

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: { username: string; password: string }) {
    loading.value = true;
    error.value = null;
    const { apiFetch } = useApi();

    try {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
      });

      const receivedToken = response.accessToken || response.access_token || '';
      token.value = receivedToken;
      tokenCookie.value = receivedToken;
      if (process.client) {
        localStorage.setItem('susi_air_token', receivedToken);
      }

      await fetchProfile();
      return { success: true };
    } catch (err: any) {
      const msg = normalizeErrorMessage(err);
      error.value = msg;
      return { success: false, error: msg };
    } finally {
      loading.value = false;
    }
  }

  async function fetchProfile() {
    if (!token.value) return;
    const { apiFetch } = useApi();

    try {
      const profile = await apiFetch<PilotProfile>('/pilot/me');
      pilot.value = profile;
    } catch (err) {
      // Handled by 401 interceptor in useApi if unauthorized
    }
  }

  function logout() {
    token.value = null;
    tokenCookie.value = null;
    pilot.value = null;
    if (process.client) {
      localStorage.removeItem('susi_air_token');
    }
    navigateTo('/login');
  }

  return {
    token,
    pilot,
    loading,
    error,
    isAuthenticated,
    login,
    fetchProfile,
    logout,
  };
});
