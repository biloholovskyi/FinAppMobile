export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

export function formatDayTotal(total: number): string {
  const formatted = (Math.abs(total) / 100).toLocaleString('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return total >= 0 ? `+${formatted} ₴` : `−${formatted} ₴`
}