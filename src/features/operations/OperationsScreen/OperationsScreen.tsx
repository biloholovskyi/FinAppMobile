import { useCallback } from 'react'
import {
  View,
  Text,
  SectionList,
  ScrollView,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  type SectionListRenderItem,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as icons from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'
import { WalletTransactionType, type Transaction } from '@/entities/transaction'
import { FILTERS, useOperationsScreen, type DayGroup } from './useOperationsScreen'
import { resolveIcon } from '@/shared/utils/icons'
import { hexToRgba } from '@/shared/utils/colors'
import { formatAmount } from '@/shared/utils/currency'
import { formatDayTotal, formatTime } from '@/shared/utils/dateAndTime'

type TxItemProps = { tx: Transaction; onEdit: (id: string) => void; onDelete: (id: string) => void }

function TxItem({ tx, onEdit, onDelete }: TxItemProps) {
  const categoryInfo = tx.subCategory ?? tx.category ?? null
  const isTransfer = tx.type === WalletTransactionType.transfer
  const isIncome = tx.type === WalletTransactionType.income

  const color = isTransfer ? '#4F9EFF' : categoryInfo?.color ?? '#8888AA'
  const iconBg = hexToRgba(color, 0.15)

  const IconComponent: LucideIcon = isTransfer
    ? icons.ArrowRightLeft
    : resolveIcon(categoryInfo?.icon ?? '')

  const amountStr = isIncome ? `+${formatAmount(tx.amount)} ₴` : `−${formatAmount(tx.amount)} ₴`
  const amountColor = isIncome ? '#00E089' : '#FF4B6B'

  return (
    <View className="flex-row items-center gap-3 py-2.5 border-b border-white/[0.04]">
      <View className="w-[38px] h-[38px] rounded-xl items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}>
        <IconComponent size={16} color={color} />
      </View>

      <View className="flex-1 min-w-0 gap-[3px]">
        <Text className="text-[#F2F2FF] text-[13px] font-medium" numberOfLines={1}>
          {tx.description || '—'}
        </Text>
        <View className="flex-row items-center gap-1.5">
          {categoryInfo && (
            <View className="rounded-full px-[7px] py-[2px]" style={{ backgroundColor: hexToRgba(color, 0.15) }}>
              <Text style={{ color, fontSize: 10, fontWeight: '500' }}>
                {categoryInfo.name}
              </Text>
            </View>
          )}
          {isTransfer && !categoryInfo && (
            <View className="rounded-full px-[7px] py-[2px]" style={{ backgroundColor: hexToRgba(color, 0.15) }}>
              <Text style={{ color, fontSize: 10, fontWeight: '500' }}>Перевод</Text>
            </View>
          )}
        </View>
        {tx.wallet && (
          <Text className="text-[#44445A] text-[10px]" numberOfLines={1}>{tx.wallet.name ?? ''}</Text>
        )}
      </View>

      <View className="items-end justify-center gap-[7px] flex-shrink-0">
        <View className="items-end gap-[2px]">
          <Text style={{ color: amountColor, fontFamily: 'monospace', fontSize: 13, fontWeight: '700' }}>
            {amountStr}
          </Text>
          <Text className="text-[#44445A] text-[10px]">{formatTime(tx.transactionTime)}</Text>
        </View>
        <View className="flex-row gap-[6px]">
          <TouchableOpacity
            className="w-[30px] h-[30px] rounded-full items-center justify-center bg-[rgba(79,158,255,0.25)]"
            activeOpacity={0.7}
            hitSlop={8}
            onPress={() => onEdit(tx.id)}
          >
            <icons.Pencil size={13} color="#4F9EFF" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30px] h-[30px] rounded-full items-center justify-center bg-[rgba(255,75,107,0.2)]"
            activeOpacity={0.7}
            hitSlop={8}
            onPress={() => onDelete(tx.id)}
          >
            <icons.Trash2 size={13} color="#FF4B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export function OperationsScreen() {
  const { filter, setFilter, grouped, isLoading, refetch, isRefetching, onDelete } = useOperationsScreen()

  const currentMonth = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  const handleEdit = useCallback((id: string) => {
    router.push(`/transaction/${id}`)
  }, [])

  const renderItem = useCallback<SectionListRenderItem<Transaction, DayGroup>>(
    ({ item }) => <TxItem tx={item} onEdit={handleEdit} onDelete={onDelete} />,
    [handleEdit, onDelete],
  )

  const renderSectionHeader = useCallback(
    ({ section }: { section: DayGroup }) => {
      const isPositive = section.total >= 0
      return (
        <View>
          <View className="flex-row items-center justify-between py-2.5">
            <Text className="text-[#8888AA] text-[12px] font-semibold uppercase tracking-[0.3px]">
              {section.label}
            </Text>
            <Text style={{ color: isPositive ? '#00E089' : '#FF4B6B', fontSize: 12, fontWeight: '700' }}>
              {formatDayTotal(section.total)}
            </Text>
          </View>
          <View className="h-px bg-white/[0.04] mb-1.5" />
        </View>
      )
    },
    [],
  )

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      <View className="flex-row items-start justify-between px-5 pt-4 pb-2.5">
        <View className="gap-0.5">
          <Text className="text-[#F2F2FF] text-[22px] font-bold tracking-[-0.4px]">
            Транзакции
          </Text>
          <Text className="text-[#8888AA] text-[12px] capitalize">{currentMonth}</Text>
        </View>
        <TouchableOpacity
          className="w-[34px] h-[34px] rounded-xl bg-[#4F9EFF] items-center justify-center"
          activeOpacity={0.8}
          onPress={() => router.push('/transaction/create')}
        >
          <icons.Plus size={18} color="#080810" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        className="flex-grow-0 px-5 mb-3" contentContainerClassName="gap-2 pb-0.5">
        {FILTERS.map(f => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            className={`px-[14px] py-1.5 rounded-full border ${
              filter === f.key
                ? 'border-[#4F9EFF] bg-[rgba(79,158,255,0.25)]'
                : 'border-white/[0.08] bg-[#181828]'
            }`}
          >
            <Text className={`text-[12px] font-medium ${
              filter === f.key ? 'text-[#4F9EFF]' : 'text-[#8888AA]'
            }`}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#8888AA] text-sm">Загрузка...</Text>
        </View>
      ) : grouped.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#8888AA] text-sm">Транзакций нет</Text>
        </View>
      ) : (
        <SectionList
          className="flex-1"
          contentContainerClassName="px-5 pb-4"
          sections={grouped}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4F9EFF"
              colors={['#4F9EFF']}
            />
          }
        />
      )}
    </SafeAreaView>
  )
}
