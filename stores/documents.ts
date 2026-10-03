import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DocumentItem, DocumentsResponse } from '~/types/api';
import { useApi, normalizeErrorMessage } from '~/composables/useApi';

export const useDocumentsStore = defineStore('documents', () => {
  const items = ref<DocumentItem[]>([]);
  const today = ref<string>('2026-05-15');
  const warningDays = ref<number>(30);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    const { apiFetch } = useApi();

    try {
      const data = await apiFetch<DocumentsResponse>('/documents');
      items.value = data.items;
      today.value = data.today;
      warningDays.value = data.warningDays;
    } catch (err: any) {
      error.value = normalizeErrorMessage(err);
    } finally {
      loading.value = false;
    }
  }

  const actionRequiredDocs = computed(() => {
    return items.value.filter(doc => doc.status === 'expired' || doc.status === 'soon');
  });

  return {
    items,
    today,
    warningDays,
    loading,
    error,
    actionRequiredDocs,
    fetchAll,
  };
});
