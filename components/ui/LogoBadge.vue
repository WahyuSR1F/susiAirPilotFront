<script setup lang="ts">
interface Props {
  /** dark = untuk header navy, light = untuk halaman terang (login) */
  variant?: 'dark' | 'light';
  /** sm = header halaman, md = halaman login */
  size?: 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  variant: 'dark',
  size: 'sm',
});
</script>

<template>
  <div class="logo-badge" :class="[`badge-${variant}`, `badge-${size}`]">
    <!-- Asset official: background putih solid, jadi badge ikut putih supaya mulus -->
    <img src="/susi-air-logo.png" alt="Susi Air" class="badge-logo" />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;

.logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-pill;
  background-color: #ffffff; /* sama persis dengan background PNG */
  line-height: 1;
  flex-shrink: 0;
}

.badge-logo {
  display: block;
  width: auto;
}

/* ---- sizes: lebar, mirip badge ---- */
.badge-sm {
  padding: 8px 18px;

  .badge-logo {
    height: 26px;
  }
}

.badge-md {
  padding: 14px 26px;

  .badge-logo {
    height: 38px;
  }
}

/* ---- variants ---- */
.badge-dark {
  box-shadow:
    0 6px 18px rgba(8, 20, 36, 0.35),
    inset 0 0 0 1px rgba(14, 33, 56, 0.06);
}

.badge-light {
  border: 1px solid rgba(14, 33, 56, 0.08);
  box-shadow: $shadow-card;
}
</style>
