<script setup lang="ts">
import { onMounted } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import { usePilotStore } from '~/stores/pilot';
import { useFlightHoursStore } from '~/stores/flightHours';
import { useDocumentsStore } from '~/stores/documents';

import HomeHeader from '~/components/home/HomeHeader.vue';
import LimitCards from '~/components/home/LimitCards.vue';
import TrendChart from '~/components/home/TrendChart.vue';
import DocumentList from '~/components/home/DocumentList.vue';

const pilotStore = usePilotStore();
const flightHoursStore = useFlightHoursStore();
const documentsStore = useDocumentsStore();

onMounted(async () => {
  // Fetch home screen data concurrently
  await Promise.allSettled([
    pilotStore.fetchMe(),
    flightHoursStore.fetchSummary(),
    documentsStore.fetchAll(),
  ]);
});
</script>

<template>
  <div class="home-page">
    <!-- Header with Pilot Profile & Total Hours -->
    <HomeHeader />

    <!-- Document Warning Banner -->
    <div v-if="documentsStore.actionRequiredDocs.length > 0" class="action-banner">
      <div class="banner-icon-wrap">
        <AlertTriangle :size="18" />
      </div>
      <div class="banner-content">
        <h4 class="banner-title">Document Action Required</h4>
        <p class="banner-text">
          You have {{ documentsStore.actionRequiredDocs.length }} document(s) that are expired or expiring soon. Please renew them before your next flight.
        </p>
      </div>
    </div>

    <!-- Hours to Limit Section: 4 Summary Cards -->
    <LimitCards />

    <!-- Flight Hours Trend Chart with Range Toggle -->
    <TrendChart />

    <!-- Pilot Expiry Documents -->
    <DocumentList />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;

.home-page {
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
}

.action-banner {
  margin: 20px 20px 0;
  padding: 12px 16px;
  background-color: $danger-bg;
  border-left: 4px solid $danger;
  border-radius: $radius-md;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  .banner-icon-wrap {
    color: $danger;
    margin-top: 2px;
  }

  .banner-content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .banner-title {
      font-size: 13px;
      font-weight: 800;
      color: $danger;
      letter-spacing: -0.2px;
    }

    .banner-text {
      font-size: 12px;
      color: #991B1B; /* Dark red for better readability */
      line-height: 1.4;
    }
  }
}
</style>
