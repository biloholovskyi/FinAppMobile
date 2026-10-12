import { KOPECK_DIVISOR } from '@/shared/constants/money'
import { formatKyivTime } from '@/shared/utils/kyivCalendar'

/** Время момента `HH:mm` по Киеву. */
export function formatTime(iso: string): string {
  return formatKyivTime(iso, 'uk-UA')
}

export function formatDayTotal(total: number): string {
  const formatted = (Math.abs(total) / KOPECK_DIVISOR).toLocaleString('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return total >= 0 ? `+${formatted} ₴` : `−${formatted} ₴`
}