<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { useFlightHoursStore } from '~/stores/flightHours';
import RangeToggle from './RangeToggle.vue';
import Skeleton from '~/components/ui/Skeleton.vue';
import { AlertCircle } from 'lucide-vue-next';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler
);

const flightHoursStore = useFlightHoursStore();

function handleRangeChange(newRange: any) {
  flightHoursStore.setRange(newRange);
}

const series = computed(() => flightHoursStore.series);
const limitValue = computed(() => flightHoursStore.limit);
const yMaxValue = computed(() => flightHoursStore.yMax);

// Format date string 'YYYY-MM-DD' to short label 'DD MMM'
function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[parseInt(m, 10) - 1] || '';
  return `${parseInt(d, 10)} ${monthName}`;
}

const labels = computed(() => {
  return series.value.map((pt, idx) => {
    if (pt.isToday) return `${formatShortDate(pt.date)}`;
    return formatShortDate(pt.date);
  });
});

const hasOverLimit = computed(() => {
  return series.value.some((pt) => pt.overLimit || pt.rollingSum > limitValue.value);
});

const chartData = computed<ChartData<'line'>>(() => {
  const points = series.value;
  const rollingValues = points.map((p) => p.rollingSum);
  const limitValues = points.map(() => limitValue.value);

  // Dynamic point colors & sizes
  const pointBgColors = points.map((p) => {
    if (p.overLimit || p.rollingSum > limitValue.value) return '#E63757';
    if (p.isToday) return '#0E2138';
    return '#22C5E8';
  });

  const pointBorderColors = points.map((p) => {
    if (p.isToday) return '#FFFFFF';
    return 'transparent';
  });

  const pointRadii = points.map((p) => {
    if (p.isToday) return 6;
    if (p.overLimit || p.rollingSum > limitValue.value) return 5;
    return 3;
  });

  return {
    labels: labels.value,
    datasets: [
      {
        label: 'Rolling Flight Hours',
        data: rollingValues,
        borderColor: '#22C5E8',
        backgroundColor: 'rgba(34, 197, 232, 0.08)',
        fill: true,
        tension: 0.3,
        borderWidth: 2.5,
        pointBackgroundColor: pointBgColors,
        pointBorderColor: pointBorderColors,
        pointBorderWidth: 2,
        pointRadius: pointRadii,
        pointHoverRadius: 7,
        segment: {
          borderDash: (ctx) => {
            // Future dates dashed lines
            const pt = points[ctx.p1DataIndex];
            return pt && pt.isFuture ? [5, 4] : undefined;
          },
          borderColor: (ctx) => {
            const pt = points[ctx.p1DataIndex];
            if (pt && (pt.overLimit || pt.rollingSum > limitValue.value)) {
              return '#E63757';
            }
            return '#22C5E8';
          },
        },
      },
      {
        label: `Limit (${limitValue.value}h)`,
        data: limitValues,
        borderColor: '#E63757',
        borderWidth: 2,
        borderDash: [],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<'line'>>(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0E2138',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", weight: 'bold', size: 12 },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (items) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const pt = series.value[idx];
            if (!pt) return '';
            const isTodayText = pt.isToday ? ' (Today)' : '';
            const isFutureText = pt.isFuture ? ' (Projected)' : '';
            return `${pt.date}${isTodayText}${isFutureText}`;
          },
          label: (item) => {
            const idx = item.dataIndex;
            const pt = series.value[idx];
            if (!pt) return '';
            if (item.datasetIndex === 1) {
              return `Limit: ${limitValue.value} hrs`;
            }
            return [
              `Rolling sum: ${pt.rollingSum.toFixed(1)} hrs`,
              `Daily logged: ${pt.hours.toFixed(1)} hrs`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 10,
            weight: 500,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        min: 0,
        max: yMaxValue.value,
        grid: {
          color: 'rgba(14, 33, 56, 0.06)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 10,
            weight: 600,
          },
          callback: (value) => `${value}h`,
        },
      },
    },
  };
});
</script>

<template>
  <div class="trend-chart-card">
    <div class="chart-header">
      <div class="title-wrap">
        <h4 class="chart-title">Flight Hours Trend</h4>
        <span class="chart-subtitle">Center is Today (15 May 2026)</span>
      </div>
      <div class="legend-indicator">
        <span class="legend-item"><span class="dot actual"></span>Rolling</span>
        <span class="legend-item"><span class="dot limit"></span>Limit ({{ limitValue }}h)</span>
      </div>
    </div>

    <!-- Range Selector Toggle -->
    <RangeToggle
      :model-value="flightHoursStore.range"
      :disabled="flightHoursStore.loading"
      @update:model-value="handleRangeChange"
    />

    <!-- Over Limit Warning Banner -->
    <div v-if="hasOverLimit" class="overlimit-banner">
      <AlertCircle :size="15" />
      <span>Flight hours in this window exceed the regulatory limit</span>
    </div>

    <!-- Chart Canvas Container -->
    <div class="chart-canvas-wrapper">
      <div v-if="flightHoursStore.loading && series.length === 0" class="chart-skeleton">
        <Skeleton width="100%" height="180px" radius="10px" />
      </div>
      <Line
        v-else-if="series.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="empty-chart">
        No flight hours data available
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.trend-chart-card {
  @include card-surface;
  padding: 18px 16px;
  margin: 18px 20px 0;
}

.chart-header {
  @include flex-between;
  margin-bottom: 12px;
  align-items: flex-start;

  .chart-title {
    font-size: 15px;
    font-weight: 800;
    color: $navy;
  }

  .chart-subtitle {
    font-size: 11px;
    color: $text-secondary;
    display: block;
    margin-top: 1px;
  }
}

.legend-indicator {
  display: flex;
  align-items: center;
  gap: 10px;

  .legend-item {
    font-size: 10px;
    font-weight: 600;
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: 4px;

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;

      &.actual {
        background-color: $chart-accent;
      }

      &.limit {
        background-color: $danger;
      }
    }
  }
}

.overlimit-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: $danger-bg;
  color: $danger;
  border-radius: $radius-sm;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 10px;
}

.chart-canvas-wrapper {
  position: relative;
  height: 220px;
  width: 100%;
}

.chart-skeleton {
  @include flex-center;
  height: 100%;
}

.empty-chart {
  @include flex-center;
  height: 100%;
  color: $text-muted;
  font-size: 13px;
}
</style>
