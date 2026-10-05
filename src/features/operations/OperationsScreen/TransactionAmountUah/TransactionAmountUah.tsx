import { Text } from 'react-native'
import {
  getSignedUahAmount,
  isForeignCurrencyTransaction,
  type Transaction,
} from '@/entities/transaction'
import { formatAmount, getCurrencySymbol } from '@/shared/utils/currency'
import { UAH_CURRENCY_CODE } from '@/shared/utils/currencyConversion'

const UAH_SYMBOL = getCurrencySymbol(UAH_CURRENCY_CODE)

type TransactionAmountUahProps = { tx: Transaction }

/** Строка эквивалента в гривнах под суммой валютной транзакции. */
export function TransactionAmountUah({ tx }: TransactionAmountUahProps) {
  if (!isForeignCurrencyTransaction(tx)) return null

  const signedUah = getSignedUahAmount(tx)
  if (signedUah === null) return null

  const sign = signedUah < 0 ? '−' : '+'

  return (
    <Text className="text-[#8888AA] text-[10px] font-[monospace]">
      {`≈ ${sign}${formatAmount(Math.abs(signedUah))} ${UAH_SYMBOL}`}
    </Text>
  )
}
