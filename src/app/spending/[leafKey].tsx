import { router, useLocalSearchParams } from 'expo-router'
import { SpendingTransactionsSheet } from '@/features/categorySpending/SpendingTransactionsSheet/SpendingTransactionsSheet'
import { normalizeMonthStr } from '@/features/categorySpending/lib/parseMonthStr'

function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

/** Шторка транзакций листа расходов; редактирование открывается поверх неё. */
export default function SpendingTransactionsRoute() {
  const params = useLocalSearchParams<{ leafKey: string; month: string }>()

  return (
    <SpendingTransactionsSheet
      leafKey={firstParam(params.leafKey)}
      monthStr={normalizeMonthStr(firstParam(params.month))}
      onEditTransaction={(id) => router.push(`/transaction/${id}`)}
      onClose={() => router.back()}
    />
  )
}
