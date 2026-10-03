<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    class="pill-btn"
    :class="[variant || 'primary', size || 'md', { 'is-loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner"></span>
    <span class="btn-content" :class="{ 'hidden-text': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.pill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-pill;
  font-weight: 700;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  width: 100%;
  cursor: pointer;

  &.sm {
    padding: 8px 16px;
    font-size: 13px;
    min-height: 36px;
  }

  &.md {
    padding: 12px 24px;
    font-size: 15px;
    min-height: 48px;
  }

  &.lg {
    padding: 16px 28px;
    font-size: 16px;
    min-height: 54px;
  }

  &.primary {
    background-color: $red;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(230, 55, 87, 0.28);

    &:hover:not(:disabled) {
      background-color: $red-hover;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(230, 55, 87, 0.36);
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  }

  &.secondary {
    background-color: $navy;
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: $navy-light;
    }
  }

  &.outline {
    background-color: transparent;
    border: 1.5px solid $navy;
    color: $navy;

    &:hover:not(:disabled) {
      background-color: rgba(14, 33, 56, 0.05);
    }
  }

  &.danger {
    background-color: #EF4444;
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .btn-content {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &.hidden-text {
      visibility: hidden;
    }
  }

  .spinner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
