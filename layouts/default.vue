<script setup lang="ts">
import BottomNav from '~/components/ui/BottomNav.vue';
</script>

<template>
  <div class="layout-default">
    <main class="page-content">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<style scoped lang="scss">
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}
</style>
