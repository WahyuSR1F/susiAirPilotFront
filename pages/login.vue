<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import PillButton from '~/components/ui/PillButton.vue';
import LogoBadge from '~/components/ui/LogoBadge.vue';
import { Lock, User, AlertCircle, Plane } from 'lucide-vue-next';

definePageMeta({
  layout: 'auth',
});

const router = useRouter();
const authStore = useAuthStore();

const username = ref('johndoe');
const password = ref('susiairtest');
const errorMessage = ref('');

async function handleSubmit() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please provide both username and password.';
    return;
  }

  errorMessage.value = '';
  const result = await authStore.login({
    username: username.value,
    password: password.value,
  });

  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.error || 'Invalid username or password';
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-brand-header">
      <LogoBadge variant="light" size="md" />
      <div class="portal-badge">
        <Plane :size="13" class="plane-icon" />
        <span>PILOT OPERATIONS PORTAL</span>
      </div>
    </div>

    <div class="login-card">
      <div class="card-intro">
        <h1 class="login-title">Sign In</h1>
        <p class="login-subtitle">Access your duty schedules, flight hours, and regulatory limits.</p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="error-banner" role="alert" aria-live="assertive">
          <AlertCircle :size="18" class="error-icon" />
          <span class="error-text">{{ errorMessage }}</span>
        </div>

        <!-- Username Field -->
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <div class="input-wrap">
            <User :size="18" class="field-icon" />
            <input
              id="username"
              v-model="username"
              type="text"
              name="username"
              autocomplete="username"
              required
              placeholder="e.g. johndoe"
              class="form-input"
              :disabled="authStore.loading"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrap">
            <Lock :size="18" class="field-icon" />
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              autocomplete="current-password"
              required
              placeholder="Enter password"
              class="form-input"
              :disabled="authStore.loading"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-action">
          <PillButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.loading"
          >
            Sign In to Portal
          </PillButton>
        </div>

        <!-- Demo Credentials Hint -->
        <div class="demo-box">
          <span class="demo-title">Technical Test Demo Account:</span>
          <div class="demo-credentials">
            <code>johndoe</code> / <code>susiairtest</code>
          </div>
        </div>
      </form>
    </div>

    <footer class="login-footer">
      <p>© 2026 PT ASI Pudjiastuti Aviation. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.login-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  text-align: center;

  .logo-badge {
    margin-bottom: 14px;
  }

  .portal-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background-color: rgba(14, 33, 56, 0.08);
    border-radius: $radius-pill;
    color: $navy;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;

    .plane-icon {
      color: $red;
    }
  }
}

.login-card {
  @include card-surface;
  width: 100%;
  max-width: 400px;
  padding: 28px 24px;
}

.card-intro {
  margin-bottom: 22px;

  .login-title {
    font-size: 22px;
    font-weight: 800;
    color: $navy;
    letter-spacing: -0.3px;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.4;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background-color: $danger-bg;
  border: 1px solid rgba(230, 55, 87, 0.25);
  border-radius: $radius-md;
  color: $danger;

  .error-icon {
    flex-shrink: 0;
  }

  .error-text {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .form-label {
    font-size: 12px;
    font-weight: 700;
    color: $navy;
    letter-spacing: 0.2px;
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;

    .field-icon {
      position: absolute;
      left: 14px;
      color: $text-muted;
      pointer-events: none;
    }

    .form-input {
      width: 100%;
      height: 48px;
      padding: 0 16px 0 44px;
      border: 1.5px solid $border;
      border-radius: $radius-md;
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      background-color: #FAFAFA;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: $navy;
        background-color: #FFFFFF;
        box-shadow: 0 0 0 3px rgba(14, 33, 56, 0.08);
      }

      &::placeholder {
        color: $text-muted;
        font-weight: 400;
      }

      &:disabled {
        background-color: #F3F4F6;
        cursor: not-allowed;
      }
    }
  }
}

.form-action {
  margin-top: 6px;
}

.demo-box {
  background-color: #F8FAFC;
  border: 1px dashed #CBD5E1;
  border-radius: $radius-md;
  padding: 10px 14px;
  text-align: center;
  font-size: 11px;
  color: $text-secondary;

  .demo-title {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
  }

  .demo-credentials {
    code {
      background-color: #E2E8F0;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      color: $navy;
    }
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 11px;
  color: $text-muted;
}
</style>
