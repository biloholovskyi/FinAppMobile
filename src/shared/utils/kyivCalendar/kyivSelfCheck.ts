import { getKyivDayKey } from './dayKey'
import { formatKyivTime } from './kyivFormat'

export type KyivSelfCheckResult = { ok: true } | { ok: false; error: string }

type SelfCheckCase = { input: string; expectedDay: string; expectedTime: string }

/** Локаль проверки времени: 24-часовой `HH:mm`. */
const SELF_CHECK_LOCALE = 'en-GB'

/** Зима (UTC+2) и лето (UTC+3) с переходом через полночь. */
const SELF_CHECK_CASES: readonly SelfCheckCase[] = [
  { input: '2026-01-15T22:30:00.000Z', expectedDay: '2026-01-16', expectedTime: '00:30' },
  { input: '2026-07-15T21:30:00.000Z', expectedDay: '2026-07-16', expectedTime: '00:30' },
]

function checkCase({ input, expectedDay, expectedTime }: SelfCheckCase): string | null {
  const day = getKyivDayKey(input)
  const time = formatKyivTime(input, SELF_CHECK_LOCALE)
  if (day === expectedDay && time === expectedTime) return null
  return `${input}: expected ${expectedDay} ${expectedTime}, got ${day} ${time}`
}

/** Проверяет, что движок `Intl` считает киевский календарь верно. */
export function verifyKyivCalendar(): KyivSelfCheckResult {
  try {
    const errors = SELF_CHECK_CASES.map(checkCase).filter((error) => error !== null)
    return errors.length === 0 ? { ok: true } : { ok: false, error: errors.join('; ') }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
