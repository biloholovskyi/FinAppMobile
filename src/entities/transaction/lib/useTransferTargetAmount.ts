import { useState } from 'react'
import type { Wallet } from '@/entities/wallet'
import { useCurrencyRateControllerGetRate } from '@/shared/api/generated/currency-rate/currency-rate'
import {
  UAH_CURRENCY_CODE,
  computeTargetAmount,
  pickSellRate,
  roundAmount,
} from '@/shared/utils/currencyConversion'

const RATE_STALE_TIME_MS = 5 * 60 * 1000

type UseTransferTargetAmountParams = {
  isTransfer: boolean
  amount: string
  walletId: string
  targetWalletId: string
  wallets: Wallet[]
}

export function useTransferTargetAmount({
  isTransfer,
  amount,
  walletId,
  targetWalletId,
  wallets,
}: UseTransferTargetAmountParams) {
  const [override, setOverride] = useState<{ key: string; value: string } | null>(null)

  const sourceCurrency = (
    wallets.find((w) => w.id === walletId)?.currency || UAH_CURRENCY_CODE
  ).toUpperCase()
  const targetCurrency = (
    wallets.find((w) => w.id === targetWalletId)?.currency || UAH_CURRENCY_CODE
  ).toUpperCase()

  const isCrossCurrency =
    isTransfer && Boolean(walletId && targetWalletId) && sourceCurrency !== targetCurrency

  const sourceRateQuery = useCurrencyRateControllerGetRate(
    { currency: sourceCurrency },
    { query: { enabled: isCrossCurrency && sourceCurrency !== UAH_CURRENCY_CODE, staleTime: RATE_STALE_TIME_MS } },
  )
  const targetRateQuery = useCurrencyRateControllerGetRate(
    { currency: targetCurrency },
    { query: { enabled: isCrossCurrency && targetCurrency !== UAH_CURRENCY_CODE, staleTime: RATE_STALE_TIME_MS } },
  )

  const sourceRate = sourceCurrency === UAH_CURRENCY_CODE ? 1 : pickSellRate(sourceRateQuery.data)
  const targetRate = targetCurrency === UAH_CURRENCY_CODE ? 1 : pickSellRate(targetRateQuery.data)

  const absAmount = Math.abs(Number(amount.replace(',', '.'))) || 0
  const computed = !isTransfer
    ? null
    : isCrossCurrency
      ? computeTargetAmount(absAmount, sourceRate, targetRate)
      : absAmount

  const contextKey = `${isTransfer}|${walletId}|${targetWalletId}`
  const overrideValue = override && override.key === contextKey ? override.value : null
  const targetAmountValue =
    overrideValue ?? (computed === null || amount === '' ? '' : String(computed))
  const targetAmountNumber = Math.abs(Number(targetAmountValue.replace(',', '.'))) || 0

  const conversionRate =
    isCrossCurrency && sourceRate !== null && targetRate !== null
      ? roundAmount(sourceRate / targetRate)
      : null

  return {
    targetAmountValue,
    targetAmountNumber,
    handleTargetAmountChange: (value: string) => setOverride({ key: contextKey, value }),
    isCrossCurrency,
    sourceCurrency,
    targetCurrency,
    conversionRate,
  }
}
