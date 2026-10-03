<script setup lang="ts">
import type { RangeOption } from '~/types/api';

const props = defineProps<{
  modelValue: RangeOption;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: RangeOption): void;
}>();

const options: { label: string; value: RangeOption }[] = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
];

function selectOption(val: RangeOption) {
  if (props.disabled || props.modelValue === val) return;
  emit('update:modelValue', val);
}
</script>

<template>
  <div class="range-toggle-wrapper">
    <div class="range-toggle" role="tablist">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        role="tab"
        :aria-selected="modelValue === opt.value"
        class="toggle-btn"
        :class="{ active: modelValue === opt.value }"
        :disabled="disabled"
        @click="selectOption(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.range-toggle-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.range-toggle {
  display: inline-flex;
  background-color: #E7EBF0;
  padding: 4px;
  border-radius: $radius-pill;
  gap: 2px;
  width: 100%;
}

.toggle-btn {
  flex: 1;
  padding: 8px 0;
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 700;
  color: $text-secondary;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  min-height: 36px;

  &:hover:not(:disabled) {
    color: $navy;
  }

  &.active {
    background-color: $navy;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(14, 33, 56, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
