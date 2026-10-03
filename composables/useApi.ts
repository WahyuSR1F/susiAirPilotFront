import type { ApiErrorResponse } from '~/types/api';

export function normalizeErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred';
  if (err.data) {
    const data = err.data as ApiErrorResponse;
    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string') {
      return data.message;
    }
  }
  if (err.message) {
    if (err.message.includes('fetch failed') || err.message.includes('ECONNREFUSED')) {
      return 'Cannot reach server. Please ensure the backend service is running.';
    }
    return err.message;
  }
  return 'Connection error. Please try again.';
}

export function useApi() {
  const config = useRuntimeConfig();
  const tokenCookie = useCookie<string | null>('susi_air_token');

  async function apiFetch<T>(endpoint: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string> || {}),
    };

    let token = null;
    if (process.client) {
      token = localStorage.getItem('susi_air_token');
    }
    if (!token) {
      token = tokenCookie.value;
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await $fetch<T>(endpoint, {
        baseURL: config.public.apiBase,
        ...options,
        headers,
      });
      return response;
    } catch (err: any) {
      if (err?.status === 401 && !endpoint.includes('/auth/login')) {
        tokenCookie.value = null;
        if (process.client) {
          localStorage.removeItem('susi_air_token');
          navigateTo('/login');
        }
      }
      throw err;
    }
  }

  return {
    apiFetch,
    normalizeErrorMessage,
  };
}
