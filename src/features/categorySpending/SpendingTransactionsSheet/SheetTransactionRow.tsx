import { View, Text, TouchableOpacity } from 'react-native'
import { Pencil, Trash2 } from 'lucide-react-native'
import {
  TransactionAmountUah,
  getTransactionCurrency,
  type Transaction,
} from '@/entities/transaction'
import { formatAmount, getCurrencySymbol } from '@/shared/utils/currency'
import { formatTime } from '@/shared/utils/dateAndTime'

const EMPTY_DESCRIPTION = '—'

type SheetTransactionRowProps = {
  tx: Transaction
  onEdit: (id: string) => void
  onDelete: (tx: Transaction) => void
}

/** Строка транзакции шторки: описание, время и кошелёк, сумма, карандаш и корзина. */
export function SheetTransactionRow({ tx, onEdit, onDelete }: SheetTransactionRowProps) {
  const symbol = getCurrencySymbol(getTransactionCurrency(tx))
  const meta = [formatTime(tx.transactionTime), tx.wallet?.name].filter(Boolean).join(' · ')

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 border-b border-white/[0.04] py-2.5"
      activeOpacity={0.7}
      onPress={() => onEdit(tx.id)}
    >
      <View className="min-w-0 flex-1 gap-[3px]">
        <Text className="text-[13px] font-medium text-[#F2F2FF]" numberOfLines={1}>
          {tx.description || EMPTY_DESCRIPTION}
        </Text>
        <Text className="text-[10px] text-[#44445A]" numberOfLines={1}>{meta}</Text>
      </View>

      <View className="shrink-0 items-end gap-[2px]">
        <Text style={{ color: '#FF4B6B', fontFamily: 'monospace', fontSize: 13, fontWeight: '700' }}>
          {`−${formatAmount(Math.abs(tx.amount))} ${symbol}`}
        </Text>
        <TransactionAmountUah tx={tx} />
      </View>

      <View className="flex-row gap-1.5">
        <TouchableOpacity
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-[rgba(79,158,255,0.25)]"
          activeOpacity={0.7}
          hitSlop={8}
          onPress={() => onEdit(tx.id)}
          accessibilityLabel="Изменить"
        >
          <Pencil size={13} color="#4F9EFF" />
        </TouchableOpacity>
        <TouchableOpacity
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-[rgba(255,75,107,0.2)]"
          activeOpacity={0.7}
          hitSlop={8}
          onPress={() => onDelete(tx)}
          accessibilityLabel="Удалить"
        >
          <Trash2 size={13} color="#FF4B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}
