export function formatAmount(kopecks: number): string {
  return (Math.abs(kopecks) / 100).toLocaleString('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function formatUah(value: number, kopecks?: boolean): string {
  if (!kopecks) {
    return value.toLocaleString('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      maximumFractionDigits: 0,
    })
  }
  return (value / 100).toLocaleString('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  })
}

export function parseAmountInput(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.')
  if (normalized === '') return null
  const value = Number(normalized)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}
