import { useMemo } from 'react'
import { SPENDING_VIEW_MODE } from '@/shared/constants'
import type { SpendingViewMode } from '@/shared/constants'
import { flattenSpendingRows } from './lib/flattenSpendingRows'
import type { SpendingListItem } from './lib/flattenSpendingRows'
import { selectOverBudget } from './lib/filterOverBudget'
import type { OverBudgetStats } from './lib/filterOverBudget'
import type { CategorySpendingRow } from './lib/aggregateCategorySpending'

type UseSpendingListItemsParams = {
  rows: CategorySpendingRow[]
  /** Сумма всех расходов месяца в копейках. */
  totalSpent: number
  viewMode: SpendingViewMode
  isOverOnly: boolean
}

type SpendingListItemsState = {
  /** Элементы списка с учётом режима и фильтра превышения. */
  listItems: SpendingListItem[]
  /** Есть ли элементы в текущем режиме без учёта фильтра. */
  hasAnyItems: boolean
  /** Статистика превышения по элементам текущего режима. */
  overStats: OverBudgetStats
}

/** Собирает элементы списка под режим отображения и фильтр превышения. */
export function useSpendingListItems({
  rows,
  totalSpent,
  viewMode,
  isOverOnly,
}: UseSpendingListItemsParams): SpendingListItemsState {
  const allItems = useMemo<SpendingListItem[]>(() => {
    if (viewMode === SPENDING_VIEW_MODE.categories) {
      return rows.map((row) => ({ kind: 'category', row }))
    }
    return flattenSpendingRows(rows, totalSpent).map((row) => ({
      kind: 'flat',
      row,
    }))
  }, [viewMode, rows, totalSpent])

  const { overItems, stats } = useMemo(
    () => selectOverBudget(allItems),
    [allItems],
  )

  return {
    listItems: isOverOnly ? overItems : allItems,
    hasAnyItems: allItems.length > 0,
    overStats: stats,
  }
}
