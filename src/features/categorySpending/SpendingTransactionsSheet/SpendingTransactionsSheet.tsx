import { useCallback } from 'react'
import { View, Text, SectionList, ActivityIndicator } from 'react-native'
import type { SectionListRenderItem } from 'react-native'
import { DeleteTransactionModal, type Transaction } from '@/entities/transaction'
import { SheetHeader } from './SheetHeader'
import { SheetSummary } from './SheetSummary'
import { SheetDayHeader } from './SheetDayHeader'
import { SheetEmptyState } from './SheetEmptyState'
import { SheetTransactionRow } from './SheetTransactionRow'
import { useSpendingTransactionsSheet } from './useSpendingTransactionsSheet'
import type { DaySection } from './lib/groupTransactionsByDay'

type SpendingTransactionsSheetProps = {
  leafKey: string
  monthStr: string
  onEditTransaction: (id: string) => void
  onClose: () => void
}

/** Шторка транзакций листа расходов за месяц с редактированием и удалением. */
export function SpendingTransactionsSheet({
  leafKey,
  monthStr,
  onEditTransaction,
  onClose,
}: SpendingTransactionsSheetProps) {
  const sheet = useSpendingTransactionsSheet({ leafKey, monthStr })
  const { requestDelete } = sheet

  const renderItem = useCallback<SectionListRenderItem<Transaction, DaySection>>(
    ({ item }) => (
      <SheetTransactionRow tx={item} onEdit={onEditTransaction} onDelete={requestDelete} />
    ),
    [onEditTransaction, requestDelete],
  )

  const renderSectionHeader = useCallback(
    ({ section }: { section: DaySection }) => <SheetDayHeader section={section} />,
    [],
  )

  return (
    <View className="flex-1 bg-[#10101C]">
      <SheetHeader row={sheet.row} selectedMonth={sheet.selectedMonth} onClose={onClose} />

      {sheet.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4F9EFF" size="large" />
        </View>
      ) : sheet.isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-[14px] text-[#8888AA]">Не удалось загрузить данные</Text>
        </View>
      ) : (
        <SectionList<Transaction, DaySection>
          sections={sheet.sections}
          keyExtractor={(tx) => tx.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-8 pt-3"
          ListHeaderComponent={
            <SheetSummary
              spent={sheet.spent}
              count={sheet.leafTransactions.length}
              budget={sheet.row?.budget ?? null}
            />
          }
          ListEmptyComponent={<SheetEmptyState />}
        />
      )}

      <DeleteTransactionModal
        transaction={sheet.pendingDelete}
        isDeleting={sheet.isDeleting}
        onConfirm={sheet.confirmDelete}
        onCancel={sheet.cancelDelete}
      />
    </View>
  )
}
