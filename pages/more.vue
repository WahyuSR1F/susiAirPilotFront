<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { usePilotStore } from '~/stores/pilot';
import PillButton from '~/components/ui/PillButton.vue';
import LogoBadge from '~/components/ui/LogoBadge.vue';
import ConfirmModal from '~/components/ui/ConfirmModal.vue';
import { MoreHorizontal, LogOut, ShieldCheck, User, Info, Plane } from 'lucide-vue-next';

const authStore = useAuthStore();
const pilotStore = usePilotStore();

const showLogoutModal = ref(false);

function handleLogout() {
  authStore.logout();
}
</script>

<template>
  <div class="more-page">
    <header class="page-top-header">
      <LogoBadge variant="dark" />
      <div class="title-row">
        <div class="header-icon">
          <MoreHorizontal :size="22" />
        </div>
        <div>
          <h2 class="page-title">Operations Menu</h2>
          <span class="page-subtitle">Account settings & information</span>
        </div>
      </div>
    </header>

    <div class="more-body">
      <!-- Pilot Profile Summary Card -->
      <div class="profile-card">
        <div class="avatar-box">
          <img
            v-if="pilotStore.profile?.avatarUrl"
            :src="pilotStore.profile.avatarUrl"
            alt="Pilot Avatar"
            class="avatar-img"
          />
          <div v-else class="avatar-fallback">
            {{ pilotStore.pilotInitials }}
          </div>
        </div>

        <div class="profile-details">
          <h3 class="pilot-name">{{ pilotStore.profile?.name || 'John Doe' }}</h3>
          <span class="role-tag">Commercial Pilot</span>
          <span class="hours-tag">{{ pilotStore.formattedHours }} Flight Hours</span>
        </div>
      </div>

      <!-- App Info Card -->
      <div class="info-card">
        <h4 class="card-section-title">Application Info</h4>
        <div class="info-row">
          <span class="label">System Version</span>
          <span class="value">v1.0.0 (Production)</span>
        </div>
        <div class="info-row">
          <span class="label">Reference Date ("Today")</span>
          <span class="value date-pill">15 May 2026</span>
        </div>
        <div class="info-row">
          <span class="label">Operator</span>
          <span class="value">PT ASI Pudjiastuti Aviation</span>
        </div>
      </div>

      <!-- Sign Out Action -->
      <div class="logout-action-card">
        <PillButton variant="outline" size="md" @click="showLogoutModal = true">
          <LogOut :size="18" />
          <span>Sign Out</span>
        </PillButton>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <ConfirmModal
      v-model="showLogoutModal"
      title="Sign Out?"
      message="You will be logged out from the Pilot Operations Portal. Any unsaved changes will be lost."
      confirm-label="Yes, Sign Out"
      cancel-label="Stay"
      tone="danger"
      @confirm="handleLogout"
    >
      <template #icon>
        <LogOut :size="24" />
      </template>
    </ConfirmModal>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.more-page {
  display: flex;
  flex-direction: column;
}

.page-top-header {
  background: linear-gradient(160deg, $navy 0%, $navy-light 100%);
  color: #ffffff;
  padding: 24px 20px 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;

  .title-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.12);
    color: $chart-accent;
    @include flex-center;
  }

  .page-title {
    font-size: 18px;
    font-weight: 800;
  }

  .page-subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.65);
  }
}

.more-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-card {
  @include card-surface;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;

  .avatar-box {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid $border-light;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      width: 100%;
      height: 100%;
      background-color: $navy;
      color: #ffffff;
      font-weight: 800;
      font-size: 18px;
      @include flex-center;
    }
  }

  .profile-details {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .pilot-name {
      font-size: 16px;
      font-weight: 800;
      color: $navy;
    }

    .role-tag {
      font-size: 12px;
      color: $text-secondary;
    }

    .hours-tag {
      font-size: 11px;
      font-weight: 700;
      color: $chart-accent;
      background-color: rgba(34, 197, 232, 0.1);
      padding: 2px 8px;
      border-radius: $radius-pill;
      align-self: flex-start;
      margin-top: 2px;
    }
  }
}

.info-card {
  @include card-surface;
  padding: 18px;

  .card-section-title {
    font-size: 13px;
    font-weight: 700;
    color: $navy;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .info-row {
    @include flex-between;
    padding: 8px 0;
    border-bottom: 1px solid $border-light;
    font-size: 13px;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .label {
      color: $text-secondary;
    }

    .value {
      font-weight: 700;
      color: $navy;

      &.date-pill {
        color: $red;
        background-color: $red-light;
        padding: 2px 8px;
        border-radius: $radius-pill;
        font-size: 11px;
      }
    }
  }
}

.logout-action-card {
  margin-top: 10px;
}
</style>
