import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getCurrencyRateControllerGetRateQueryOptions } from '../../../shared/api/generated/currency-rate/currency-rate'
import type { Wallet } from '../../../entities/wallet'

const UAH = 'UAH'

/**
 * Sums wallet balances in UAH kopecks. Non-UAH wallets are converted via the
 * Monobank rate (rateBuy, fallback rateCross). Wallets whose rate is not yet
 * loaded are excluded until the rate query resolves.
 */
export function useWalletsTotalBalance(wallets: Wallet[]): number {
  const foreignCurrencies = useMemo(
    () =>
      Array.from(
        new Set(
          wallets
            .map((w) => w.currency.toUpperCase())
            .filter((currency) => currency !== UAH),
        ),
      ),
    [wallets],
  )

  const rateQueries = useQueries({
    queries: foreignCurrencies.map((currency) =>
      getCurrencyRateControllerGetRateQueryOptions({ currency }),
    ),
  })

  const ratesByCurrency = useMemo(() => {
    const map: Record<string, number | undefined> = {}
    foreignCurrencies.forEach((currency, index) => {
      const data = rateQueries[index]?.data
      map[currency] = data?.rateBuy ?? data?.rateCross ?? undefined
    })
    return map
  }, [foreignCurrencies, rateQueries])

  return useMemo(
    () =>
      wallets.reduce((sum, w) => {
        const currency = w.currency.toUpperCase()
        if (currency === UAH) return sum + w.balance
        const rate = ratesByCurrency[currency]
        if (rate == null) return sum
        return sum + w.balance * rate
      }, 0),
    [wallets, ratesByCurrency],
  )
}
