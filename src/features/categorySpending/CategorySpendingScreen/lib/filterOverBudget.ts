import type { SpendingListItem } from './flattenSpendingRows'
import { getBudgetProgress } from './spendingFormat'

/** Расходы и бюджет элемента списка в копейках. */
export type ListItemBudget = {
  totalSpent: number
  /** Бюджет в копейках; `null` — бюджет не установлен. */
  budget: number | null
}

/** Статистика превышения бюджета по списку элементов. */
export type OverBudgetStats = {
  /** Число элементов с превышенным бюджетом. */
  overCount: number
  /** Число элементов с установленным бюджетом. */
  budgetedCount: number
  /** Суммарное превышение в копейках: `totalSpent − budget` по превышенным. */
  overspend: number
}

/** Возвращает расходы и бюджет элемента списка независимо от его вида. */
export function getListItemBudget(item: SpendingListItem): ListItemBudget {
  switch (item.kind) {
    case 'category':
    case 'flat':
      return { totalSpent: item.row.totalSpent, budget: item.row.budget }
    default: {
      const unreachable: never = item
      return unreachable
    }
  }
}

/**
 * Выбирает элементы с превышенным бюджетом за один проход.
 * Порядок элементов сохраняется.
 *
 * @param items Элементы списка текущего режима.
 */
export function selectOverBudget(items: SpendingListItem[]): {
  overItems: SpendingListItem[]
  stats: OverBudgetStats
} {
  const overItems: SpendingListItem[] = []
  const stats: OverBudgetStats = { overCount: 0, budgetedCount: 0, overspend: 0 }

  for (const item of items) {
    const { totalSpent, budget } = getListItemBudget(item)
    const { hasBudget, isExceeded } = getBudgetProgress(totalSpent, budget)
    if (hasBudget) stats.budgetedCount += 1
    if (!isExceeded || budget === null) continue
    stats.overCount += 1
    stats.overspend += totalSpent - budget
    overItems.push(item)
  }

  return { overItems, stats }
}
