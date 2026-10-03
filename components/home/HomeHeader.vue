<script setup lang="ts">
import { ref } from 'vue';
import { usePilotStore } from '~/stores/pilot';
import Skeleton from '~/components/ui/Skeleton.vue';
import LogoBadge from '~/components/ui/LogoBadge.vue';

const pilotStore = usePilotStore();
const avatarLoadError = ref(false);

function handleImageError() {
  avatarLoadError.value = true;
}
</script>

<template>
  <header class="home-header">
    <div class="header-top">
      <div class="logo-area">
        <LogoBadge variant="dark" />
      </div>
      <div class="avatar-area">
        <div class="avatar-ring">
          <img
            v-if="pilotStore.profile?.avatarUrl && !avatarLoadError"
            :src="pilotStore.profile.avatarUrl"
            :alt="pilotStore.profile.name"
            class="avatar-img"
            @error="handleImageError"
          />
          <div v-else class="avatar-fallback">
            {{ pilotStore.pilotInitials }}
          </div>
        </div>
      </div>
    </div>

    <div class="pilot-info">
      <span class="greeting">{{ pilotStore.greeting }}</span>
      <h2 v-if="pilotStore.loading && !pilotStore.profile" class="pilot-name-skeleton">
        <Skeleton width="180px" height="26px" radius="6px" />
      </h2>
      <h2 v-else class="pilot-name">{{ pilotStore.profile?.name || 'Captain Pilot' }}</h2>
    </div>

    <div class="hours-card">
      <div class="hours-label">Total Flight Hours</div>
      <div v-if="pilotStore.loading && !pilotStore.profile" class="hours-skeleton">
        <Skeleton width="140px" height="38px" radius="8px" />
      </div>
      <div v-else class="hours-val-row">
        <span class="hours-value">{{ pilotStore.formattedHours }}</span>
        <span class="hours-unit">HRS</span>
      </div>
      <div class="hours-subtext">Verified operational flight records</div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.home-header {
  background: linear-gradient(160deg, $navy 0%, $navy-light 100%);
  color: #ffffff;
  padding: 24px 20px 28px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -40px;
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(34, 197, 232, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }
}

.header-top {
  @include flex-between;
  margin-bottom: 18px;
}

.avatar-ring {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 2px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-fallback {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: $red;
    color: #ffffff;
    font-weight: 800;
    font-size: 14px;
    @include flex-center;
  }
}

.pilot-info {
  margin-bottom: 18px;

  .greeting {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    display: block;
    margin-bottom: 2px;
  }

  .pilot-name {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.3px;
  }
}

.hours-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: $radius-card;
  padding: 16px 18px;
  backdrop-filter: blur(8px);

  .hours-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 6px;
  }

  .hours-val-row {
    display: flex;
    align-items: baseline;
    gap: 8px;

    .hours-value {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.5px;
      color: #ffffff;
    }

    .hours-unit {
      font-size: 13px;
      font-weight: 700;
      color: $chart-accent;
    }
  }

  .hours-subtext {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
    margin-top: 6px;
  }
}
</style>
