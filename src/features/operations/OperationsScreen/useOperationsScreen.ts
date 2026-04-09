import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/shared/api/transactions'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { WalletTransactionType, type Transaction } from '@/entities/transaction'

type FilterType = 'all' | WalletTransactionType

export type DayGroup = {
  label: string
  date: string
  total: number
  data: Transaction[]
}

function formatDayLabel(dateStr: string): string {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (dateStr === todayStr) return 'Сегодня'
  if (dateStr === yesterdayStr) return 'Вчера'

  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: WalletTransactionType.expense, label: 'Расходы' },
  { key: WalletTransactionType.income, label: 'Доходы' },
  { key: WalletTransactionType.transfer, label: 'Переводы' },
]

export function useOperationsScreen() {
  const [filter, setFilter] = useState<FilterType>('all')

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: fetchTransactions,
  })

  const grouped = useMemo<DayGroup[]>(() => {
    const filtered =
      filter === 'all' ? transactions : transactions.filter(tx => tx.type === filter)

    const map: Record<string, DayGroup> = {}
    for (const tx of filtered) {
      const date = tx.transactionTime.slice(0, 10)
      if (!map[date]) {
        map[date] = { label: formatDayLabel(date), date, total: 0, data: [] }
      }
      map[date].data.push(tx)
      map[date].total += tx.amount 
    }

    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, filter])

  return { filter, setFilter, grouped, isLoading }
}
