import { OVER_BUDGET_SECTION_SUFFIX } from '@/shared/constants'
import { useMonthNavigation } from './useMonthNavigation'
import { useOverBudgetFilter } from './useOverBudgetFilter'
import { useSpendingData } from './useSpendingData'
import { useSpendingListItems } from './useSpendingListItems'
import { useSpendingViewMode } from './useSpendingViewMode'

/** Состояние экрана расходов по категориям. */
export function useCategorySpendingScreen() {
  const month = useMonthNavigation()
  const mode = useSpendingViewMode()
  const filter = useOverBudgetFilter()
  const { rows, summary, isLoading, isError } = useSpendingData(month.month)

  const { listItems, hasAnyItems, overStats } = useSpendingListItems({
    rows,
    totalSpent: summary.totalSpent,
    viewMode: mode.viewMode,
    isOverOnly: filter.isOverOnly,
  })

  const sectionLabel = filter.isOverOnly
    ? mode.sectionLabel + OVER_BUDGET_SECTION_SUFFIX
    : mode.sectionLabel

  return {
    ...month,
    ...mode,
    ...filter,
    sectionLabel,
    isLoading,
    isError,
    listItems,
    hasAnyItems,
    overStats,
    summary,
  }
}
