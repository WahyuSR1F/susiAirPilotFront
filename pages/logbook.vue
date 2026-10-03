<script setup lang="ts">
import { ref } from 'vue';
import { BookOpen, PlaneTakeoff, PlaneLanding, Clock, ArrowRight, MapPin } from 'lucide-vue-next';
import LogoBadge from '~/components/ui/LogoBadge.vue';

// Mock data since the backend /logbook API does not exist yet
const mockFlights = ref([
  {
    id: 'FL-20260515-01',
    date: '15 May 2026',
    aircraft: 'PK-VVA',
    type: 'C208B Grand Caravan',
    departure: 'PDG',
    arrival: 'MKW',
    offBlock: '07:15',
    onBlock: '08:30',
    flightTime: '1h 15m',
    role: 'PIC',
    status: 'Verified'
  },
  {
    id: 'FL-20260515-02',
    date: '15 May 2026',
    aircraft: 'PK-VVA',
    type: 'C208B Grand Caravan',
    departure: 'MKW',
    arrival: 'SIQ',
    offBlock: '09:00',
    onBlock: '09:45',
    flightTime: '0h 45m',
    role: 'PIC',
    status: 'Verified'
  },
  {
    id: 'FL-20260514-01',
    date: '14 May 2026',
    aircraft: 'PK-VVW',
    type: 'Pilatus PC-6',
    departure: 'SIQ',
    arrival: 'TBM',
    offBlock: '11:20',
    onBlock: '12:50',
    flightTime: '1h 30m',
    role: 'SIC',
    status: 'Pending'
  },
  {
    id: 'FL-20260514-02',
    date: '14 May 2026',
    aircraft: 'PK-VVW',
    type: 'Pilatus PC-6',
    departure: 'TBM',
    arrival: 'PDG',
    offBlock: '13:30',
    onBlock: '14:45',
    flightTime: '1h 15m',
    role: 'SIC',
    status: 'Pending'
  }
]);
</script>

<template>
  <div class="logbook-page">
    <header class="page-top-header">
      <LogoBadge variant="dark" />
      <div class="title-row">
        <div class="header-icon">
          <BookOpen :size="22" />
        </div>
        <div>
          <h2 class="page-title">Electronic Logbook</h2>
          <span class="page-subtitle">Recent flight logs & sector history</span>
        </div>
      </div>
    </header>

    <div class="logbook-body">
      <!-- Mock API Notice -->
      <div class="mock-notice">
        <span>Note: Displaying mock data. Backend integration pending.</span>
      </div>

      <!-- Logbook List -->
      <div class="logbook-grid">
        <div v-for="flight in mockFlights" :key="flight.id" class="logbook-card">
          
          <div class="card-header">
            <div class="date-badge">
              <span class="date-text">{{ flight.date }}</span>
            </div>
            <div class="status-badge" :class="flight.status.toLowerCase()">
              {{ flight.status }}
            </div>
          </div>

          <div class="route-section">
            <div class="station">
              <span class="station-code">{{ flight.departure }}</span>
              <div class="time-wrap">
                <PlaneTakeoff :size="12" class="time-icon" />
                <span class="time">{{ flight.offBlock }}</span>
              </div>
            </div>
            
            <div class="route-line">
              <div class="line"></div>
              <ArrowRight :size="16" class="arrow-icon" />
            </div>

            <div class="station">
              <span class="station-code">{{ flight.arrival }}</span>
              <div class="time-wrap">
                <PlaneLanding :size="12" class="time-icon" />
                <span class="time">{{ flight.onBlock }}</span>
              </div>
            </div>
          </div>

          <div class="flight-details">
            <div class="detail-item">
              <span class="detail-label">Aircraft</span>
              <span class="detail-value">{{ flight.aircraft }} <span class="text-muted">({{ flight.type }})</span></span>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Role</span>
                <span class="detail-value role">{{ flight.role }}</span>
              </div>
              <div class="detail-item text-right">
                <span class="detail-label">Block Time</span>
                <span class="detail-value time-total">
                  <Clock :size="14" class="inline-icon" />
                  {{ flight.flightTime }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/tokens' as *;
@use '~/assets/scss/mixins' as *;

.logbook-page {
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

.logbook-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mock-notice {
  background-color: $warning-bg;
  color: $warning;
  padding: 10px 14px;
  border-radius: $radius-md;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.logbook-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.logbook-card {
  @include card-surface;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  @include flex-between;
  
  .date-badge {
    .date-text {
      font-size: 12px;
      font-weight: 700;
      color: $navy;
    }
  }

  .status-badge {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: $radius-pill;

    &.verified {
      background-color: $success-bg;
      color: $success;
    }

    &.pending {
      background-color: rgba(245, 158, 11, 0.15);
      color: $warning;
    }
  }
}

.route-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FAFAFA;
  padding: 14px 16px;
  border-radius: $radius-md;
  border: 1px solid $border-light;

  .station {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .station-code {
      font-size: 20px;
      font-weight: 800;
      color: $navy;
      letter-spacing: 0.5px;
    }

    .time-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      color: $text-secondary;
      
      .time-icon {
        opacity: 0.7;
      }
      
      .time {
        font-size: 12px;
        font-weight: 600;
      }
    }
  }

  .route-line {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: relative;
    color: $border;

    .line {
      flex: 1;
      height: 2px;
      background: repeating-linear-gradient(90deg, $border 0, $border 4px, transparent 4px, transparent 8px);
    }

    .arrow-icon {
      margin-left: 4px;
      color: $text-muted;
    }
  }
}

.flight-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .detail-row {
    @include flex-between;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 2px;

    &.text-right {
      align-items: flex-end;
    }

    .detail-label {
      font-size: 11px;
      color: $text-muted;
      font-weight: 600;
      text-transform: uppercase;
    }

    .detail-value {
      font-size: 13px;
      font-weight: 700;
      color: $navy;

      .text-muted {
        color: $text-secondary;
        font-weight: 500;
      }

      &.role {
        color: $chart-accent;
        background-color: rgba(34, 197, 232, 0.1);
        padding: 2px 8px;
        border-radius: $radius-pill;
        font-size: 11px;
      }

      &.time-total {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: $navy;
        
        .inline-icon {
          color: $red;
        }
      }
    }
  }
}
</style>
