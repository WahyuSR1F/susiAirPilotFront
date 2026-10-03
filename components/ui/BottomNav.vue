<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Home, Calendar, BookOpen, MoreHorizontal } from 'lucide-vue-next';
import { useDocumentsStore } from '~/stores/documents';

const route = useRoute();
const documentsStore = useDocumentsStore();

// Number of documents needing action (expired or soon) — drives the badge on Home
const docAlertCount = computed(() => documentsStore.actionRequiredDocs.length);

const navItems = computed(() => [
  {
    label: 'Home',
    path: '/',
    icon: Home,
    exact: true,
    badge: docAlertCount.value > 0 ? docAlertCount.value : 0,
  },
  { label: 'Schedule', path: '/schedule', icon: Calendar, exact: false, badge: 0 },
  { label: 'Logbook',  path: '/logbook',  icon: BookOpen, exact: false, badge: 0 },
  { label: 'More',     path: '/more',     icon: MoreHorizontal, exact: false, badge: 0 },
]);

function isActive(item: typeof navItems.value[0]) {
  if (item.exact) return route.path === item.path;
  return route.path.startsWith(item.path);
}
</script>

<template>
  <nav class="bottom-nav" aria-label="Bottom Navigation">
    <div class="nav-container">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item) }"
      >
        <div class="icon-wrap">
          <component :is="item.icon" :size="22" :stroke-width="isActive(item) ? 2.5 : 2" />
          <!-- Notification Badge -->
          <transition name="badge-pop">
            <span v-if="item.badge > 0" class="notif-badge" :aria-label="`${item.badge} alerts`">
              {{ item.badge > 9 ? '9+' : item.badge }}
            </span>
          </transition>
        </div>
        <span class="nav-label">{{ item.label }}</span>
        <div v-if="isActive(item)" class="active-dot"></div>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: $app-max-width;
  height: $bottom-nav-height;
  background-color: $card;
  border-top: 1px solid rgba(14, 33, 56, 0.08);
  box-shadow: $shadow-bottom-nav;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  padding: 0 8px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 6px 0 4px;
  position: relative;
  min-height: 48px;

  .icon-wrap {
    position: relative;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;

    .notif-badge {
      position: absolute;
      top: -6px;
      right: -8px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      background-color: $red;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      border-radius: $radius-pill;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(230, 55, 87, 0.5);
      border: 2px solid $card;
      line-height: 1;
    }
  }

  &:hover {
    color: $navy;
  }

  &.active {
    color: $red;
    font-weight: 700;

    .icon-wrap {
      transform: translateY(-2px);
    }
  }

  .active-dot {
    position: absolute;
    bottom: 2px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: $red;
  }
}

/* Badge pop-in animation */
.badge-pop-enter-active {
  animation: badge-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.badge-pop-leave-active {
  animation: badge-pop 0.2s ease reverse;
}
@keyframes badge-pop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
</style>
