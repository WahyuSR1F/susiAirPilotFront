export interface PilotProfile {
  name: string;
  totalFlightHours: number;
  avatarUrl: string;
}

export type RangeOption = '1w' | '1m' | '3m' | '6m' | '1y';

export interface FlightHoursSeriesPoint {
  date: string;
  hours: number;
  rollingSum: number;
  isToday: boolean;
  isFuture: boolean;
  partialWindow: boolean;
  overLimit: boolean;
}

export interface LimitCardData {
  key: string;
  label: string;
  windowDays: number;
  hours: number;
  limit: number;
  percent: number;
  overLimit: boolean;
}

export interface FlightHoursSummaryResponse {
  range: RangeOption;
  windowDays: number;
  limit: number;
  yMax: number;
  today: string;
  series: FlightHoursSeriesPoint[];
  cards: LimitCardData[];
}

export interface FlightHoursItem {
  date: string;
  hours: number;
}

export interface FlightHoursResponse {
  from: string;
  to: string;
  items: FlightHoursItem[];
}

export interface DocumentItem {
  id: string;
  label: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'safe' | 'soon' | 'expired';
}

export interface DocumentsResponse {
  today: string;
  warningDays: number;
  items: DocumentItem[];
}

export interface ScheduleLegendItem {
  code: string;
  label: string;
  color: string;
}

export interface ScheduleItem {
  id: string;
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
  remaining: number;
  completed: boolean;
}

export interface SchedulesResponse {
  year: number;
  month: number;
  today: string;
  legend: ScheduleLegendItem[];
  items: ScheduleItem[];
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path?: string;
  timestamp?: string;
}
