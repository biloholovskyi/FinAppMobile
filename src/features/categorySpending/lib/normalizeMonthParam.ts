import {
  getKyivCurrentMonthKey,
  monthKeyFromStoredMonth,
  type MonthKey,
} from '@/shared/utils/kyivCalendar'

/**
 * Месяц из параметра маршрута (`YYYY-MM-01T00:00:00.000Z`).
 * Пустой или битый параметр — текущий киевский месяц.
 */
export function normalizeMonthParam(raw: string | undefined): MonthKey {
  return monthKeyFromStoredMonth(raw) ?? getKyivCurrentMonthKey()
}
