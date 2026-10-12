import type { Transaction } from '@/entities/transaction'
import { getTransactionAmountUah } from '@/entities/transaction'
import { formatDayKey, getKyivDayKey, type DayKey } from '@/shared/utils/kyivCalendar'

/** Секция шторки: транзакции одного киевского дня. */
export type DaySection = {
  /** Киевская дата. */
  dayKey: DayKey
  title: string
  /** Сумма дня в UAH, копейки, по модулю. */
  totalUah: number
  data: Transaction[]
}

const DAY_TITLE_OPTIONS = { day: 'numeric', month: 'long', weekday: 'long' } as const

/**
 * Группирует транзакции по киевским дням; дни и записи внутри — новые сверху.
 *
 * @param transactions Транзакции листа.
 */
export function groupTransactionsByDay(transactions: Transaction[]): DaySection[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.transactionTime).getTime() - new Date(a.transactionTime).getTime(),
  )
  const sections = new Map<string, DaySection>()

  for (const transaction of sorted) {
    const dayKey = getKyivDayKey(transaction.transactionTime)
    const section = sections.get(dayKey) ?? {
      dayKey,
      title: formatDayKey(dayKey, 'uk-UA', DAY_TITLE_OPTIONS),
      totalUah: 0,
      data: [],
    }
    section.data.push(transaction)
    section.totalUah += Math.abs(getTransactionAmountUah(transaction) ?? 0)
    sections.set(dayKey, section)
  }

  return [...sections.values()]
}
