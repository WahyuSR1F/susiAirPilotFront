<script setup lang="ts">
import { onMounted } from 'vue';
import { useScheduleStore } from '~/stores/schedule';
import MonthSwitcher from '~/components/schedule/MonthSwitcher.vue';
import CalendarGrid from '~/components/schedule/CalendarGrid.vue';
import Legend from '~/components/schedule/Legend.vue';
import ErrorState from '~/components/ui/ErrorState.vue';
import LogoBadge from '~/components/ui/LogoBadge.vue';
import { Calendar as CalendarIcon } from 'lucide-vue-next';

const scheduleStore = useScheduleStore();

onMounted(async () => {
  if (scheduleStore.items.length === 0) {
    await scheduleStore.fetchMonth();
  }
});

function handlePrevMonth() {
  scheduleStore.prevMonth();
}

function handleNextMonth() {
  scheduleStore.nextMonth();
}

function retry() {
  scheduleStore.fetchMonth(scheduleStore.year, scheduleStore.month);
}
</script>

<template>
  <div class="schedule-page">
    <!-- Top Header -->
    <header class="schedule-header">
      <LogoBadge variant="dark" />
      <div class="title-row">
        <div class="icon-wrap">
          <CalendarIcon :size="20" />
        </div>
        <div>
          <h2 class="page-title">Flight Schedule</h2>
          <span class="page-subtitle">Monthly roster & duty assignments</span>
        </div>
      </div>
    </header>

    <div class="schedule-content">
      <!-- Month Navigation Switcher -->
      <MonthSwitcher
        :month-name="scheduleStore.monthName"
        :loading="scheduleStore.loading"
        @prev="handlePrevMonth"
        @next="handleNextMonth"
      />

      <!-- Error State -->
      <ErrorState
        v-if="scheduleStore.error"
        title="Failed to load schedule"
        :message="scheduleStore.error"
        @retry="retry"
      />

      <!-- Calendar Grid -->
      <CalendarGrid
        v-else
        :year="scheduleStore.year"
        :month="scheduleStore.month"
        :today-date-str="scheduleStore.today"
        :items-by-date="scheduleStore.itemsByDate"
        :loading="scheduleStore.loading && scheduleStore.items.length === 0"
      />

      <!-- Duty Legend -->
      <Legend
        v-if="scheduleStore.legend.length > 0"
        :legend="scheduleStore.legend"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.schedule-page {
  display: flex;
  flex-direction: column;
}

.schedule-header {
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

    .icon-wrap {
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
      letter-spacing: -0.2px;
    }

    .page-subtitle {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.65);
    }
  }
}

.schedule-content {
  padding: 16px 16px 24px;
}
</style>
