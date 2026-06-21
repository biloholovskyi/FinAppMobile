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

/**
 * Resolve the display symbol (₴, $, €...) for an ISO 4217 currency code.
 * Falls back to the code itself when the symbol can't be derived.
 */
export function getCurrencySymbol(currencyCode: string | null | undefined, locale = 'uk-UA'): string {
  const code = (currencyCode || 'UAH').toUpperCase()
  try {
    const parts = new Intl.NumberFormat(locale, { style: 'currency', currency: code }).formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value ?? code
  } catch {
    return code
  }
}

export function parseAmountInput(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.')
  if (normalized === '') return null
  const value = Number(normalized)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}
