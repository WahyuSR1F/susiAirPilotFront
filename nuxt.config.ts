// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],
  css: ['~/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Susi Air Pilot App',
      short_name: 'Susi Air Pilot',
      description:
        'Susi Air Pilot duty schedule, flight hours, and regulatory limit tracking.',
      lang: 'en',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#F5F6F8',
      theme_color: '#0E2138',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Precache seluruh aset build (shell aplikasi) untuk mode offline
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      cleanupOutdatedCaches: true,
      // ssr:false -> tidak ada index.html statis, jadi navigateFallback
      // ke index.html harus dimatikan (tidak ada di precache = error saat runtime)
      navigateFallback: null,
      // API tidak boleh di-cache: data operasional harus selalu segar
      runtimeCaching: [
        {
          // Navigasi SPA: coba jaringan dulu, fallback ke cache saat offline
          urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'spa-shell',
            networkTimeoutSeconds: 4,
            expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'google-fonts-stylesheets' },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            cacheableResponse: { statuses: [0, 200] },
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
      ],
    },
    client: {
      // Auto-restart saat versi baru sudah terpasang
      registerPrompt: { enabled: false },
    },
    devOptions: {
      // Aktif di dev: manifest & service worker diserve oleh dev server,
      // jadi PWA bisa dites langsung (install/offline) tanpa error manifest
      enabled: true,
    },
  },
  app: {
    head: {
      title: 'Susi Air Pilot App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#0E2138' },
        { name: 'description', content: 'Susi Air Pilot Duty, Flight Hours, and Limits Management' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Susi Air Pilot' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/pwa-192x192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },
  vite: {
    server: {
      hmr: {
        // Layar merah (error overlay) tidak ditampilkan saat dev;
        // error tetap terlihat di console browser dan terminal dev server
        overlay: false,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/tokens" as *; @use "~/assets/scss/mixins" as *;',
        },
      },
    },
  },
});
