import { router, useLocalSearchParams } from 'expo-router'
import { SpendingTransactionsSheet } from '@/features/categorySpending/SpendingTransactionsSheet/SpendingTransactionsSheet'
import { normalizeMonthParam } from '@/features/categorySpending/lib/normalizeMonthParam'

function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

/** Шторка транзакций листа расходов; редактирование открывается поверх неё. */
export default function SpendingTransactionsRoute() {
  const params = useLocalSearchParams<{ leafKey: string; month: string }>()

  return (
    <SpendingTransactionsSheet
      leafKey={firstParam(params.leafKey)}
      month={normalizeMonthParam(firstParam(params.month))}
      onEditTransaction={(id) => router.push(`/transaction/${id}`)}
      onClose={() => router.back()}
    />
  )
}
