<script setup lang="ts">
import { computed } from 'vue';
import type { LimitCardData } from '~/types/api';

const props = defineProps<{
  card: LimitCardData;
}>();

const barColorClass = computed(() => {
  if (props.card.overLimit || props.card.hours > props.card.limit) {
    return 'danger';
  }
  if (props.card.percent >= 80) {
    return 'warning';
  }
  return 'success';
});

const progressWidth = computed(() => {
  return `${Math.min(Math.max(props.card.percent, 0), 100)}%`;
});
</script>

<template>
  <div class="limit-card" :class="[{ 'is-over-limit': card.overLimit }]">
    <div class="card-head">
      <span class="card-label">{{ card.label }}</span>
      <span v-if="card.overLimit" class="over-badge">EXCEEDED</span>
    </div>

    <div class="card-hours-row">
      <span class="hours-val">{{ card.hours.toFixed(1) }}</span>
      <span class="limit-val">/ {{ card.limit }} h</span>
    </div>

    <div class="progress-track" role="progressbar" :aria-valuenow="card.percent" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill" :class="barColorClass" :style="{ width: progressWidth }"></div>
    </div>

    <div class="card-footer">
      <span class="percent-label" :class="barColorClass">{{ card.percent.toFixed(0) }}%</span>
      <span class="window-label">{{ card.windowDays === 1 ? 'Today' : `Last ${card.windowDays}d` }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.limit-card {
  @include card-surface;
  padding: 14px 14px 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #ffffff;

  &.is-over-limit {
    border-color: rgba(230, 55, 87, 0.35);
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF5F6 100%);
  }
}

.card-head {
  @include flex-between;
  margin-bottom: 6px;

  .card-label {
    font-size: 12px;
    font-weight: 600;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .over-badge {
    font-size: 9px;
    font-weight: 800;
    color: #ffffff;
    background-color: $danger;
    padding: 2px 6px;
    border-radius: $radius-pill;
    letter-spacing: 0.4px;
  }
}

.card-hours-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 10px;

  .hours-val {
    font-size: 20px;
    font-weight: 800;
    color: $text-primary;
    line-height: 1;
  }

  .limit-val {
    font-size: 11px;
    font-weight: 600;
    color: $text-muted;
  }
}

.progress-track {
  width: 100%;
  height: 6px;
  background-color: $border-light;
  border-radius: $radius-pill;
  overflow: hidden;
  margin-bottom: 8px;

  .progress-fill {
    height: 100%;
    border-radius: $radius-pill;
    transition: width 0.4s ease;

    &.success {
      background-color: $success;
    }

    &.warning {
      background-color: $warning;
    }

    &.danger {
      background-color: $danger;
    }
  }
}

.card-footer {
  @include flex-between;
  font-size: 11px;

  .percent-label {
    font-weight: 700;

    &.success {
      color: $success;
    }

    &.warning {
      color: $warning;
    }

    &.danger {
      color: $danger;
    }
  }

  .window-label {
    color: $text-secondary;
    font-size: 10px;
  }
}
</style>
