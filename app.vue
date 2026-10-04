<script setup lang="ts">
// Susi Air Pilot App Root
</script>

<template>
  <div class="app-wrapper">
    <!-- Inject <link rel="manifest"> untuk PWA (disediakan @vite-pwa/nuxt) -->
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
