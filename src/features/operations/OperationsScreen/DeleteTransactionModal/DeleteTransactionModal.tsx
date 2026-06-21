import { Modal, View, Text, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as icons from 'lucide-react-native'
import type { Transaction } from '@/entities/transaction'
import { useDeleteTransactionModal } from './useDeleteTransactionModal'

type Props = {
  transaction: Transaction | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ModalContent({ transaction, isDeleting, onConfirm, onCancel }: Props & { transaction: Transaction }) {
  const tx = useDeleteTransactionModal(transaction)

  return (
    <View className="bg-[#10101C] rounded-t-3xl border-t border-white/[0.08] pt-3.5 px-5 pb-7 items-center">
      <View className="w-9 h-1 rounded-full bg-white/[0.16] mb-[18px]" />

      <View className="w-14 h-14 rounded-full items-center justify-center bg-[rgba(255,75,107,0.2)] mb-4">
        <icons.Trash2 size={26} color="#FF4B6B" />
      </View>

      <Text className="text-[#F2F2FF] text-xl font-bold text-center mb-4">
        Удалить транзакцию?
      </Text>

      <View className="w-full bg-[#181828] border border-white/[0.08] rounded-2xl px-3.5 py-1 mb-4">
        <View className="flex-row items-center gap-3 py-2.5">
          <View className="w-[38px] h-[38px] rounded-xl items-center justify-center flex-shrink-0"
            style={{ backgroundColor: tx.iconBg }}>
            <tx.IconComponent size={16} color={tx.color} />
          </View>

          <View className="flex-1 min-w-0 gap-[3px]">
            <Text className="text-[#F2F2FF] text-[13px] font-medium" numberOfLines={1}>
              {tx.description}
            </Text>
            {tx.badgeLabel && (
              <View className="flex-row items-center gap-1.5">
                <View className="rounded-full px-[7px] py-[2px]" style={{ backgroundColor: tx.badgeBg }}>
                  <Text style={{ color: tx.color, fontSize: 10, fontWeight: '500' }}>
                    {tx.badgeLabel}
                  </Text>
                </View>
              </View>
            )}
            {tx.walletName && (
              <Text className="text-[#44445A] text-[10px]" numberOfLines={1}>{tx.walletName}</Text>
            )}
          </View>

          <View className="items-end gap-[2px] flex-shrink-0">
            <Text style={{ color: tx.amountColor, fontFamily: 'monospace', fontSize: 13, fontWeight: '700' }}>
              {tx.amountStr}
            </Text>
            <Text className="text-[#44445A] text-[10px]">{tx.time}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-start gap-2 px-1 mb-6">
        <icons.AlertTriangle size={15} color="#FFB020" />
        <Text className="flex-1 text-[#8888AA] text-xs leading-[18px]">
          Это действие нельзя отменить. Транзакция будет удалена навсегда.
        </Text>
      </View>

      <View className="flex-row gap-[10px] w-full">
        <TouchableOpacity
          className={`flex-1 h-[50px] rounded-2xl items-center justify-center bg-[#181828] border border-white/[0.16] ${isDeleting ? 'opacity-50' : ''}`}
          activeOpacity={0.7}
          disabled={isDeleting}
          onPress={onCancel}
        >
          <Text className="text-[#F2F2FF] text-sm font-semibold">Отмена</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 h-[50px] rounded-2xl items-center justify-center bg-[#FF4B6B] flex-row gap-1.5 ${isDeleting ? 'opacity-50' : ''}`}
          activeOpacity={0.7}
          disabled={isDeleting}
          onPress={onConfirm}
        >
          {isDeleting ? (
            <ActivityIndicator color="#F2F2FF" size="small" />
          ) : (
            <>
              <icons.Trash2 size={15} color="#F2F2FF" />
              <Text className="text-[#F2F2FF] text-sm font-semibold">Удалить</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function DeleteTransactionModal({ transaction, isDeleting, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={!!transaction} animationType="slide" transparent onRequestClose={onCancel}>
      <Pressable className="flex-1 bg-black/70" onPress={isDeleting ? undefined : onCancel} />
      {transaction && (
        <ModalContent
          transaction={transaction}
          isDeleting={isDeleting}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </Modal>
  )
}
