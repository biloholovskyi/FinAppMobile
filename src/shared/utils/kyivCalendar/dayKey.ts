import type { DayKey, MomentInput } from './kyivCalendar.types'
import { getKyivParts, kyivMidnightToUtc, padDatePart } from './kyivParts'

type DayParts = { year: number; month: number; day: number }

/** Хвост формата хранения календарного дня: полночь UTC даты. */
const STORED_DAY_SUFFIX = 'T00:00:00.000Z'

/** Предел кэша ISO → `DayKey`; при переполнении кэш сбрасывается целиком. */
const DAY_KEY_CACHE_LIMIT = 10_000

/** Момент неизменен, поэтому киевская дата ISO-строки кэшируется: лента и агрегаторы спрашивают её на каждую транзакцию. */
const dayKeyCache = new Map<string, DayKey>()

/** Собирает `DayKey` из года, месяца (1-based) и числа. */
export function makeDayKey(year: number, month: number, day: number): DayKey {
  return `${year}-${padDatePart(month)}-${padDatePart(day)}` as DayKey
}

/** Год, месяц (1-based) и число из `DayKey`. */
export function splitDayKey(day: DayKey): DayParts {
  const [year, month, dayOfMonth] = day.split('-').map(Number)
  return { year, month, day: dayOfMonth }
}

function computeKyivDayKey(input: MomentInput): DayKey {
  const parts = getKyivParts(input)
  return makeDayKey(parts.year, parts.month, parts.day)
}

/** Киевская дата момента. */
export function getKyivDayKey(input: MomentInput): DayKey {
  if (typeof input !== 'string') return computeKyivDayKey(input)
  const cached = dayKeyCache.get(input)
  if (cached) return cached
  const day = computeKyivDayKey(input)
  if (dayKeyCache.size >= DAY_KEY_CACHE_LIMIT) dayKeyCache.clear()
  dayKeyCache.set(input, day)
  return day
}

/** Киевское «сегодня»; `now` — для детерминированных расчётов. */
export function getKyivToday(now: Date = new Date()): DayKey {
  return getKyivDayKey(now)
}

/** Сдвиг даты на `delta` календарных суток. */
export function shiftDayKey(day: DayKey, delta: number): DayKey {
  const parts = splitDayKey(day)
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + delta))
  return makeDayKey(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate())
}

/** Момент киевской полуночи даты. */
export function getKyivDayStart(day: DayKey): Date {
  const parts = splitDayKey(day)
  return kyivMidnightToUtc(parts.year, parts.month, parts.day)
}

/** Число месяца даты. */
export function getDayOfMonth(day: DayKey): number {
  return splitDayKey(day).day
}

/** Формат отправки календарного дня из формы: `YYYY-MM-DDT00:00:00.000Z`. */
export function toStoredDay(day: DayKey): string {
  return `${day}${STORED_DAY_SUFFIX}`
}
