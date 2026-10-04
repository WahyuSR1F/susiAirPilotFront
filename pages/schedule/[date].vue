<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useScheduleStore } from '~/stores/schedule';
import {
  ArrowLeft, Calendar, MapPin, Clock, CheckCircle2,
  AlertCircle, ClipboardList, Plane,
} from 'lucide-vue-next';

const route  = useRoute();
const router = useRouter();
const scheduleStore = useScheduleStore();

const dateParam = route.params.date as string; // e.g. "2026-05-15"

// Auto-fetch the correct month if store is empty (e.g. direct URL access)
onMounted(async () => {
  if (scheduleStore.items.length === 0 && dateParam) {
    const parts = dateParam.split('-');
    if (parts.length === 3) {
      await scheduleStore.fetchMonth(parseInt(parts[0]), parseInt(parts[1]));
    }
  }
});

// ---------- helpers ----------
function formatDateLabel(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function dutyLabel(code: string): string {
  const map: Record<string, string> = {
    DTY: 'On Duty',
    RLV: 'Requested Leave',
    SCK: 'Sick',
    TRD: 'Travel Day',
    TRX: 'Training',
    ADM: 'Administration',
    FER: 'Ferry',
    MED: 'Medical',
    REC: 'Recurrent',
    ULV: 'Unpaid Leave',
  };
  return map[code] ?? code;
}

// ---------- data ----------
const item = computed(() => scheduleStore.itemsByDate.get(dateParam) ?? null);
const legendItem = computed(() =>
  scheduleStore.legend.find(l => l.code === item.value?.duty_type) ?? null,
);
const dutyColor   = computed(() => item.value?.base_color ?? '#0E2138');
// Tick sesuai brief: count_logbooks === count_schedules (fallback ke field API)
const isCompleted = computed(() => {
  const it = item.value;
  if (!it) return false;
  if (typeof it.count_logbooks === 'number' && typeof it.count_schedules === 'number') {
    return it.count_logbooks === it.count_schedules;
  }
  return !!it.completed;
});

function goBack() {
  router.push('/schedule');
}
</script>

<template>
  <div class="detail-page">

    <!-- Top Bar -->
    <div class="top-bar">
      <button type="button" class="back-btn" @click="goBack">
        <ArrowLeft :size="18" />
        <span>Schedule</span>
      </button>
      <span class="top-date-label">{{ formatDateLabel(dateParam) }}</span>
    </div>

    <!-- No schedule on this date -->
    <div v-if="!item" class="empty-state">
      <div class="empty-icon">
        <Calendar :size="40" />
      </div>
      <h3 class="empty-title">No Duty Assigned</h3>
      <p class="empty-desc">There is no scheduled duty for this date.</p>
      <button type="button" class="back-link" @click="goBack">← Back to Calendar</button>
    </div>

    <!-- Duty Detail -->
    <template v-else>

      <!-- Hero Card -->
      <div class="hero-card" :style="{ background: `linear-gradient(135deg, ${dutyColor}cc 0%, ${dutyColor} 100%)` }">
        <div class="hero-badge">
          <Plane :size="14" />
          <span>{{ item.duty_type }}</span>
        </div>
        <h2 class="hero-title">{{ dutyLabel(item.duty_type) }}</h2>
        <div class="hero-meta">
          <div class="hero-meta-item">
            <MapPin :size="14" />
            <span>{{ item.base_name }}</span>
          </div>
          <div class="hero-meta-item" :class="isCompleted ? 'completed' : 'pending'">
            <CheckCircle2 v-if="isCompleted" :size="14" />
            <AlertCircle v-else :size="14" />
            <span>{{ isCompleted ? 'Completed' : 'In Progress' }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <ClipboardList :size="18" class="stat-icon" />
          <span class="stat-value">{{ item.count_schedules }}</span>
          <span class="stat-label">Scheduled</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-card">
          <CheckCircle2 :size="18" class="stat-icon done" />
          <span class="stat-value">{{ item.count_logbooks }}</span>
          <span class="stat-label">Logged</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-card">
          <Clock :size="18" class="stat-icon pending" />
          <span class="stat-value">{{ item.remaining }}</span>
          <span class="stat-label">Remaining</span>
        </div>
      </div>

      <!-- Details Section -->
      <div class="details-card">
        <h4 class="section-title">Duty Information</h4>

        <div class="info-row">
          <span class="info-label">Date</span>
          <span class="info-value">{{ formatDateLabel(item.duty_date) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Duty Type</span>
          <span class="info-value">
            <span class="duty-chip" :style="{ backgroundColor: legendItem?.color ?? dutyColor }">
              {{ item.duty_type }}
            </span>
            {{ dutyLabel(item.duty_type) }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Base</span>
          <span class="info-value">{{ item.base_name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value status-badge" :class="item.status === 2 ? 'verified' : 'active'">
            {{ item.status === 2 ? 'Verified' : 'Active' }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Completion</span>
          <div class="progress-wrap">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :class="isCompleted ? 'fill-done' : 'fill-active'"
                :style="{ width: item.count_schedules > 0 ? `${(item.count_logbooks / item.count_schedules) * 100}%` : '0%' }"
              ></div>
            </div>
            <span class="progress-label">
              {{ item.count_logbooks }}/{{ item.count_schedules }} sectors
            </span>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.detail-page {
  display: flex;
  flex-direction: column;
  padding: 16px 16px 32px;
  gap: 16px;
  min-height: 80vh;
}

/* ---- Top bar ---- */
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: $navy;
    padding: 7px 14px;
    border-radius: $radius-pill;
    background-color: #ffffff;
    box-shadow: $shadow-sm;
    flex-shrink: 0;
    transition: background 0.15s;

    &:hover { background-color: #F8FAFC; }
  }

  .top-date-label {
    font-size: 13px;
    font-weight: 600;
    color: $text-secondary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* ---- Empty state ---- */
.empty-state {
  flex: 1;
  @include card-surface;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(14, 33, 56, 0.07);
    color: $text-secondary;
    @include flex-center;
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 800;
    color: $navy;
    margin-bottom: 8px;
  }

  .empty-desc {
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: 24px;
  }

  .back-link {
    font-size: 13px;
    font-weight: 700;
    color: $navy;
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;
  }
}

/* ---- Hero card ---- */
.hero-card {
  border-radius: $radius-lg;
  padding: 22px 20px 20px;
  color: #ffffff;

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.2);
    padding: 4px 10px;
    border-radius: $radius-pill;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  .hero-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.3px;
    margin-bottom: 12px;
  }

  .hero-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .hero-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      opacity: 0.9;

      &.completed { color: #A7F3D0; }
      &.pending   { color: #FDE68A; }
    }
  }
}

/* ---- Stats row ---- */
.stats-row {
  @include card-surface;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;

    .stat-icon {
      color: $text-muted;
      &.done    { color: $success; }
      &.pending { color: $warning; }
    }

    .stat-value {
      font-size: 22px;
      font-weight: 800;
      color: $navy;
      line-height: 1;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: $text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background-color: $border-light;
  }
}

/* ---- Details card ---- */
.details-card {
  @include card-surface;
  padding: 18px;

  .section-title {
    font-size: 12px;
    font-weight: 800;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
  }

  .info-row {
    @include flex-between;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid $border-light;
    gap: 12px;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .info-label {
      font-size: 13px;
      color: $text-secondary;
      font-weight: 500;
      flex-shrink: 0;
    }

    .info-value {
      font-size: 13px;
      font-weight: 700;
      color: $navy;
      text-align: right;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;

      .duty-chip {
        display: inline-block;
        padding: 2px 8px;
        border-radius: $radius-pill;
        font-size: 10px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 0.3px;
      }
    }

    .status-badge {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: $radius-pill;
      font-weight: 800;

      &.verified {
        background-color: $success-bg;
        color: $success;
      }

      &.active {
        background-color: $warning-bg;
        color: $warning;
      }
    }
  }

  .progress-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    min-width: 120px;

    .progress-bar {
      width: 120px;
      height: 8px;
      background-color: $border-light;
      border-radius: $radius-pill;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        border-radius: $radius-pill;
        transition: width 0.4s ease;

        &.fill-done   { background-color: $success; }
        &.fill-active { background-color: $chart-accent; }
      }
    }

    .progress-label {
      font-size: 12px;
      font-weight: 700;
      color: $navy;
    }
  }
}
</style>
