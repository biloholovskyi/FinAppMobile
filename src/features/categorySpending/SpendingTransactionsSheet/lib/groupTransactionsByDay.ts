import type { Transaction } from '@/entities/transaction'
import { getTransactionAmountUah } from '@/entities/transaction'

/** Секция шторки: транзакции одного локального дня. */
export type DaySection = {
  /** Локальная дата `YYYY-MM-DD`. */
  dayKey: string
  title: string
  /** Сумма дня в UAH, копейки, по модулю. */
  totalUah: number
  data: Transaction[]
}

const DAY_KEY_PAD = 2

/** Локальная дата `YYYY-MM-DD` — ключ дня, не зависящий от часового пояса сервера. */
function toDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(DAY_KEY_PAD, '0')
  const day = String(date.getDate()).padStart(DAY_KEY_PAD, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function formatDayTitle(date: Date): string {
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', weekday: 'long' })
}

/**
 * Группирует транзакции по локальным дням; дни и записи внутри — новые сверху.
 *
 * @param transactions Транзакции листа.
 */
export function groupTransactionsByDay(transactions: Transaction[]): DaySection[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.transactionTime).getTime() - new Date(a.transactionTime).getTime(),
  )
  const sections = new Map<string, DaySection>()

  for (const transaction of sorted) {
    const date = new Date(transaction.transactionTime)
    const dayKey = toDayKey(date)
    const section = sections.get(dayKey) ?? {
      dayKey,
      title: formatDayTitle(date),
      totalUah: 0,
      data: [],
    }
    section.data.push(transaction)
    section.totalUah += Math.abs(getTransactionAmountUah(transaction) ?? 0)
    sections.set(dayKey, section)
  }

  return [...sections.values()]
}
