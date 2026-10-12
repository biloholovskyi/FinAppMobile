import { useMemo, useState } from 'react'
import { useSpendingData } from '../CategorySpendingScreen/useSpendingData'
import { flattenSpendingRows } from '../CategorySpendingScreen/lib/flattenSpendingRows'
import type { FlatSpendingRow } from '../CategorySpendingScreen/lib/flattenSpendingRows'
import { filterLeafTransactions, findLeafRow, parseSpendingLeafKey } from '../lib/spendingLeaf'
import type { MonthKey } from '@/shared/utils/kyivCalendar'
import { groupTransactionsByDay } from './lib/groupTransactionsByDay'

type Params = { leafKey: string; month: MonthKey }

/** Последняя найденная строка листа вместе с ключами, к которым она относится. */
type LastRow = { leafKey: string; month: MonthKey; row: FlatSpendingRow }

/**
 * Данные листа расходов из тех же запросов, что у экрана расходов.
 * Строка листа сохраняется после удаления последней транзакции,
 * чтобы шапка и бюджет остались на пустом состоянии.
 */
export function useSpendingLeafData({ leafKey, month }: Params) {
  const { transactions, rows, summary, isLoading, isError } = useSpendingData(month)

  const row = useMemo(
    () => findLeafRow(flattenSpendingRows(rows, summary.totalSpent), leafKey),
    [rows, summary.totalSpent, leafKey],
  )
  const [last, setLast] = useState<LastRow | null>(null)
  if (row && row !== last?.row) setLast({ leafKey, month, row })
  const lastRow = last?.leafKey === leafKey && last.month === month ? last.row : null

  const leafTransactions = useMemo(() => {
    const leaf = parseSpendingLeafKey(leafKey)
    return leaf ? filterLeafTransactions(transactions, leaf, month) : []
  }, [transactions, leafKey, month])

  const sections = useMemo(() => groupTransactionsByDay(leafTransactions), [leafTransactions])

  return {
    row: row ?? lastRow,
    spent: row?.totalSpent ?? 0,
    leafTransactions,
    sections,
    month,
    isLoading,
    isError,
  }
}
