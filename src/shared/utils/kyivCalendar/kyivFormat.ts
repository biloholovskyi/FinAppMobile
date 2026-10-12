import { getKyivDayKey, getKyivDayStart } from './dayKey'
import type { DayKey, MomentInput, MonthKey } from './kyivCalendar.types'
import { toMoment } from './kyivParts'
import { getKyivTimeZone } from './kyivTimeZone'
import { getKyivMonthStart } from './monthKey'

/** Опции форматирования даты; часовой пояс всегда киевский и не переопределяется. */
export type KyivFormatOptions = Omit<Intl.DateTimeFormatOptions, 'timeZone'>

const TIME_OPTIONS = { hour: '2-digit', minute: '2-digit' } satisfies KyivFormatOptions

const STORED_DAY_OPTIONS = { day: '2-digit', month: '2-digit', year: 'numeric' } satisfies KyivFormatOptions

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(locale: string, options: KyivFormatOptions): Intl.DateTimeFormat {
  const cacheKey = `${locale}|${JSON.stringify(options)}`
  let formatter = formatterCache.get(cacheKey)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone: getKyivTimeZone() })
    formatterCache.set(cacheKey, formatter)
  }
  return formatter
}

/** Форматирует момент по киевскому времени. */
export function formatKyivMoment(input: MomentInput, locale: string, options: KyivFormatOptions): string {
  return getFormatter(locale, options).format(toMoment(input))
}

/** Время момента `HH:mm` по Киеву. */
export function formatKyivTime(input: MomentInput, locale: string): string {
  return formatKyivMoment(input, locale, TIME_OPTIONS)
}

/** Форматирует календарную дату. */
export function formatDayKey(day: DayKey, locale: string, options: KyivFormatOptions): string {
  return formatKyivMoment(getKyivDayStart(day), locale, options)
}

/** Форматирует календарный месяц. */
export function formatMonthKey(month: MonthKey, locale: string, options: KyivFormatOptions): string {
  return formatKyivMoment(getKyivMonthStart(month), locale, options)
}

/**
 * Хранимый календарный день (`nextPaymentDate`, `date`) как киевская дата момента:
 * `2026-08-15T00:00:00Z` — 15.08, legacy `2026-08-15T21:00:00Z` — 16.08.
 */
export function formatStoredDay(iso: string, locale: string): string {
  return formatDayKey(getKyivDayKey(iso), locale, STORED_DAY_OPTIONS)
}
