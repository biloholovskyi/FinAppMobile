import type { DayKey, IsoRange, MomentInput, MonthKey } from './kyivCalendar.types'
import { getKyivDayKey } from './dayKey'
import { kyivMidnightToUtc, padDatePart } from './kyivParts'

type MonthParts = { year: number; month: number }

/** Хвост ключа бюджета: 1-е число месяца, полночь UTC. */
const BUDGET_MONTH_SUFFIX = '-01T00:00:00.000Z'

/** Год и месяц в начале хранимой ISO-строки месяца. */
const STORED_MONTH_PATTERN = /^(\d{4})-(\d{2})(?:-|$)/

const MONTHS_PER_YEAR = 12

/** Зазор включительной верхней границы диапазона до начала следующего месяца. */
const RANGE_END_GAP_MS = 1

/** Собирает `MonthKey` из года и месяца (1-based). */
export function makeMonthKey(year: number, month: number): MonthKey {
  return `${year}-${padDatePart(month)}` as MonthKey
}

/** Год и месяц (1-based) из `MonthKey`. */
export function splitMonthKey(month: MonthKey): MonthParts {
  const [year, monthNumber] = month.split('-').map(Number)
  return { year, month: monthNumber }
}

/** Киевский месяц момента. */
export function getKyivMonthKey(input: MomentInput): MonthKey {
  return getMonthKeyOfDay(getKyivDayKey(input))
}

/** Текущий киевский месяц; `now` — для детерминированных расчётов. */
export function getKyivCurrentMonthKey(now: Date = new Date()): MonthKey {
  return getKyivMonthKey(now)
}

/** Месяц календарной даты. */
export function getMonthKeyOfDay(day: DayKey): MonthKey {
  const [year, month] = day.split('-').map(Number)
  return makeMonthKey(year, month)
}

/** Сдвиг месяца на `delta` месяцев. */
export function shiftMonthKey(month: MonthKey, delta: number): MonthKey {
  const parts = splitMonthKey(month)
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1 + delta, 1))
  return makeMonthKey(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1)
}

/** Число дней в месяце. */
export function getDaysInMonth(month: MonthKey): number {
  const parts = splitMonthKey(month)
  return new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate()
}

/** Момент киевской полуночи 1-го числа месяца. */
export function getKyivMonthStart(month: MonthKey): Date {
  const parts = splitMonthKey(month)
  return kyivMidnightToUtc(parts.year, parts.month, 1)
}

/**
 * Диапазон месяца для REST: от киевской полуночи 1-го числа
 * до киевской полуночи следующего месяца минус 1 мс.
 */
export function getKyivMonthRange(month: MonthKey): IsoRange {
  const nextStart = getKyivMonthStart(shiftMonthKey(month, 1))
  return {
    dateFrom: getKyivMonthStart(month).toISOString(),
    dateTo: new Date(nextStart.getTime() - RANGE_END_GAP_MS).toISOString(),
  }
}

/** Ключ бюджета `YYYY-MM-01T00:00:00.000Z`. */
export function toBudgetMonthKey(month: MonthKey): string {
  return `${month}${BUDGET_MONTH_SUFFIX}`
}

/**
 * Месяц хранимого значения (`budget.month`, `monthly_report.month`, `targetDate`)
 * по его UTC-строке, без перевода в киевское время. Невалидный вход — `null`.
 */
export function monthKeyFromStoredMonth(iso: string | null | undefined): MonthKey | null {
  const match = STORED_MONTH_PATTERN.exec(iso ?? '')
  if (!match) return null
  const [, year, month] = match
  const monthNumber = Number(month)
  if (monthNumber < 1 || monthNumber > MONTHS_PER_YEAR) return null
  return `${year}-${month}` as MonthKey
}
