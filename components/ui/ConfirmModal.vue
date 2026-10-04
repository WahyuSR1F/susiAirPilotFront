<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import PillButton from '~/components/ui/PillButton.vue';

interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Tampilan tombol konfirmasi */
  tone?: 'danger' | 'primary';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  tone: 'danger',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const confirmBtn = ref<{ $el?: HTMLElement } | null>(null);

function close() {
  emit('update:modelValue', false);
  emit('cancel');
}

function confirm() {
  emit('update:modelValue', false);
  emit('confirm');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close();
}

// Fokuskan tombol konfirmasi saat modal terbuka (a11y)
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      requestAnimationFrame(() => {
        const el = confirmBtn.value?.$el;
        if (el && typeof (el as HTMLElement).focus === 'function') {
          (el as HTMLElement).focus();
        }
      });
    }
  },
);

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" role="presentation" @click.self="close">
        <div
          class="modal-card"
          role="alertdialog"
          aria-modal="true"
          :aria-label="title"
        >
          <div class="modal-icon" :class="tone">
            <slot name="icon" />
          </div>

          <h3 class="modal-title">{{ title }}</h3>
          <p v-if="message" class="modal-message">{{ message }}</p>

          <div class="modal-actions">
            <PillButton variant="outline" size="md" @click="close">
              {{ cancelLabel }}
            </PillButton>
            <PillButton
              ref="confirmBtn"
              :variant="tone === 'danger' ? 'danger' : 'primary'"
              size="md"
              @click="confirm"
            >
              {{ confirmLabel }}
            </PillButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(8, 20, 36, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  @include flex-center;
  padding: 24px;
}

.modal-card {
  width: 100%;
  max-width: 360px;
  background-color: $card;
  border-radius: $radius-lg;
  box-shadow: 0 24px 48px rgba(8, 20, 36, 0.28);
  padding: 26px 22px 22px;
  text-align: center;
}

.modal-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin: 0 auto 14px;
  @include flex-center;

  &.danger {
    background-color: $danger-bg;
    color: $danger;
  }

  &.primary {
    background-color: rgba(34, 197, 232, 0.12);
    color: $chart-accent;
  }
}

.modal-title {
  font-size: 17px;
  font-weight: 800;
  color: $navy;
  letter-spacing: -0.2px;
  margin-bottom: 6px;
}

.modal-message {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

/* ---- transitions ---- */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal-card {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-card {
    transform: scale(0.94) translateY(8px);
    opacity: 0;
  }
}
</style>
