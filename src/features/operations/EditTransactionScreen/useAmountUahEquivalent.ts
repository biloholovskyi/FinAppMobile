import { useCurrencyRateControllerGetRate } from '@/shared/api/generated/currency-rate/currency-rate'
import { RATE_STALE_TIME_MS } from '@/shared/constants/currencyRate'
import { UAH_CURRENCY_CODE, pickBackendRate } from '@/shared/utils/currencyConversion'

type UseAmountUahEquivalentParams = {
  isTransfer: boolean
  currency: string
  amountKopecks: number
  storedRate: number | null
}

/** UAH equivalent (kopecks, rate, visibility) of a foreign-currency amount in the editor. */
export function useAmountUahEquivalent({
  isTransfer,
  currency,
  amountKopecks,
  storedRate,
}: UseAmountUahEquivalentParams) {
  const code = currency.toUpperCase()
  const isEligible = !isTransfer && code !== '' && code !== UAH_CURRENCY_CODE

  const rateQuery = useCurrencyRateControllerGetRate(
    { currency: code },
    { query: { enabled: isEligible && storedRate === null, staleTime: RATE_STALE_TIME_MS } },
  )

  const rate = storedRate ?? pickBackendRate(rateQuery.data)
  const isVisible = isEligible && rate !== null
  const amountUahKopecks = rate === null ? 0 : Math.round(amountKopecks * rate)

  return { isVisible, amountUahKopecks, rate }
}

export type AmountUahEquivalentState = ReturnType<typeof useAmountUahEquivalent>
