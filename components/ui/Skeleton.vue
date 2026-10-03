<script setup lang="ts">
defineProps<{
  width?: string;
  height?: string;
  radius?: string;
}>();
</script>

<template>
  <div
    class="skeleton-box"
    :style="{
      width: width || '100%',
      height: height || '20px',
      borderRadius: radius || '8px',
    }"
  ></div>
</template>

<style scoped lang="scss">
.skeleton-box {
  background: linear-gradient(90deg, #ECEFF3 25%, #F7F8FA 50%, #ECEFF3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
