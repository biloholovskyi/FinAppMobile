import { View, Text, TextInput } from 'react-native'
import { getCurrencySymbol } from '@/shared/utils/currency'
import { AmountUahEquivalent } from './AmountUahEquivalent'
import type { AmountUahEquivalentState } from './useAmountUahEquivalent'

type AmountFieldProps = {
  value: string
  onChangeText: (value: string) => void
  accentColor: string
  sign: string
  currency: string
  isReadOnly?: boolean
  hint?: string | null
  uahEquivalent?: AmountUahEquivalentState
}

export function AmountField({
  value,
  onChangeText,
  accentColor,
  sign,
  currency,
  isReadOnly,
  hint,
  uahEquivalent,
}: AmountFieldProps) {
  return (
    <View className="items-center px-5 pb-6 gap-1.5">
      <Text className="text-[#8888AA] text-[11px] font-medium uppercase tracking-[0.6px]">Сумма</Text>
      <View
        className="flex-row items-baseline justify-center w-full pb-2.5 border-b"
        style={{ borderBottomColor: isReadOnly ? '#44445A' : accentColor }}
      >
        {sign ? (
          <Text style={{ color: accentColor, fontSize: 36, fontWeight: '700', marginRight: 2 }}>{sign}</Text>
        ) : null}
        <TextInput
          className={`text-center min-w-[40px] max-w-[220px] ${isReadOnly ? 'text-[#8888AA]' : 'text-[#F2F2FF]'}`}
          style={{ fontSize: 42, fontWeight: '700', letterSpacing: -2 }}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          maxLength={10}
          selectTextOnFocus={!isReadOnly}
          editable={!isReadOnly}
        />
        <Text className="text-[#8888AA]" style={{ fontSize: 24, fontWeight: '700' }}>
          {getCurrencySymbol(currency)}
        </Text>
      </View>
      {uahEquivalent?.isVisible && uahEquivalent.rate !== null ? (
        <AmountUahEquivalent
          amountUahKopecks={uahEquivalent.amountUahKopecks}
          rate={uahEquivalent.rate}
          currency={currency}
        />
      ) : null}
      {hint ? <Text className="text-[#44445A] text-[11px]">{hint}</Text> : null}
    </View>
  )
}
