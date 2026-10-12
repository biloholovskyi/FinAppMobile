import { useMemo } from 'react'
import { WalletTransactionType, getSignedUahAmount, type Transaction } from '@/entities/transaction'
import {
  formatDayKey,
  getKyivDayKey,
  getKyivToday,
  shiftDayKey,
  type DayKey,
} from '@/shared/utils/kyivCalendar'

export type FilterType = 'all' | WalletTransactionType

export type DayGroup = {
  label: string
  /** Киевская дата группы. */
  date: DayKey
  total: number
  hasTotal: boolean
  data: Transaction[]
}

export const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: WalletTransactionType.expense, label: 'Расходы' },
  { key: WalletTransactionType.income, label: 'Доходы' },
  { key: WalletTransactionType.transfer, label: 'Переводы' },
]

const DAY_LABEL_OPTIONS = { day: 'numeric', month: 'long', year: 'numeric' } as const

/** Заголовок дня по киевскому календарю: «Сегодня», «Вчера» или дата. */
function formatDayLabel(day: DayKey, today: DayKey): string {
  if (day === today) return 'Сегодня'
  if (day === shiftDayKey(today, -1)) return 'Вчера'
  return formatDayKey(day, 'ru-RU', DAY_LABEL_OPTIONS)
}

type UnlabeledDayGroup = Omit<DayGroup, 'label'>

/** Группирует транзакции по киевским дням; новые дни сверху. */
function groupByKyivDay(transactions: Transaction[]): UnlabeledDayGroup[] {
  const map: Record<string, UnlabeledDayGroup> = {}
  for (const tx of transactions) {
    const date = getKyivDayKey(tx.transactionTime)
    map[date] ??= { date, total: 0, hasTotal: false, data: [] }
    map[date].data.push(tx)
    const signedUah = getSignedUahAmount(tx)
    if (signedUah !== null) {
      map[date].total += signedUah
      map[date].hasTotal = true
    }
  }
  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Группирует загруженные транзакции по дням и отдаёт количество видимых после фильтра строк.
 * Заголовки пересчитываются, когда меняется киевское «сегодня».
 */
export function useTransactionsDayGroups(transactions: Transaction[], filter: FilterType) {
  const filtered = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((tx) => tx.type === filter)),
    [transactions, filter],
  )
  const groups = useMemo(() => groupByKyivDay(filtered), [filtered])
  const today = getKyivToday()

  return useMemo(
    () => ({
      sections: groups.map((group) => ({ ...group, label: formatDayLabel(group.date, today) })),
      visibleCount: filtered.length,
    }),
    [groups, today, filtered.length],
  )
}
