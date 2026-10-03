<script setup lang="ts">
defineProps<{
  padding?: string;
}>();
</script>

<template>
  <div class="app-card" :style="{ padding: padding || '16px' }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.app-card {
  @include card-surface;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
