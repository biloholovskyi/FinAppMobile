import type { MomentInput } from './kyivCalendar.types'
import { getKyivTimeZone } from './kyivTimeZone'

/** Компоненты киевского времени момента; `month` — 1-based. */
export type KyivParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

type PartType = keyof KyivParts

/** Ошибка утилиты календаря: движок `Intl` вернул неожиданный результат. */
export class KyivCalendarError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'KyivCalendarError'
  }
}

const PART_TYPES: readonly PartType[] = ['year', 'month', 'day', 'hour', 'minute', 'second']

/**
 * Локаль служебного форматтера: числовой вывод `DD/MM/YYYY, HH:mm:ss`
 * в 24-часовом формате, даже если движок проигнорирует `hourCycle`.
 */
const PARTS_LOCALE = 'en-GB'

/** Разбор `format()` служебного форматтера, когда нет `formatToParts`. */
const FORMATTED_PARTS_PATTERN = /^(\d{1,2})\D+(\d{1,2})\D+(\d{4})\D+(\d{1,2})\D+(\d{2})\D+(\d{2})$/

/** Часов в сутках: часть движков отдаёт полночь как `24`. */
const HOURS_PER_DAY = 24

const MS_PER_SECOND = 1_000

const DATE_PART_PAD = 2

/** Предел расхождения разобранного киевского времени с UTC: больше — порядок частей разобран неверно. */
const MAX_KYIV_OFFSET_MS = 14 * 60 * 60 * MS_PER_SECOND

let partsFormatter: Intl.DateTimeFormat | null = null

function getPartsFormatter(): Intl.DateTimeFormat {
  partsFormatter ??= new Intl.DateTimeFormat(PARTS_LOCALE, {
    timeZone: getKyivTimeZone(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  return partsFormatter
}

function normalizeParts(parts: KyivParts): KyivParts {
  return { ...parts, hour: parts.hour % HOURS_PER_DAY }
}

function readFormattedParts(formatter: Intl.DateTimeFormat, date: Date): KyivParts | null {
  if (typeof formatter.formatToParts !== 'function') return null
  const values: Partial<Record<PartType, number>> = {}
  for (const part of formatter.formatToParts(date)) {
    if ((PART_TYPES as readonly string[]).includes(part.type)) {
      values[part.type as PartType] = Number(part.value)
    }
  }
  const isComplete = PART_TYPES.every((type) => Number.isInteger(values[type]))
  return isComplete ? (values as KyivParts) : null
}

function toWallMs(parts: KyivParts): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
}

/**
 * Разбор `format()` без `formatToParts`. Порядок частей проверяется правдоподобием смещения:
 * если движок подставил другую локаль и переставил день с месяцем, это ошибка, а не тихий сдвиг даты.
 */
function parseFormattedString(formatter: Intl.DateTimeFormat, date: Date): KyivParts {
  const formatted = formatter.format(date)
  const match = FORMATTED_PARTS_PATTERN.exec(formatted)
  if (!match) {
    throw new KyivCalendarError(`Unexpected Intl output for ${getKyivTimeZone()}: "${formatted}"`)
  }
  const [, day, month, year, hour, minute, second] = match.map(Number)
  const parts = normalizeParts({ year, month, day, hour, minute, second })
  if (Math.abs(toWallMs(parts) - date.getTime()) > MAX_KYIV_OFFSET_MS) {
    throw new KyivCalendarError(`Implausible Intl output for ${date.toISOString()}: "${formatted}"`)
  }
  return parts
}

/** Приводит вход к `Date`; ISO-строка разбирается как момент. */
export function toMoment(input: MomentInput): Date {
  return typeof input === 'string' ? new Date(input) : input
}

/** Число с ведущим нулём до двух знаков — для ключей `YYYY-MM-DD` и `YYYY-MM`. */
export function padDatePart(value: number): string {
  return String(value).padStart(DATE_PART_PAD, '0')
}

/** Киевские компоненты момента. Не зависит от часового пояса устройства. */
export function getKyivParts(input: MomentInput): KyivParts {
  const date = toMoment(input)
  if (Number.isNaN(date.getTime())) {
    throw new KyivCalendarError(`Invalid date: "${String(input)}"`)
  }
  const formatter = getPartsFormatter()
  const parts = readFormattedParts(formatter, date) ?? parseFormattedString(formatter, date)
  return normalizeParts(parts)
}

/** Смещение Киева от UTC в момент `timestampMs`, мс. */
function getKyivOffsetMs(timestampMs: number): number {
  const wallMs = toWallMs(getKyivParts(new Date(timestampMs)))
  return wallMs - Math.floor(timestampMs / MS_PER_SECOND) * MS_PER_SECOND
}

/**
 * Момент киевской полуночи даты. Смещение уточняется второй итерацией,
 * поэтому результат верен и в дни перехода на летнее и зимнее время.
 */
export function kyivMidnightToUtc(year: number, month: number, day: number): Date {
  const wallMs = Date.UTC(year, month - 1, day)
  const firstGuessMs = wallMs - getKyivOffsetMs(wallMs)
  return new Date(wallMs - getKyivOffsetMs(firstGuessMs))
}
