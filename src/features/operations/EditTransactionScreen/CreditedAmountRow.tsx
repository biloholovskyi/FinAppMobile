import { View, Text, TextInput } from 'react-native'
import * as icons from 'lucide-react-native'
import { getCurrencySymbol } from '@/shared/utils/currency'

type CreditedAmountRowProps = {
  value: string
  onChangeText: (value: string) => void
  sourceCurrency: string
  targetCurrency: string
  rate: number | null
}

function formatRate(rate: number): string {
  return rate.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export function CreditedAmountRow({
  value,
  onChangeText,
  sourceCurrency,
  targetCurrency,
  rate,
}: CreditedAmountRowProps) {
  const sourceSymbol = getCurrencySymbol(sourceCurrency)
  const targetSymbol = getCurrencySymbol(targetCurrency)
  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/[0.04]">
      <View className="w-[30px] h-[30px] rounded-lg bg-[#181828] border border-white/[0.04] items-center justify-center flex-shrink-0">
        <icons.ArrowDownToLine size={14} color="#8888AA" />
      </View>
      <View className="flex-1 min-w-0 gap-[1px]">
        <Text className="text-[#8888AA] text-[11px] font-medium">Зачислено</Text>
        <View className="flex-row items-baseline">
          <TextInput
            className="text-[#4F9EFF]"
            style={{ fontSize: 17, fontWeight: '700', minWidth: 60, padding: 0 }}
            value={value}
            onChangeText={onChangeText}
            keyboardType="decimal-pad"
            maxLength={12}
            placeholder="0"
            placeholderTextColor="#44445A"
          />
          <Text className="text-[#4F9EFF] ml-1" style={{ fontSize: 17, fontWeight: '700' }}>
            {targetSymbol}
          </Text>
        </View>
      </View>
      {rate !== null && (
        <View
          className="flex-row items-center gap-1 rounded-full px-2.5 py-1 flex-shrink-0"
          style={{ backgroundColor: 'rgba(79,158,255,0.2)' }}
        >
          <icons.Repeat size={11} color="#4F9EFF" />
          <Text className="text-[#4F9EFF] text-[11px] font-medium">
            {`1 ${sourceSymbol} = ${formatRate(rate)} ${targetSymbol}`}
          </Text>
        </View>
      )}
    </View>
  )
}
