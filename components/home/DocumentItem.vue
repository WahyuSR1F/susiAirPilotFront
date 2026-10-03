<script setup lang="ts">
import { computed } from 'vue';
import type { DocumentItem } from '~/types/api';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-vue-next';

const props = defineProps<{
  document: DocumentItem;
}>();

function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[parseInt(m, 10) - 1] || '';
  return `${parseInt(d, 10)} ${monthName} ${y}`;
}

const badgeText = computed(() => {
  const days = props.document.daysRemaining;
  if (props.document.status === 'expired') {
    const absDays = Math.abs(days);
    return absDays === 0 ? 'Expired today' : `Expired ${absDays}d ago`;
  }
  if (props.document.status === 'soon') {
    return `${days}d left`;
  }
  return `${days} days`;
});

const statusIcon = computed(() => {
  switch (props.document.status) {
    case 'expired':
      return AlertCircle;
    case 'soon':
      return Clock;
    default:
      return ShieldCheck;
  }
});
</script>

<template>
  <div class="doc-item" :class="document.status">
    <div class="doc-main">
      <h5 class="doc-label">{{ document.label }}</h5>
      <span class="doc-date">Expires {{ formatFullDate(document.expiryDate) }}</span>
    </div>

    <div class="doc-badge" :class="document.status">
      <component :is="statusIcon" :size="13" class="badge-icon" />
      <span>{{ badgeText }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.doc-item {
  @include flex-between;
  padding: 12px 14px;
  background-color: #ffffff;
  border-radius: $radius-md;
  border: 1px solid rgba(14, 33, 56, 0.05);
  transition: all 0.2s ease;

  &.expired {
    border-left: 3.5px solid $danger;
  }

  &.soon {
    border-left: 3.5px solid $warning;
  }

  &.safe {
    border-left: 3.5px solid $success;
  }

  &:hover {
    box-shadow: $shadow-sm;
  }
}

.doc-main {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .doc-label {
    font-size: 13px;
    font-weight: 700;
    color: $navy;
    line-height: 1.3;
  }

  .doc-date {
    font-size: 11px;
    color: $text-secondary;
  }
}

.doc-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: $radius-pill;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;

  &.safe {
    background-color: $success-bg;
    color: #0E8560;
  }

  &.soon {
    background-color: $warning-bg;
    color: #B45309;
  }

  &.expired {
    background-color: $danger-bg;
    color: $danger;
  }

  .badge-icon {
    flex-shrink: 0;
  }
}
</style>
