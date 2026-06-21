import type { CurrencyRateModel } from '@/shared/api/generated/models'

/** Base currency all exchange rates are expressed against. */
export const UAH_CURRENCY_CODE = 'UAH'

/** Decimal places used for monetary rounding. */
const AMOUNT_DECIMALS = 2

/**
 * Pick the rate used as the "real" market rate for the credited-amount default.
 * Prefers the sell rate, falling back to cross then buy.
 */
export const pickSellRate = (rate: CurrencyRateModel | undefined): number | null => {
  if (!rate) return null
  return rate.rateSell ?? rate.rateCross ?? rate.rateBuy ?? null
}

/** Round a monetary value to AMOUNT_DECIMALS decimals. */
export const roundAmount = (value: number): number => {
  const factor = 10 ** AMOUNT_DECIMALS
  return Math.round(value * factor) / factor
}

/**
 * Convert an amount between currencies using rates expressed vs UAH.
 * `sourceRate` / `targetRate` are units of UAH per 1 unit of currency (UAH itself = 1).
 * Returns null when a required rate is missing or targetRate is zero.
 */
export const computeTargetAmount = (
  absAmount: number,
  sourceRate: number | null,
  targetRate: number | null,
): number | null => {
  if (sourceRate === null || targetRate === null || targetRate === 0) return null
  return roundAmount((absAmount * sourceRate) / targetRate)
}
