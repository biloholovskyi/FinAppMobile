import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/shared/api/transactions'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { PERCENT_MULTIPLIER } from '@/shared/constants'
import {
  getDayOfMonth,
  getKyivToday,
  getMonthKeyOfDay,
  shiftMonthKey,
  splitMonthKey,
} from '@/shared/utils/kyivCalendar'
import { aggregateExpenses } from '../lib/aggregateExpenses'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const MONTH_NAMES_GENITIVE = [
  'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
  'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря',
]

export function useDashboardScreen() {
  const { data: transactions = [], isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: fetchTransactions,
  })

  const today = getKyivToday()
  const currentDay = getDayOfMonth(today)
  const currentMonth = getMonthKeyOfDay(today)
  const currentMonthIndex = splitMonthKey(currentMonth).month - 1
  const prevMonthIndex = splitMonthKey(shiftMonthKey(currentMonth, -1)).month - 1

  const { totalCurrent, totalPrev, chartDataCurrent, chartDataProjected, chartDataPrev } =
    useMemo(() => aggregateExpenses(transactions, today), [transactions, today])

  const diff = totalCurrent - totalPrev
  const percentChange =
    totalPrev > 0 ? (diff / totalPrev) * PERCENT_MULTIPLIER : 0

  return {
    isLoading,
    totalCurrent,
    totalPrev,
    diff,
    percentChange,
    currentDayOfMonth: currentDay,
    currentMonthName: MONTH_NAMES[currentMonthIndex] ?? '',
    currentMonthNameGenitive: MONTH_NAMES_GENITIVE[currentMonthIndex] ?? '',
    prevMonthName: MONTH_NAMES[prevMonthIndex] ?? '',
    prevMonthNameGenitive: MONTH_NAMES_GENITIVE[prevMonthIndex] ?? '',
    chartDataCurrent,
    chartDataProjected,
    chartDataPrev,
  }
}
