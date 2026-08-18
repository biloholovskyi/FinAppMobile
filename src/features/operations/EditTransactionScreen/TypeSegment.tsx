import { View, Text, TouchableOpacity } from 'react-native'
import { WalletTransactionType } from '@/entities/transaction'
import { hexToRgba } from '@/shared/utils/colors'

export const TYPE_COLOR: Record<WalletTransactionType, string> = {
  [WalletTransactionType.expense]: '#FF4B6B',
  [WalletTransactionType.income]: '#00E089',
  [WalletTransactionType.transfer]: '#4F9EFF',
}
export const TYPE_SIGN: Record<WalletTransactionType, string> = {
  [WalletTransactionType.expense]: '−',
  [WalletTransactionType.income]: '+',
  [WalletTransactionType.transfer]: '',
}
const TYPE_LABEL: Record<WalletTransactionType, string> = {
  [WalletTransactionType.expense]: 'Расход',
  [WalletTransactionType.income]: 'Доход',
  [WalletTransactionType.transfer]: 'Перевод',
}
const TYPES = [
  WalletTransactionType.expense,
  WalletTransactionType.income,
  WalletTransactionType.transfer,
] as const

type TypeSegmentProps = {
  type: WalletTransactionType
  onChange: (type: WalletTransactionType) => void
}

export function TypeSegment({ type, onChange }: TypeSegmentProps) {
  return (
    <View className="px-5 pb-4">
      <View className="flex-row bg-[#181828] border border-white/[0.08] rounded-2xl p-1 gap-0.5">
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            className="flex-1 py-2 rounded-lg items-center"
            style={type === t ? { backgroundColor: hexToRgba(TYPE_COLOR[t], 0.2) } : undefined}
            onPress={() => onChange(t)}
            activeOpacity={0.7}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: type === t ? TYPE_COLOR[t] : '#44445A' }}
            >
              {TYPE_LABEL[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
