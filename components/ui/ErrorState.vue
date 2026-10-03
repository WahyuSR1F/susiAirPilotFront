<script setup lang="ts">
import { AlertCircle, RefreshCw } from 'lucide-vue-next';

defineProps<{
  title?: string;
  message: string;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<template>
  <div class="error-container">
    <div class="icon-wrap">
      <AlertCircle :size="32" />
    </div>
    <h4 class="error-title">{{ title || 'Failed to load data' }}</h4>
    <p class="error-message">{{ message }}</p>
    <button class="retry-btn" @click="$emit('retry')">
      <RefreshCw :size="16" />
      <span>Retry</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.error-container {
  @include card-surface;
  padding: 24px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 12px 0;

  .icon-wrap {
    color: $danger;
    margin-bottom: 4px;
  }

  .error-title {
    font-size: 15px;
    font-weight: 700;
    color: $text-primary;
  }

  .error-message {
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.4;
    max-width: 320px;
  }

  .retry-btn {
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: $radius-pill;
    background-color: rgba(230, 55, 87, 0.1);
    color: $danger;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(230, 55, 87, 0.18);
    }
  }
}
</style>
