<script setup lang="ts">
import { useFlightHoursStore } from '~/stores/flightHours';
import LimitCard from './LimitCard.vue';
import Skeleton from '~/components/ui/Skeleton.vue';

const flightHoursStore = useFlightHoursStore();
</script>

<template>
  <div class="limit-cards-section">
    <div class="section-title-row">
      <h3 class="section-title">Hours to Limit</h3>
      <span class="reg-note">DGCA Regulations</span>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="flightHoursStore.loading && flightHoursStore.cards.length === 0" class="cards-grid">
      <div v-for="i in 4" :key="i" class="card-skeleton">
        <Skeleton width="60px" height="12px" radius="4px" />
        <Skeleton width="100px" height="24px" radius="6px" style="margin: 8px 0;" />
        <Skeleton width="100%" height="6px" radius="3px" />
      </div>
    </div>

    <!-- Active Cards Grid -->
    <div v-else class="cards-grid">
      <LimitCard
        v-for="card in flightHoursStore.cards"
        :key="card.key"
        :card="card"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.limit-cards-section {
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

  .reg-note {
    font-size: 11px;
    color: $text-secondary;
    font-weight: 600;
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card-skeleton {
  @include card-surface;
  padding: 14px;
}
</style>
