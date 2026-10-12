/**
 * Разбирает `monthStr` (`YYYY-MM-01T00:00:00.000Z`) в начало месяца по локальному времени.
 * Месяц берётся из строки, а не через `new Date`, чтобы часовой пояс не сдвигал его.
 * Некорректная строка даёт текущий месяц.
 */
export function parseMonthStr(monthStr: string): Date {
  const [yearPart, monthPart] = monthStr.split('-')
  const year = Number(yearPart)
  const month = Number(monthPart)
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
  return new Date(year, month - 1, 1)
}

const MONTH_PAD = 2

/** Строка месяца `YYYY-MM-01T00:00:00.000Z` — ключ запроса бюджета. */
export function toMonthStr(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(MONTH_PAD, '0')
  return `${date.getFullYear()}-${month}-01T00:00:00.000Z`
}

/** Приводит параметр маршрута к корректной строке месяца; пустой или битый — текущий месяц. */
export function normalizeMonthStr(raw: string | undefined): string {
  return toMonthStr(parseMonthStr(raw ?? ''))
}
