import { View, Text } from 'react-native'
import { formatAmountFixed, getCurrencySymbol } from '@/shared/utils/currency'
import { UAH_CURRENCY_CODE } from '@/shared/utils/currencyConversion'

type AmountUahEquivalentProps = {
  amountUahKopecks: number
  rate: number
  currency: string
}

function formatRate(rate: number): string {
  return rate.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

/** Pill with the UAH equivalent and the applied rate under the amount input. */
export function AmountUahEquivalent({ amountUahKopecks, rate, currency }: AmountUahEquivalentProps) {
  const uahSymbol = getCurrencySymbol(UAH_CURRENCY_CODE)
  return (
    <View className="items-center gap-1 pt-1">
      <View
        className="rounded-full bg-[rgba(79,158,255,0.2)] px-2.5 py-1"
      >
        <Text className="text-[#4F9EFF] text-[13px] font-semibold">
          {`≈ ${formatAmountFixed(amountUahKopecks)} ${uahSymbol}`}
        </Text>
      </View>
      <Text className="text-[#44445A] text-[11px]">
        {`1 ${getCurrencySymbol(currency)} = ${formatRate(rate)} ${uahSymbol}`}
      </Text>
    </View>
  )
}
