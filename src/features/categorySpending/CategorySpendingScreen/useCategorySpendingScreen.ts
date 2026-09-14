import { useMemo } from 'react'
import { SPENDING_VIEW_MODE } from '@/shared/constants'
import { flattenSpendingRows } from './lib/flattenSpendingRows'
import type { SpendingListItem } from './lib/flattenSpendingRows'
import { useMonthNavigation } from './useMonthNavigation'
import { useSpendingData } from './useSpendingData'
import { useSpendingViewMode } from './useSpendingViewMode'

/** Состояние экрана расходов по категориям. */
export function useCategorySpendingScreen() {
  const month = useMonthNavigation()
  const mode = useSpendingViewMode()
  const { rows, summary, isLoading, isError } = useSpendingData(
    month.monthStr,
    month.selectedMonth,
  )

  const listItems = useMemo<SpendingListItem[]>(() => {
    if (mode.viewMode === SPENDING_VIEW_MODE.categories) {
      return rows.map((row) => ({ kind: 'category', row }))
    }
    return flattenSpendingRows(rows, summary.totalSpent).map((row) => ({
      kind: 'flat',
      row,
    }))
  }, [mode.viewMode, rows, summary.totalSpent])

  return { ...month, ...mode, isLoading, isError, listItems, summary }
}
