import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/shared/api/transactions'
import { getMonthBudget } from '@/shared/api/budgets'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import type { Transaction } from '@/entities/transaction'
import { toBudgetMonthKey, type MonthKey } from '@/shared/utils/kyivCalendar'
import { aggregateCategorySpending } from './lib/aggregateCategorySpending'
import type { AggregateResult } from './lib/aggregateCategorySpending'

export type SpendingData = AggregateResult & {
  /** Все загруженные транзакции — тот же кэш, что у ленты операций. */
  transactions: Transaction[]
  isLoading: boolean
  isError: boolean
}

/** Загружает транзакции и бюджет киевского месяца и агрегирует их в строки расходов. */
export function useSpendingData(month: MonthKey): SpendingData {
  const monthStr = toBudgetMonthKey(month)
  const {
    data: transactions = [],
    isLoading: txLoading,
    isError: txError,
  } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: fetchTransactions,
  })

  const {
    data: budgetData,
    isLoading: budgetLoading,
    isError: budgetError,
  } = useQuery({
    queryKey: QUERY_KEYS.budgets.month(monthStr),
    queryFn: () => getMonthBudget(monthStr),
  })

  const { rows, summary } = useMemo(
    () =>
      aggregateCategorySpending(
        transactions,
        budgetData?.budgetRows ?? [],
        month,
      ),
    [transactions, budgetData, month],
  )

  return {
    transactions,
    rows,
    summary,
    isLoading: txLoading || budgetLoading,
    isError: txError || budgetError,
  }
}
