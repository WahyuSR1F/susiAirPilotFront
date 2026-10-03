<script setup lang="ts">
import { useDocumentsStore } from '~/stores/documents';
import DocumentItem from './DocumentItem.vue';
import Skeleton from '~/components/ui/Skeleton.vue';
import ErrorState from '~/components/ui/ErrorState.vue';

const documentsStore = useDocumentsStore();

function retry() {
  documentsStore.fetchAll();
}
</script>

<template>
  <div class="documents-section">
    <div class="section-title-row">
      <h3 class="section-title">My Documents</h3>
      <span class="threshold-tag">30-day warning threshold</span>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="documentsStore.error"
      title="Failed to load documents"
      :message="documentsStore.error"
      @retry="retry"
    />

    <!-- Skeleton Loading -->
    <div v-else-if="documentsStore.loading && documentsStore.items.length === 0" class="docs-list">
      <div v-for="i in 3" :key="i" class="doc-skeleton">
        <Skeleton width="160px" height="14px" radius="4px" />
        <Skeleton width="90px" height="12px" radius="4px" style="margin-top: 6px;" />
      </div>
    </div>

    <!-- Document Items -->
    <div v-else class="docs-list">
      <DocumentItem
        v-for="doc in documentsStore.items"
        :key="doc.id"
        :document="doc"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.documents-section {
  padding: 20px 20px 0;
}

.section-title-row {
  @include flex-between;
  margin-bottom: 12px;

  .section-title {
    font-size: 16px;
    font-weight: 800;
    color: $navy;
    letter-spacing: -0.2px;
  }

  .threshold-tag {
    font-size: 11px;
    color: $text-secondary;
    font-weight: 500;
  }
}

.docs-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.doc-skeleton {
  @include card-surface;
  padding: 14px;
}
</style>
