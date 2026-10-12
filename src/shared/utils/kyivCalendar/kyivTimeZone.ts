import { KYIV_TIME_ZONE, KYIV_TIME_ZONE_LEGACY } from '@/shared/constants/calendar'

let resolvedTimeZone: string | null = null

function isTimeZoneSupported(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone })
    return true
  } catch (err) {
    if (err instanceof RangeError) return false
    throw err
  }
}

/**
 * Имя киевской зоны, которое понимает движок `Intl` устройства:
 * `KYIV_TIME_ZONE`, а на старой tzdata — `KYIV_TIME_ZONE_LEGACY`. Определяется один раз.
 */
export function getKyivTimeZone(): string {
  resolvedTimeZone ??= isTimeZoneSupported(KYIV_TIME_ZONE) ? KYIV_TIME_ZONE : KYIV_TIME_ZONE_LEGACY
  return resolvedTimeZone
}
