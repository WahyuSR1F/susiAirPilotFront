<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps<{
  monthName: string;
  loading?: boolean;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>

<template>
  <div class="month-switcher">
    <button
      type="button"
      class="nav-arrow-btn"
      :disabled="loading"
      aria-label="Previous Month"
      @click="$emit('prev')"
    >
      <ChevronLeft :size="20" />
    </button>

    <div class="month-title-wrap">
      <h3 class="month-title">{{ monthName }}</h3>
      <span v-if="loading" class="loading-indicator">Updating...</span>
    </div>

    <button
      type="button"
      class="nav-arrow-btn"
      :disabled="loading"
      aria-label="Next Month"
      @click="$emit('next')"
    >
      <ChevronRight :size="20" />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.month-switcher {
  @include flex-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  margin-bottom: 14px;
}

.month-title-wrap {
  text-align: center;

  .month-title {
    font-size: 16px;
    font-weight: 800;
    color: $navy;
    letter-spacing: -0.2px;
  }

  .loading-indicator {
    font-size: 10px;
    color: $red;
    font-weight: 600;
    display: block;
  }
}

.nav-arrow-btn {
  @include flex-center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: $bg;
  color: $navy;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: rgba(14, 33, 56, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
