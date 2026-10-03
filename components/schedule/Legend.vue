<script setup lang="ts">
import type { ScheduleLegendItem } from '~/types/api';

defineProps<{
  legend: ScheduleLegendItem[];
}>();
</script>

<template>
  <div class="schedule-legend-card">
    <h4 class="legend-title">Duty Types Legend</h4>
    <div class="legend-grid">
      <div v-for="item in legend" :key="item.code" class="legend-item">
        <div class="color-swatch" :style="{ backgroundColor: item.color }"></div>
        <div class="legend-labels">
          <span class="legend-code">{{ item.code }}</span>
          <span class="legend-name">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.schedule-legend-card {
  @include card-surface;
  padding: 16px;
  margin-top: 16px;
}

.legend-title {
  font-size: 13px;
  font-weight: 700;
  color: $navy;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .color-swatch {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    flex-shrink: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  .legend-labels {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .legend-code {
      font-size: 11px;
      font-weight: 800;
      color: $navy;
      line-height: 1.1;
    }

    .legend-name {
      font-size: 10px;
      color: $text-secondary;
      @include truncate;
    }
  }
}
</style>
