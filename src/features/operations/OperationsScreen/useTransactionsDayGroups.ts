import { useMemo } from 'react'
import { WalletTransactionType, type Transaction } from '@/entities/transaction'

/** Длина части `YYYY-MM-DD` в ISO-строке даты. */
const ISO_DATE_LENGTH = 10

export type FilterType = 'all' | WalletTransactionType

export type DayGroup = {
  label: string
  date: string
  total: number
  data: Transaction[]
}

export const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: WalletTransactionType.expense, label: 'Расходы' },
  { key: WalletTransactionType.income, label: 'Доходы' },
  { key: WalletTransactionType.transfer, label: 'Переводы' },
]

function formatDayLabel(dateStr: string): string {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, ISO_DATE_LENGTH)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, ISO_DATE_LENGTH)

  if (dateStr === todayStr) return 'Сегодня'
  if (dateStr === yesterdayStr) return 'Вчера'

  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Группирует загруженные транзакции по дням и отдаёт количество видимых после фильтра строк. */
export function useTransactionsDayGroups(transactions: Transaction[], filter: FilterType) {
  return useMemo(() => {
    const filtered =
      filter === 'all' ? transactions : transactions.filter((tx) => tx.type === filter)

    const map: Record<string, DayGroup> = {}
    for (const tx of filtered) {
      const date = tx.transactionTime.slice(0, ISO_DATE_LENGTH)
      if (!map[date]) {
        map[date] = { label: formatDayLabel(date), date, total: 0, data: [] }
      }
      map[date].data.push(tx)
      map[date].total += tx.amount
    }

    return {
      sections: Object.values(map).sort((a, b) => b.date.localeCompare(a.date)),
      visibleCount: filtered.length,
    }
  }, [transactions, filter])
}
