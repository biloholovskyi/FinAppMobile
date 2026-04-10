import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/shared/api/transactions'
import { getMonthBudget } from '@/shared/api/budgets'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { aggregateCategorySpending } from './lib/aggregateCategorySpending'
import type { AggregateResult } from './lib/aggregateCategorySpending'

function toMonthStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01T00:00:00.000Z`
}

export function useCategorySpendingScreen(): {
  selectedMonth: Date
  handlePrevMonth: () => void
  handleNextMonth: () => void
  isNextDisabled: boolean
  isLoading: boolean
  isError: boolean
  rows: AggregateResult['rows']
  summary: AggregateResult['summary']
} {
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const monthStr = toMonthStr(selectedMonth)
  const todayMonthStr = toMonthStr(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )

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

  const { rows, summary } = aggregateCategorySpending(
    transactions,
    budgetData?.budgetRows ?? [],
    selectedMonth,
  )

  const handlePrevMonth = () => {
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  return {
    selectedMonth,
    handlePrevMonth,
    handleNextMonth,
    isNextDisabled: monthStr >= todayMonthStr,
    isLoading: txLoading || budgetLoading,
    isError: txError || budgetError,
    rows,
    summary,
  }
}
